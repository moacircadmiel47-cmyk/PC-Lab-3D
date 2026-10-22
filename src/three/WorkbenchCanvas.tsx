import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  useSimulatorStore,
  getSuggestedTargetSlotForItem,
} from '../store/useSimulatorStore';
import {
  SNAP_POINTS,
  getHardwareById,
} from '../data/catalog';
import {
  MotherboardSpec,
  RamSpec,
  GpuSpec,
  CoolerSpec,
  StorageSpec,
  SnapSlotId,
} from '../types/hardware';
import { validateInstallation } from '../engine/compatibility';

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createPcbTracesTexture(pcbHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = pcbHex;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle copper circuit traces
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 2;
  for (let i = 16; i < 512; i += 24) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 240);
    ctx.lineTo(i + 12, 260);
    ctx.lineTo(i + 12, 512);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  for (let j = 32; j < 512; j += 36) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(512, j);
    ctx.stroke();
  }

  // Solder pads
  ctx.fillStyle = 'rgba(234, 179, 8, 0.35)';
  for (let x = 32; x < 512; x += 64) {
    for (let y = 32; y < 512; y += 64) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createEsdMatTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.14)';
  ctx.lineWidth = 1;
  const step = 32;
  for (let x = 0; x <= 512; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, 496, 496);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  return tex;
}

export const WorkbenchCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);

  const installed = useSimulatorStore((s) => s.installed);
  const heldItemId = useSimulatorStore((s) => s.heldItemId);
  const heldRotationStep = useSimulatorStore((s) => s.heldRotationStep);
  const hoveredSnapSlot = useSimulatorStore((s) => s.hoveredSnapSlot);
  const cameraPreset = useSimulatorStore((s) => s.cameraPreset);
  const caseSidePanelOpen = useSimulatorStore((s) => s.caseSidePanelOpen);
  const isPoweredOn = useSimulatorStore((s) => s.isPoweredOn);
  const lowPerformanceMode = useSimulatorStore((s) => s.lowPerformanceMode);

  const setHoveredSnapSlot = useSimulatorStore((s) => s.setHoveredSnapSlot);
  const attemptInstallItem = useSimulatorStore((s) => s.attemptInstallItem);
  const setSelectedInspectItemId = useSimulatorStore((s) => s.setSelectedInspectItemId);
  const rotateHeldItem = useSimulatorStore((s) => s.rotateHeldItem);
  const cancelHeldItem = useSimulatorStore((s) => s.cancelHeldItem);

  // Store latest state & callbacks in refs so the Three.js loop never tears down on HUD updates
  const stateRef = useRef({
    installed,
    heldItemId,
    heldRotationStep,
    hoveredSnapSlot,
    cameraPreset,
    caseSidePanelOpen,
    isPoweredOn,
    lowPerformanceMode,
  });
  useEffect(() => {
    stateRef.current = {
      installed,
      heldItemId,
      heldRotationStep,
      hoveredSnapSlot,
      cameraPreset,
      caseSidePanelOpen,
      isPoweredOn,
      lowPerformanceMode,
    };
  }, [
    installed,
    heldItemId,
    heldRotationStep,
    hoveredSnapSlot,
    cameraPreset,
    caseSidePanelOpen,
    isPoweredOn,
    lowPerformanceMode,
  ]);

  const callbacksRef = useRef({
    setHoveredSnapSlot,
    attemptInstallItem,
    setSelectedInspectItemId,
    rotateHeldItem,
    cancelHeldItem,
  });
  useEffect(() => {
    callbacksRef.current = {
      setHoveredSnapSlot,
      attemptInstallItem,
      setSelectedInspectItemId,
      rotateHeldItem,
      cancelHeldItem,
    };
  }, [
    setHoveredSnapSlot,
    attemptInstallItem,
    setSelectedInspectItemId,
    rotateHeldItem,
    cancelHeldItem,
  ]);

  const rebuildSceneRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    const isSoftwareGl = detectSoftwareGl();

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && !stateRef.current.lowPerformanceMode,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError('WebGL não está disponível neste navegador ou dispositivo.');
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(
      isSoftwareGl || stateRef.current.lowPerformanceMode
        ? 1
        : Math.min(window.devicePixelRatio, 2)
    );
    renderer.shadowMap.enabled = !isSoftwareGl && !stateRef.current.lowPerformanceMode;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 640;
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    scene.fog = new THREE.FogExp2('#090d16', 0.055);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    camera.position.set(0.4, 3.8, 3.9);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 1.2;
    controls.maxDistance = 9.5;
    controls.target.set(0, 0.55, 0);

    // 3-Point Laboratory Lighting Rig (Warm Key + Cool Hemisphere Fill + Rim)
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.85);
    keyLight.position.set(3.5, 6.0, 4.0);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -3.5;
    keyLight.shadow.camera.right = 3.5;
    keyLight.shadow.camera.top = 3.5;
    keyLight.shadow.camera.bottom = -3.5;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.75);
    rimLight.position.set(-4.0, 3.5, -3.5);
    scene.add(rimLight);

    // Static Laboratory Workbench Table + Anti-Static ESD Mat
    const benchGroup = new THREE.Group();
    const tableGeo = new THREE.BoxGeometry(7.2, 0.24, 4.8);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.75,
      metalness: 0.15,
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.set(0, -0.12, 0);
    tableMesh.receiveShadow = true;
    benchGroup.add(tableMesh);

    const esdTex = createEsdMatTexture();
    esdTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const matGeo = new THREE.BoxGeometry(5.2, 0.02, 3.6);
    const matMaterial = new THREE.MeshStandardMaterial({
      map: esdTex,
      color: 0xffffff,
      roughness: 0.6,
      metalness: 0.08,
    });
    const esdMatMesh = new THREE.Mesh(matGeo, matMaterial);
    esdMatMesh.position.set(0, 0.01, 0);
    esdMatMesh.receiveShadow = true;
    benchGroup.add(esdMatMesh);

    // ESD Grounding Terminal Pin (Yellow button on corner of mat)
    const esdSnapGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 20);
    const esdSnapMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      metalness: 0.8,
      roughness: 0.25,
    });
    const esdSnap = new THREE.Mesh(esdSnapGeo, esdSnapMat);
    esdSnap.position.set(-2.4, 0.03, 1.6);
    benchGroup.add(esdSnap);

    scene.add(benchGroup);

    // Dynamic Hardware Group & Snap Points Group
    const hardwareGroup = new THREE.Group();
    scene.add(hardwareGroup);

    const snapIndicatorsGroup = new THREE.Group();
    scene.add(snapIndicatorsGroup);

    // Floating Ghost Group for 3D Dragging
    const ghostGroup = new THREE.Group();
    ghostGroup.visible = false;
    scene.add(ghostGroup);

    const ghostBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.14, 0.45),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.65,
        roughness: 0.2,
        metalness: 0.5,
      })
    );
    const ghostArrow = new THREE.Mesh(
      new THREE.ConeGeometry(0.09, 0.18, 4),
      new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    );
    ghostArrow.rotation.x = Math.PI / 2;
    ghostArrow.position.set(0, 0.12, -0.22);
    ghostGroup.add(ghostBody);
    ghostGroup.add(ghostArrow);

    const spinningFanMeshes: THREE.Object3D[] = [];
    const clickableMeshes: THREE.Object3D[] = [];
    const snapMeshesMap = new Map<SnapSlotId, THREE.Mesh>();

    // Build Snap Point 3D Rings
    SNAP_POINTS.forEach((sp) => {
      const ringGeo = new THREE.RingGeometry(0.11, 0.17, 28);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(sp.position[0], sp.position[1] + 0.02, sp.position[2]);
      ringMesh.userData = { snapSlotId: sp.id };

      // Invisible hit target cylinder for easy clicking/snapping without millimeter precision
      const hitGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.22, 16);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = { snapSlotId: sp.id };
      ringMesh.add(hitMesh);

      snapIndicatorsGroup.add(ringMesh);
      snapMeshesMap.set(sp.id, ringMesh);
      clickableMeshes.push(hitMesh);
    });

    const buildHardwareScene = () => {
      // Clear previous hardware meshes
      while (hardwareGroup.children.length > 0) {
        const child = hardwareGroup.children[0];
        hardwareGroup.remove(child);
      }
      spinningFanMeshes.length = 0;
      // Keep only snap hitMeshes in clickableMeshes
      clickableMeshes.length = 0;
      snapMeshesMap.forEach((ringMesh) => {
        if (ringMesh.children[0]) clickableMeshes.push(ringMesh.children[0]);
      });

      const { installed: inst, caseSidePanelOpen: panelOpen } = stateRef.current;

      // 1. CHASSIS / CASE
      if (inst.caseId) {
        const caseSpec = getHardwareById(inst.caseId);
        const caseGroup = new THREE.Group();
        const chassisColor =
          caseSpec && 'chassisColor' in caseSpec ? caseSpec.chassisColor : '#1e293b';

        const frameMat = new THREE.MeshStandardMaterial({
          color: chassisColor,
          roughness: 0.55,
          metalness: 0.65,
        });

        // Base tray under motherboard & PSU
        const tray = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.08, 2.9), frameMat);
        tray.position.set(0, 0.22, 0);
        tray.receiveShadow = true;
        tray.userData = { inspectItemId: inst.caseId, slotId: 'slot_case' };
        caseGroup.add(tray);
        clickableMeshes.push(tray);

        // Rear I/O wall
        const rearWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.05, 2.9), frameMat);
        rearWall.position.set(-1.86, 0.74, 0);
        caseGroup.add(rearWall);

        // Front Mesh Bezel
        const frontWall = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 1.05, 2.9),
          new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.4,
            metalness: 0.8,
          })
        );
        frontWall.position.set(1.86, 0.74, 0);
        caseGroup.add(frontWall);

        // Drive Cage Frame (Right side)
        const driveCage = new THREE.Mesh(
          new THREE.BoxGeometry(0.68, 0.55, 1.5),
          new THREE.MeshStandardMaterial({
            color: 0x334155,
            roughness: 0.5,
            metalness: 0.7,
          })
        );
        driveCage.position.set(1.52, 0.48, 0.05);
        caseGroup.add(driveCage);

        // Tempered Glass Top Cover (when closed)
        if (!panelOpen) {
          const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0x94a3b8,
            transparent: true,
            opacity: 0.24,
            roughness: 0.1,
            metalness: 0.1,
            depthWrite: false,
          });
          const glassCover = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.04, 2.85), glassMat);
          glassCover.position.set(0, 1.28, 0);
          glassCover.renderOrder = 10;
          caseGroup.add(glassCover);
        }

        hardwareGroup.add(caseGroup);
      }

      // 2. BRASS STANDOFFS
      if (inst.standoffsInstalled) {
        const standoffGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.12, 6);
        const standoffMat = new THREE.MeshStandardMaterial({
          color: 0xeab308,
          metalness: 0.9,
          roughness: 0.25,
        });
        const coords: [number, number][] = [
          [-1.25, -1.05],
          [0.55, -1.05],
          [-1.25, 0.85],
          [0.55, 0.85],
          [-0.35, -0.1],
          [-0.35, 0.85],
        ];
        coords.forEach(([sx, sz]) => {
          const pin = new THREE.Mesh(standoffGeo, standoffMat);
          pin.position.set(sx, 0.32, sz);
          hardwareGroup.add(pin);
        });
      }

      // 3. MOTHERBOARD
      if (inst.motherboardId) {
        const mb = getHardwareById(inst.motherboardId) as MotherboardSpec | undefined;
        if (mb) {
          const mbGroup = new THREE.Group();
          const pcbW = mb.formFactor === 'Mini-ITX' ? 1.85 : mb.formFactor === 'Micro-ATX' ? 2.25 : 2.35;
          const pcbD = mb.formFactor === 'Mini-ITX' ? 1.85 : mb.formFactor === 'Micro-ATX' ? 2.15 : 2.35;

          const pcbTex = createPcbTracesTexture(mb.pcbColor);
          pcbTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

          const pcbMesh = new THREE.Mesh(
            new THREE.BoxGeometry(pcbW, 0.06, pcbD),
            new THREE.MeshStandardMaterial({
              map: pcbTex,
              color: 0xffffff,
              roughness: 0.42,
              metalness: 0.2,
            })
          );
          pcbMesh.position.set(-0.3, 0.41, -0.08);
          pcbMesh.castShadow = true;
          pcbMesh.receiveShadow = true;
          pcbMesh.userData = { inspectItemId: mb.id, slotId: 'slot_motherboard' };
          mbGroup.add(pcbMesh);
          clickableMeshes.push(pcbMesh);

          // VRM Heatsinks (Left & Top of Socket)
          const hsMat = new THREE.MeshStandardMaterial({
            color: mb.heatsinkColor,
            metalness: 0.8,
            roughness: 0.28,
          });
          const vrmLeft = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.24, 0.72), hsMat);
          vrmLeft.position.set(-1.02, 0.54, -0.55);
          mbGroup.add(vrmLeft);

          const vrmTop = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.22, 0.18), hsMat);
          vrmTop.position.set(-0.55, 0.53, -1.02);
          mbGroup.add(vrmTop);

          // Rear I/O Shield Block
          const ioBlock = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.34, 0.95),
            new THREE.MeshStandardMaterial({
              color: 0xcbd5e1,
              metalness: 0.85,
              roughness: 0.22,
            })
          );
          ioBlock.position.set(-1.32, 0.6, -0.38);
          mbGroup.add(ioBlock);

          // CPU Socket Base + Retention Frame
          const socketBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.56, 0.06, 0.56),
            new THREE.MeshStandardMaterial({
              color: mb.platform === 'AMD' ? 0x1e293b : 0xd4d4d8,
              roughness: 0.4,
              metalness: 0.5,
            })
          );
          socketBase.position.set(-0.55, 0.47, -0.55);
          mbGroup.add(socketBase);

          // Gold Pin 1 Corner Marker on Socket
          const pin1Marker = new THREE.Mesh(
            new THREE.ConeGeometry(0.05, 0.02, 3),
            new THREE.MeshBasicMaterial({ color: 0xfacc15 })
          );
          pin1Marker.position.set(-0.8, 0.51, -0.8);
          mbGroup.add(pin1Marker);

          // DIMM RAM Slots (2 or 4 depending on motherboard)
          const slotXs = [0.18, 0.34, 0.5, 0.66];
          for (let i = 0; i < mb.ramSlots; i++) {
            const dimmSlot = new THREE.Mesh(
              new THREE.BoxGeometry(0.08, 0.09, 0.92),
              new THREE.MeshStandardMaterial({
                color: i % 2 === 1 ? mb.colorAccent : 0x27272a,
                roughness: 0.5,
                metalness: 0.2,
              })
            );
            dimmSlot.position.set(slotXs[i], 0.48, -0.55);
            mbGroup.add(dimmSlot);
          }

          // PCI Express x16 Slot
          const pcieSlot = new THREE.Mesh(
            new THREE.BoxGeometry(0.95, 0.08, 0.1),
            new THREE.MeshStandardMaterial({
              color: 0x94a3b8,
              metalness: 0.75,
              roughness: 0.3,
            })
          );
          pcieSlot.position.set(-0.55, 0.48, 0.36);
          mbGroup.add(pcieSlot);

          // PCIe x1 Slot (if available)
          if (mb.pcieX1Slots > 0) {
            const pcie1Slot = new THREE.Mesh(
              new THREE.BoxGeometry(0.32, 0.07, 0.09),
              new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
            );
            pcie1Slot.position.set(-0.55, 0.48, 0.92);
            mbGroup.add(pcie1Slot);
          }

          // Chipset PCH Heatsink
          const pchHeatsink = new THREE.Mesh(
            new THREE.BoxGeometry(0.46, 0.12, 0.46),
            new THREE.MeshStandardMaterial({
              color: mb.colorAccent,
              metalness: 0.75,
              roughness: 0.25,
            })
          );
          pchHeatsink.position.set(0.35, 0.49, 0.65);
          mbGroup.add(pchHeatsink);

          // 24-pin ATX & 8-pin EPS Headers
          const atxHeader = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.12, 0.46),
            new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
          );
          atxHeader.position.set(0.82, 0.49, -0.25);
          mbGroup.add(atxHeader);

          // Diagnostic Status LEDs (CPU, DRAM, VGA, BOOT)
          const ledColors = stateRef.current.isPoweredOn
            ? [0x10b981, 0x10b981, 0x10b981, 0x10b981]
            : [0x334155, 0x334155, 0x334155, 0x334155];
          ledColors.forEach((col, idx) => {
            const led = new THREE.Mesh(
              new THREE.BoxGeometry(0.03, 0.02, 0.03),
              new THREE.MeshBasicMaterial({ color: col })
            );
            led.position.set(0.8, 0.46, -0.65 + idx * 0.06);
            mbGroup.add(led);
          });

          hardwareGroup.add(mbGroup);
        }
      }

      // 4. INSTALLED CPU & THERMAL PASTE
      if (inst.cpuId) {
        const cpuSpec = getHardwareById(inst.cpuId);
        const cpuGroup = new THREE.Group();
        const substrate = new THREE.Mesh(
          new THREE.BoxGeometry(0.42, 0.04, 0.42),
          new THREE.MeshStandardMaterial({
            color: cpuSpec?.manufacturer === 'AMD' ? 0x065f46 : 0x1e3a8a,
            roughness: 0.5,
            metalness: 0.2,
          })
        );
        const ihs = new THREE.Mesh(
          new THREE.BoxGeometry(0.34, 0.05, 0.34),
          new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            metalness: 0.9,
            roughness: 0.18,
          })
        );
        ihs.position.y = 0.04;
        cpuGroup.add(substrate);
        cpuGroup.add(ihs);

        if (inst.thermalPasteApplied) {
          const pasteDrop = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.1, 0.02, 20),
            new THREE.MeshStandardMaterial({
              color: 0x94a3b8,
              roughness: 0.35,
              metalness: 0.1,
            })
          );
          pasteDrop.position.y = 0.075;
          cpuGroup.add(pasteDrop);
        }

        cpuGroup.position.set(-0.55, 0.53, -0.55);
        cpuGroup.userData = { inspectItemId: inst.cpuId, slotId: 'slot_cpu' };
        substrate.userData = { inspectItemId: inst.cpuId, slotId: 'slot_cpu' };
        ihs.userData = { inspectItemId: inst.cpuId, slotId: 'slot_cpu' };
        clickableMeshes.push(substrate, ihs);
        hardwareGroup.add(cpuGroup);
      }

      // 5. INSTALLED COOLER (AIR OR AIO LIQUID)
      if (inst.coolerId) {
        const cooler = getHardwareById(inst.coolerId) as CoolerSpec | undefined;
        if (cooler) {
          const coolerGroup = new THREE.Group();

          if (cooler.coolerType === 'AIO_LIQUID_240') {
            // Pump block on CPU
            const pumpBlock = new THREE.Mesh(
              new THREE.CylinderGeometry(0.24, 0.24, 0.22, 28),
              new THREE.MeshStandardMaterial({
                color: 0x0f172a,
                metalness: 0.7,
                roughness: 0.2,
              })
            );
            pumpBlock.position.set(-0.55, 0.68, -0.55);
            pumpBlock.userData = { inspectItemId: cooler.id, slotId: 'slot_cooler' };
            clickableMeshes.push(pumpBlock);
            coolerGroup.add(pumpBlock);

            // Illuminated RGB ring on pump cap
            const pumpCap = new THREE.Mesh(
              new THREE.RingGeometry(0.14, 0.2, 28),
              new THREE.MeshBasicMaterial({
                color: stateRef.current.isPoweredOn ? 0x06b6d4 : 0x334155,
                side: THREE.DoubleSide,
              })
            );
            pumpCap.rotation.x = -Math.PI / 2;
            pumpCap.position.set(-0.55, 0.795, -0.55);
            coolerGroup.add(pumpCap);

            // Top/Rear 240mm Radiator + 2 Fans
            const radiator = new THREE.Mesh(
              new THREE.BoxGeometry(1.4, 0.14, 0.62),
              new THREE.MeshStandardMaterial({
                color: 0x18181b,
                metalness: 0.6,
                roughness: 0.4,
              })
            );
            radiator.position.set(-0.35, 1.12, -1.25);
            coolerGroup.add(radiator);

            [-0.7, 0.0].forEach((fx) => {
              const fanHub = new THREE.Group();
              fanHub.position.set(fx, 1.03, -1.25);
              for (let b = 0; b < 7; b++) {
                const blade = new THREE.Mesh(
                  new THREE.BoxGeometry(0.22, 0.015, 0.06),
                  new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 })
                );
                blade.rotation.y = (b * Math.PI * 2) / 7;
                blade.position.x = Math.cos(blade.rotation.y) * 0.1;
                blade.position.z = Math.sin(blade.rotation.y) * 0.1;
                fanHub.add(blade);
              }
              coolerGroup.add(fanHub);
              spinningFanMeshes.push(fanHub);
            });
          } else {
            // Air Tower or Low-Profile / Stock Cooler
            const hScale = cooler.coolerType === 'AIR_TOWER' ? 0.56 : 0.22;
            const finStack = new THREE.Mesh(
              new THREE.BoxGeometry(0.46, hScale, 0.44),
              new THREE.MeshStandardMaterial({
                color: 0xcbd5e1,
                metalness: 0.85,
                roughness: 0.25,
              })
            );
            finStack.position.set(-0.55, 0.58 + hScale / 2, -0.55);
            finStack.castShadow = true;
            finStack.userData = { inspectItemId: cooler.id, slotId: 'slot_cooler' };
            clickableMeshes.push(finStack);
            coolerGroup.add(finStack);

            // Copper Heatpipes
            const pipeMat = new THREE.MeshStandardMaterial({
              color: 0xd97706,
              metalness: 0.92,
              roughness: 0.18,
            });
            [-0.14, -0.05, 0.05, 0.14].forEach((px) => {
              const pipe = new THREE.Mesh(
                new THREE.CylinderGeometry(0.022, 0.022, hScale + 0.06, 12),
                pipeMat
              );
              pipe.position.set(-0.55 + px, 0.58 + hScale / 2, -0.55);
              coolerGroup.add(pipe);
            });

            // Spinning Fan on top/side
            const fanGroup = new THREE.Group();
            fanGroup.position.set(-0.55, 0.6 + hScale + 0.03, -0.55);
            const hub = new THREE.Mesh(
              new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16),
              new THREE.MeshStandardMaterial({ color: 0x0f172a })
            );
            fanGroup.add(hub);
            for (let b = 0; b < 7; b++) {
              const blade = new THREE.Mesh(
                new THREE.BoxGeometry(0.18, 0.012, 0.05),
                new THREE.MeshStandardMaterial({
                  color: stateRef.current.isPoweredOn ? 0x38bdf8 : 0x475569,
                })
              );
              const angle = (b * Math.PI * 2) / 7;
              blade.rotation.y = angle;
              blade.position.set(Math.cos(angle) * 0.1, 0, Math.sin(angle) * 0.1);
              fanGroup.add(blade);
            }
            coolerGroup.add(fanGroup);
            spinningFanMeshes.push(fanGroup);
          }

          hardwareGroup.add(coolerGroup);
        }
      }

      // 6. INSTALLED RAM MODULES (WITH DISTINCT GENERATION GEOMETRY)
      const ramSlotCoords: Record<keyof InstalledHardwareState['ramSlots'], number> = {
        slot_ram_1: 0.18,
        slot_ram_2: 0.34,
        slot_ram_3: 0.5,
        slot_ram_4: 0.66,
      };
      (Object.keys(ramSlotCoords) as Array<keyof InstalledHardwareState['ramSlots']>).forEach(
        (slotKey) => {
          const ramId = inst.ramSlots[slotKey];
          if (!ramId) return;
          const ram = getHardwareById(ramId) as RamSpec | undefined;
          if (!ram) return;

          const ramGroup = new THREE.Group();
          const xPos = ramSlotCoords[slotKey];

          // Main PCB / Heatspreader body
          const stickMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.32, 0.88),
            new THREE.MeshStandardMaterial({
              color: ram.heatspreaderColor,
              metalness: ram.hasHeatspreader ? 0.78 : 0.25,
              roughness: ram.hasHeatspreader ? 0.25 : 0.55,
            })
          );
          stickMesh.position.set(xPos, 0.66, -0.55);
          stickMesh.castShadow = true;
          stickMesh.userData = { inspectItemId: ram.id, slotId: slotKey };
          clickableMeshes.push(stickMesh);
          ramGroup.add(stickMesh);

          // Top Accent Bar showing DDR generation color
          const topBar = new THREE.Mesh(
            new THREE.BoxGeometry(0.055, 0.04, 0.88),
            new THREE.MeshStandardMaterial({
              color: ram.colorAccent,
              emissive: stateRef.current.isPoweredOn ? ram.colorAccent : '#000000',
              emissiveIntensity: stateRef.current.isPoweredOn ? 0.45 : 0,
            })
          );
          topBar.position.set(xPos, 0.83, -0.55);
          ramGroup.add(topBar);

          hardwareGroup.add(ramGroup);
        }
      );

      // 7. INSTALLED M.2 SSDs
      const m2Coords: Record<'slot_m2_1' | 'slot_m2_2', number> = {
        slot_m2_1: 0.08,
        slot_m2_2: 0.72,
      };
      (['slot_m2_1', 'slot_m2_2'] as const).forEach((m2Key) => {
        const m2Id = inst.m2Slots[m2Key];
        if (!m2Id) return;
        const m2Spec = getHardwareById(m2Id) as StorageSpec | undefined;
        if (!m2Spec) return;

        const m2Mesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.62, 0.03, 0.18),
          new THREE.MeshStandardMaterial({
            color: m2Spec.storageType === 'SSD_M2_SATA' ? 0x15803d : 0x18181b,
            metalness: 0.5,
            roughness: 0.35,
          })
        );
        m2Mesh.position.set(-0.45, 0.48, m2Coords[m2Key]);
        m2Mesh.userData = { inspectItemId: m2Spec.id, slotId: m2Key };
        clickableMeshes.push(m2Mesh);

        // Controller chip on M.2
        const ctrlChip = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.04, 0.12),
          new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.85, roughness: 0.2 })
        );
        ctrlChip.position.set(-0.62, 0.49, m2Coords[m2Key]);
        hardwareGroup.add(m2Mesh);
        hardwareGroup.add(ctrlChip);
      });

      // 8. INSTALLED SATA DRIVES (3.5" HDD WITH VISIBLE CUTAWAY PLATTER OR 2.5" SSD)
      const bayCoords: Record<'slot_drive_bay_1' | 'slot_drive_bay_2', number> = {
        slot_drive_bay_1: -0.35,
        slot_drive_bay_2: 0.45,
      };
      (['slot_drive_bay_1', 'slot_drive_bay_2'] as const).forEach((bayKey) => {
        const driveId = inst.driveBays[bayKey];
        if (!driveId) return;
        const drive = getHardwareById(driveId) as StorageSpec | undefined;
        if (!drive) return;

        const driveGroup = new THREE.Group();
        const is35 = drive.formFactor === '3.5_INCH';
        const dW = is35 ? 0.56 : 0.42;
        const dH = is35 ? 0.14 : 0.06;
        const dD = is35 ? 0.78 : 0.58;

        const casing = new THREE.Mesh(
          new THREE.BoxGeometry(dW, dH, dD),
          new THREE.MeshStandardMaterial({
            color: drive.storageType === 'HDD' ? 0x1e293b : 0x991b1b,
            metalness: 0.7,
            roughness: 0.3,
          })
        );
        casing.position.set(1.52, 0.52, bayCoords[bayKey]);
        casing.castShadow = true;
        casing.userData = { inspectItemId: drive.id, slotId: bayKey };
        clickableMeshes.push(casing);
        driveGroup.add(casing);

        // If it's an HDD, render an exposed glass inspection window with spinning platter & actuator arm right on the workbench!
        if (drive.storageType === 'HDD') {
          const platter = new THREE.Mesh(
            new THREE.CylinderGeometry(0.21, 0.21, 0.015, 32),
            new THREE.MeshStandardMaterial({
              color: 0xe2e8f0,
              metalness: 0.96,
              roughness: 0.08,
            })
          );
          platter.position.set(1.52, 0.52 + dH / 2 + 0.008, bayCoords[bayKey] - 0.06);
          driveGroup.add(platter);
          spinningFanMeshes.push(platter);

          const spindle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.03, 16),
            new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2 })
          );
          spindle.position.copy(platter.position);
          driveGroup.add(spindle);

          const arm = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 0.018, 0.04),
            new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 })
          );
          arm.position.set(1.46, 0.52 + dH / 2 + 0.02, bayCoords[bayKey] + 0.16);
          arm.rotation.y = 0.45;
          driveGroup.add(arm);
        }

        hardwareGroup.add(driveGroup);
      });

      // 9. INSTALLED GPU & PCIe ADDON CARD
      if (inst.gpuId) {
        const gpu = getHardwareById(inst.gpuId) as GpuSpec | undefined;
        if (gpu) {
          const gpuGroup = new THREE.Group();
          const cardLen = (gpu.lengthMm / 305) * 1.45;

          const shroud = new THREE.Mesh(
            new THREE.BoxGeometry(cardLen, 0.36, 0.16),
            new THREE.MeshStandardMaterial({
              color: 0x18181b,
              metalness: 0.65,
              roughness: 0.32,
            })
          );
          shroud.position.set(-1.15 + cardLen / 2, 0.72, 0.36);
          shroud.castShadow = true;
          shroud.userData = { inspectItemId: gpu.id, slotId: 'slot_gpu_pcie16' };
          clickableMeshes.push(shroud);
          gpuGroup.add(shroud);

          const accentStrip = new THREE.Mesh(
            new THREE.BoxGeometry(cardLen, 0.04, 0.17),
            new THREE.MeshBasicMaterial({ color: gpu.colorAccent })
          );
          accentStrip.position.set(-1.15 + cardLen / 2, 0.89, 0.36);
          gpuGroup.add(accentStrip);

          hardwareGroup.add(gpuGroup);
        }
      }

      if (inst.pcieAddonId) {
        const addon = getHardwareById(inst.pcieAddonId) as GpuSpec | undefined;
        if (addon) {
          const addonMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.55, 0.24, 0.06),
            new THREE.MeshStandardMaterial({
              color: 0x0284c7,
              metalness: 0.5,
              roughness: 0.4,
            })
          );
          addonMesh.position.set(-0.85, 0.64, 0.92);
          addonMesh.userData = { inspectItemId: addon.id, slotId: 'slot_pcie_x1' };
          clickableMeshes.push(addonMesh);
          hardwareGroup.add(addonMesh);
        }
      }

      // 10. INSTALLED PSU
      if (inst.psuId) {
        const psu = getHardwareById(inst.psuId);
        if (psu) {
          const psuGroup = new THREE.Group();
          const psuBody = new THREE.Mesh(
            new THREE.BoxGeometry(0.85, 0.44, 0.68),
            new THREE.MeshStandardMaterial({
              color: 0x0f172a,
              metalness: 0.7,
              roughness: 0.35,
            })
          );
          psuBody.position.set(-0.75, 0.48, 1.55);
          psuBody.castShadow = true;
          psuBody.userData = { inspectItemId: psu.id, slotId: 'slot_psu' };
          clickableMeshes.push(psuBody);
          psuGroup.add(psuBody);

          const labelStrip = new THREE.Mesh(
            new THREE.BoxGeometry(0.75, 0.18, 0.7),
            new THREE.MeshBasicMaterial({ color: psu.colorAccent })
          );
          labelStrip.position.set(-0.75, 0.48, 1.55);
          psuGroup.add(labelStrip);

          hardwareGroup.add(psuGroup);
        }
      }

      // 11. CMOS BATTERY & SPEAKER
      if (inst.cmosBatteryInstalled && inst.motherboardId) {
        const cmos = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.09, 0.025, 24),
          new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            metalness: 0.95,
            roughness: 0.12,
          })
        );
        cmos.position.set(0.05, 0.46, 0.52);
        hardwareGroup.add(cmos);
      }

      if (inst.beepSpeakerInstalled && inst.motherboardId) {
        const buzzer = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16),
          new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 })
        );
        buzzer.position.set(0.58, 0.48, 0.95);
        hardwareGroup.add(buzzer);
      }

      // 12. ROUTED 3D CABLES
      const createCableTube = (points: THREE.Vector3[], colorHex: number, radius = 0.026) => {
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, radius, 8, false);
        const tubeMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          roughness: 0.6,
          metalness: 0.15,
        });
        return new THREE.Mesh(tubeGeo, tubeMat);
      };

      if (inst.cables.atx24Pin && inst.motherboardId && inst.psuId) {
        hardwareGroup.add(
          createCableTube(
            [
              new THREE.Vector3(-0.35, 0.52, 1.45),
              new THREE.Vector3(0.95, 0.48, 1.1),
              new THREE.Vector3(1.02, 0.55, -0.25),
              new THREE.Vector3(0.82, 0.54, -0.25),
            ],
            0x10b981,
            0.036
          )
        );
      }

      if (inst.cables.cpuEps && inst.motherboardId && inst.psuId) {
        hardwareGroup.add(
          createCableTube(
            [
              new THREE.Vector3(-0.95, 0.52, 1.45),
              new THREE.Vector3(-1.48, 0.48, 0.3),
              new THREE.Vector3(-1.45, 0.55, -1.05),
              new THREE.Vector3(-1.15, 0.54, -1.05),
            ],
            0x38bdf8,
            0.028
          )
        );
      }

      if (inst.cables.pciePower && inst.gpuId && inst.psuId) {
        hardwareGroup.add(
          createCableTube(
            [
              new THREE.Vector3(-0.55, 0.55, 1.45),
              new THREE.Vector3(0.15, 0.72, 0.95),
              new THREE.Vector3(0.15, 0.92, 0.36),
            ],
            0xa855f7,
            0.028
          )
        );
      }

      if (inst.cables.sataData && inst.motherboardId) {
        hardwareGroup.add(
          createCableTube(
            [
              new THREE.Vector3(0.82, 0.5, 0.55),
              new THREE.Vector3(1.18, 0.46, 0.25),
              new THREE.Vector3(1.42, 0.52, -0.2),
            ],
            0xef4444,
            0.02
          )
        );
      }

      if (inst.cables.frontPanel && inst.motherboardId) {
        hardwareGroup.add(
          createCableTube(
            [
              new THREE.Vector3(1.75, 0.42, 1.15),
              new THREE.Vector3(1.15, 0.42, 1.12),
              new THREE.Vector3(0.75, 0.48, 1.05),
            ],
            0x14b8a6,
            0.018
          )
        );
      }
    };

    rebuildSceneRef.current = buildHardwareScene;
    buildHardwareScene();

    // Pre-allocate scratch math vectors for zero GC inside render loop
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.75);
    const dragIntersectPoint = new THREE.Vector3();
    const targetCamPos = new THREE.Vector3(0.4, 3.8, 3.9);
    const targetLookAt = new THREE.Vector3(0, 0.55, 0);
    let activePresetCache = stateRef.current.cameraPreset;

    const applyCameraPresetTarget = (preset: typeof stateRef.current.cameraPreset) => {
      switch (preset) {
        case 'SOCKET_CPU':
          targetCamPos.set(-0.55, 2.05, 0.55);
          targetLookAt.set(-0.55, 0.55, -0.55);
          break;
        case 'SLOTS_RAM':
          targetCamPos.set(0.45, 2.0, 0.55);
          targetLookAt.set(0.42, 0.58, -0.55);
          break;
        case 'STORAGE_HDD':
          targetCamPos.set(1.55, 1.85, 1.15);
          targetLookAt.set(1.52, 0.52, 0.0);
          break;
        case 'PCIE_GPU':
          targetCamPos.set(-0.35, 1.95, 1.65);
          targetLookAt.set(-0.45, 0.7, 0.36);
          break;
        case 'MOTHERBOARD_TOP':
          targetCamPos.set(-0.25, 3.45, 0.05);
          targetLookAt.set(-0.25, 0.45, -0.05);
          break;
        default:
          targetCamPos.set(0.4, 3.8, 3.9);
          targetLookAt.set(0, 0.55, 0);
          break;
      }
    };

    let cameraTransitionActive = false;
    controls.addEventListener('start', () => {
      cameraTransitionActive = false;
    });

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const { heldItemId: currentHeld } = stateRef.current;
      raycaster.setFromCamera(pointer, camera);

      if (currentHeld) {
        if (raycaster.ray.intersectPlane(dragPlane, dragIntersectPoint)) {
          ghostGroup.visible = true;
          ghostGroup.position.copy(dragIntersectPoint);
          ghostGroup.rotation.y = (stateRef.current.heldRotationStep * Math.PI) / 2;

          // Find closest snap point within magnetic range (0.72 units)
          let closestSlot: SnapSlotId | null = null;
          let minDist = 0.72;
          for (const sp of SNAP_POINTS) {
            const dx = dragIntersectPoint.x - sp.position[0];
            const dz = dragIntersectPoint.z - sp.position[2];
            const dist = Math.hypot(dx, dz);
            if (dist < minDist) {
              minDist = dist;
              closestSlot = sp.id;
            }
          }
          if (closestSlot !== stateRef.current.hoveredSnapSlot) {
            callbacksRef.current.setHoveredSnapSlot(closestSlot);
          }
          if (closestSlot) {
            const snapDef = SNAP_POINTS.find((s) => s.id === closestSlot);
            if (snapDef) {
              // Magnetic snap assist so students don't need millimeter accuracy
              ghostGroup.position.set(
                snapDef.position[0],
                snapDef.position[1] + 0.18,
                snapDef.position[2]
              );
            }
          }
        }
      } else {
        ghostGroup.visible = false;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const { heldItemId: currentHeld, hoveredSnapSlot: currentSnap } = stateRef.current;
      if (currentHeld && currentSnap) {
        callbacksRef.current.attemptInstallItem(currentHeld, currentSnap);
        return;
      }

      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const hitObj = hits[0].object;
        if (currentHeld && hitObj.userData.snapSlotId) {
          callbacksRef.current.attemptInstallItem(
            currentHeld,
            hitObj.userData.snapSlotId as SnapSlotId
          );
          return;
        }
        if (hitObj.userData.inspectItemId) {
          callbacksRef.current.setSelectedInspectItemId(
            hitObj.userData.inspectItemId as string
          );
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'r' || e.key === 'R') {
        if (stateRef.current.heldItemId) {
          callbacksRef.current.rotateHeldItem();
        }
      } else if (e.key === 'Escape') {
        if (stateRef.current.heldItemId) {
          callbacksRef.current.cancelHeldItem();
        }
      }
    };

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 640;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    // Software WebGL guard & paced loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const st = stateRef.current;

      // Check camera preset transitions
      if (st.cameraPreset !== activePresetCache) {
        activePresetCache = st.cameraPreset;
        applyCameraPresetTarget(st.cameraPreset);
        cameraTransitionActive = true;
      }

      if (cameraTransitionActive) {
        const k = 1 - Math.exp(-6 * dt);
        camera.position.lerp(targetCamPos, k);
        controls.target.lerp(targetLookAt, k);
        if (camera.position.distanceToSquared(targetCamPos) < 0.002) {
          cameraTransitionActive = false;
        }
      }

      controls.update();

      // Update Snap Point Ring visuals based on held item compatibility
      snapMeshesMap.forEach((ringMesh, slotId) => {
        const mat = ringMesh.material as THREE.MeshBasicMaterial;
        if (st.heldItemId) {
          const suggested = getSuggestedTargetSlotForItem(st.heldItemId, st.installed);
          const isHovered = st.hoveredSnapSlot === slotId;
          const isRelevant = suggested === slotId || isHovered;
          ringMesh.visible = true;

          const scale = isRelevant ? 1.18 + Math.sin(elapsed * 5) * 0.08 : 0.82;
          ringMesh.scale.set(scale, 1, scale);

          if (isHovered || isRelevant) {
            const check = validateInstallation(
              st.installed,
              st.heldItemId,
              slotId,
              st.heldRotationStep
            );
            if (check.allowed) {
              mat.color.setHex(0x10b981); // Valid emerald
              mat.opacity = isHovered ? 0.95 : 0.7;
            } else if (check.status === 'DEPENDENCY_MISSING') {
              mat.color.setHex(0xf59e0b); // Dependency amber
              mat.opacity = isHovered ? 0.95 : 0.65;
            } else {
              mat.color.setHex(0xef4444); // Incompatible red
              mat.opacity = isHovered ? 0.95 : 0.55;
            }
          } else {
            mat.color.setHex(0x475569);
            mat.opacity = 0.25;
          }
        } else {
          ringMesh.visible = false;
        }
      });

      // Spin fans & HDD platter when powered on
      if (st.isPoweredOn) {
        for (const fan of spinningFanMeshes) {
          fan.rotation.y += dt * 14.0;
        }
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Trigger scene rebuild whenever installed hardware or side panel state changes
  useEffect(() => {
    if (rebuildSceneRef.current) {
      rebuildSceneRef.current();
    }
  }, [installed, caseSidePanelOpen, isPoweredOn]);

  if (webglError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-950 p-6 text-center">
        <div className="max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Ambiente 3D Indisponível</h3>
          <p className="mt-2 text-sm text-slate-300">{webglError}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      data-testid="workbench-3d-canvas"
      className="h-full w-full cursor-grab active:cursor-grabbing"
      aria-label="Bancada tridimensional de montagem de computadores"
    />
  );
};
