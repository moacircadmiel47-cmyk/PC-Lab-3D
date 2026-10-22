import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { getHardwareById } from '../data/catalog';
import { RamSpec, StorageSpec } from '../types/hardware';

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

function createPlatterTracksTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Mirror metallic base
  const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 250);
  grad.addColorStop(0, '#cbd5e1');
  grad.addColorStop(0.5, '#e2e8f0');
  grad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Concentric didactic tracks (Trilhas)
  const radii = [75, 108, 140, 172, 204, 232];
  radii.forEach((r, idx) => {
    ctx.beginPath();
    ctx.arc(256, 256, r, 0, Math.PI * 2);
    ctx.strokeStyle = idx % 2 === 0 ? 'rgba(14, 165, 233, 0.45)' : 'rgba(15, 23, 42, 0.35)';
    ctx.lineWidth = 4;
    ctx.stroke();
  });

  // Radial sector dividers (Setores)
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.lineWidth = 2;
  for (let s = 0; s < 12; s++) {
    const angle = (s * Math.PI * 2) / 12;
    ctx.beginPath();
    ctx.moveTo(256 + Math.cos(angle) * 58, 256 + Math.sin(angle) * 58);
    ctx.lineTo(256 + Math.cos(angle) * 244, 256 + Math.sin(angle) * 244);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface ComponentMechanismCanvasProps {
  itemId: string;
  volatilePowerOn?: boolean;
}

export const ComponentMechanismCanvas: React.FC<ComponentMechanismCanvasProps> = ({
  itemId,
  volatilePowerOn = true,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const hddViewMode = useSimulatorStore((s) => s.hddViewMode);
  const hddOperation = useSimulatorStore((s) => s.hddOperation);
  const hddSpeedMultiplier = useSimulatorStore((s) => s.hddSpeedMultiplier);
  const hddTargetTrack = useSimulatorStore((s) => s.hddTargetTrack);
  const mechanismPlaying = useSimulatorStore((s) => s.mechanismPlaying);
  const selectedMotherboardRegionId = useSimulatorStore((s) => s.selectedMotherboardRegionId);

  const stateRef = useRef({
    itemId,
    hddViewMode,
    hddOperation,
    hddSpeedMultiplier,
    hddTargetTrack,
    mechanismPlaying,
    selectedMotherboardRegionId,
    volatilePowerOn,
  });

  useEffect(() => {
    stateRef.current = {
      itemId,
      hddViewMode,
      hddOperation,
      hddSpeedMultiplier,
      hddTargetTrack,
      mechanismPlaying,
      selectedMotherboardRegionId,
      volatilePowerOn,
    };
  }, [
    itemId,
    hddViewMode,
    hddOperation,
    hddSpeedMultiplier,
    hddTargetTrack,
    mechanismPlaying,
    selectedMotherboardRegionId,
    volatilePowerOn,
  ]);

  const rebuildRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 420;
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 40);
    camera.position.set(0, 3.2, 3.1);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.target.set(0, 0, 0);

    const hemi = new THREE.HemisphereLight(0xe0f2fe, 0x0f172a, 1.0);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.9);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    // Subtle reference grid floor
    const grid = new THREE.GridHelper(6, 16, 0x1e293b, 0x0f172a);
    grid.position.y = -0.65;
    scene.add(grid);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Animated references
    let hddPlatterGroup: THREE.Group | null = null;
    let hddActuatorPivot: THREE.Group | null = null;
    let hddReadWriteGlow: THREE.Mesh | null = null;
    let hddTopCoverMesh: THREE.Mesh | null = null;
    const pulsePackets: { mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; speed: number; phase: number }[] = [];
    const spinningParts: THREE.Object3D[] = [];
    const ramCellMeshes: THREE.Mesh[] = [];

    const buildMechanismModel = () => {
      while (rootGroup.children.length > 0) {
        rootGroup.remove(rootGroup.children[0]);
      }
      hddPlatterGroup = null;
      hddActuatorPivot = null;
      hddReadWriteGlow = null;
      hddTopCoverMesh = null;
      pulsePackets.length = 0;
      spinningParts.length = 0;
      ramCellMeshes.length = 0;

      const item = getHardwareById(stateRef.current.itemId);
      if (!item) return;

      const isHdd =
        item.category === 'storage' && (item as StorageSpec).storageType === 'HDD';

      if (isHdd) {
        // ====================================================================
        // SPECIAL MANDATORY 3D HDD INTERNAL DEMONSTRATION
        // ====================================================================
        const hddGroup = new THREE.Group();

        // 1. Cast Aluminum Alloy Enclosure Base
        const baseShell = new THREE.Mesh(
          new THREE.BoxGeometry(2.3, 0.28, 3.1),
          new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            metalness: 0.78,
            roughness: 0.32,
          })
        );
        baseShell.position.set(0, -0.14, 0);
        hddGroup.add(baseShell);

        // Bottom Green Controller PCB + SATA Connectors
        const controllerPcb = new THREE.Mesh(
          new THREE.BoxGeometry(2.15, 0.05, 1.4),
          new THREE.MeshStandardMaterial({
            color: 0x065f46,
            roughness: 0.45,
            metalness: 0.25,
          })
        );
        controllerPcb.position.set(0, -0.3, 0.75);
        hddGroup.add(controllerPcb);

        // SATA Data (7-pin) & Power (15-pin) Connector at Rear Edge
        const sataRearHeader = new THREE.Mesh(
          new THREE.BoxGeometry(1.1, 0.12, 0.18),
          new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 })
        );
        sataRearHeader.position.set(0, -0.12, 1.56);
        hddGroup.add(sataRearHeader);

        // 2. Magnetic Platters Stack (2 Stacked Mirror Disks + Track/Sector Overlay)
        const platterGroup = new THREE.Group();
        platterGroup.position.set(0, 0.08, -0.32);

        const platterTex = createPlatterTracksTexture();
        platterTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const topPlatter = new THREE.Mesh(
          new THREE.CylinderGeometry(0.95, 0.95, 0.03, 48),
          new THREE.MeshStandardMaterial({
            map: platterTex,
            color: 0xffffff,
            metalness: 0.88,
            roughness: 0.12,
          })
        );
        topPlatter.position.y = 0.06;
        platterGroup.add(topPlatter);

        const bottomPlatter = new THREE.Mesh(
          new THREE.CylinderGeometry(0.95, 0.95, 0.03, 48),
          new THREE.MeshStandardMaterial({
            color: 0xcbd5e1,
            metalness: 0.94,
            roughness: 0.1,
          })
        );
        bottomPlatter.position.y = -0.04;
        platterGroup.add(bottomPlatter);

        // Spindle Motor Hub
        const spindleHub = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.22, 0.18, 28),
          new THREE.MeshStandardMaterial({
            color: 0xfacc15,
            metalness: 0.92,
            roughness: 0.18,
          })
        );
        spindleHub.position.y = 0.02;
        platterGroup.add(spindleHub);

        hddGroup.add(platterGroup);
        hddPlatterGroup = platterGroup;

        // 3. Voice Coil Motor (Bobina de Voz) + Neodymium Magnet Bracket
        const voiceCoilMagnet = new THREE.Mesh(
          new THREE.CylinderGeometry(0.38, 0.38, 0.16, 24, 1, false, 0, Math.PI * 0.8),
          new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            metalness: 0.9,
            roughness: 0.22,
          })
        );
        voiceCoilMagnet.position.set(-0.68, 0.09, 0.88);
        hddGroup.add(voiceCoilMagnet);

        // 4. Actuator Arm Pivot (Braço Atuador + Cabeça de Leitura/Escrita)
        const actuatorPivot = new THREE.Group();
        actuatorPivot.position.set(-0.62, 0.16, 0.72);

        const pivotBearing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.14, 0.18, 24),
          new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            metalness: 0.9,
            roughness: 0.15,
          })
        );
        actuatorPivot.add(pivotBearing);

        // Triangular Actuator Arm reaching over platter
        const armMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 0.025, 1.15),
          new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            metalness: 0.88,
            roughness: 0.2,
          })
        );
        armMesh.position.set(0, 0.02, -0.55);
        actuatorPivot.add(armMesh);

        // Read/Write Slider Head at Tip of Arm
        const headSlider = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.03, 0.11),
          new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.8,
            roughness: 0.2,
          })
        );
        headSlider.position.set(0, 0.01, -1.1);
        actuatorPivot.add(headSlider);

        // Magnetic Read/Write Flux Ring under the Head
        const fluxRing = new THREE.Mesh(
          new THREE.RingGeometry(0.04, 0.11, 24),
          new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
          })
        );
        fluxRing.rotation.x = -Math.PI / 2;
        fluxRing.position.set(0, -0.01, -1.1);
        actuatorPivot.add(fluxRing);
        hddReadWriteGlow = fluxRing;

        hddGroup.add(actuatorPivot);
        hddActuatorPivot = actuatorPivot;

        // 5. Data Packets flowing from Actuator Flex Cable to SATA Controller
        for (let i = 0; i < 5; i++) {
          const pkt = new THREE.Mesh(
            new THREE.SphereGeometry(0.045, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
          );
          hddGroup.add(pkt);
          pulsePackets.push({
            mesh: pkt,
            start: new THREE.Vector3(-0.62, 0.15, 0.72),
            end: new THREE.Vector3(0.0, -0.05, 1.52),
            speed: 1.4,
            phase: i * 0.2,
          });
        }

        // 6. Top Metallic Cover (Controlled by hddViewMode: CLOSED vs CUTAWAY vs INTERNAL_ZOOM)
        const topCover = new THREE.Mesh(
          new THREE.BoxGeometry(2.28, 0.06, 3.08),
          new THREE.MeshStandardMaterial({
            color: 0xcbd5e1,
            metalness: 0.85,
            roughness: 0.22,
            transparent: true,
            opacity: 1.0,
          })
        );
        topCover.position.set(0, 0.3, 0);
        hddGroup.add(topCover);
        hddTopCoverMesh = topCover;

        rootGroup.add(hddGroup);
      } else if (item.category === 'cpu') {
        // ====================================================================
        // CPU FETCH-DECODE-EXECUTE & CACHE DATA FLOW 3D DIAGRAM
        // ====================================================================
        const cpuGroup = new THREE.Group();
        const substrate = new THREE.Mesh(
          new THREE.BoxGeometry(2.2, 0.12, 2.2),
          new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.45, metalness: 0.25 })
        );
        cpuGroup.add(substrate);

        // Silicon Compute Die (Cores + L3 Cache)
        const siliconDie = new THREE.Mesh(
          new THREE.BoxGeometry(1.1, 0.1, 0.8),
          new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.85, roughness: 0.15 })
        );
        siliconDie.position.set(0, 0.11, -0.2);
        cpuGroup.add(siliconDie);

        // I/O Controller Die
        const ioDie = new THREE.Mesh(
          new THREE.BoxGeometry(0.9, 0.09, 0.55),
          new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 })
        );
        ioDie.position.set(0, 0.1, 0.55);
        cpuGroup.add(ioDie);

        // Translucent Cutaway IHS (Integrated Heat Spreader)
        const ihsCover = new THREE.Mesh(
          new THREE.BoxGeometry(1.85, 0.18, 1.85),
          new THREE.MeshPhysicalMaterial({
            color: 0xe2e8f0,
            transparent: true,
            opacity: 0.28,
            metalness: 0.4,
            roughness: 0.15,
            depthWrite: false,
          })
        );
        ihsCover.position.set(0, 0.2, 0);
        cpuGroup.add(ihsCover);

        // Instruction / Cache Data Pulses between I/O Die and Compute Cores
        for (let i = 0; i < 6; i++) {
          const pkt = new THREE.Mesh(
            new THREE.SphereGeometry(0.055, 12, 12),
            new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x38bdf8 : 0xf59e0b })
          );
          cpuGroup.add(pkt);
          pulsePackets.push({
            mesh: pkt,
            start: new THREE.Vector3(-0.35 + (i % 3) * 0.35, 0.2, 0.55),
            end: new THREE.Vector3(-0.35 + (i % 3) * 0.35, 0.2, -0.35),
            speed: 1.6,
            phase: i * 0.16,
          });
        }

        rootGroup.add(cpuGroup);
      } else if (item.category === 'ram') {
        // ====================================================================
        // RAM VOLATILE CAPACITOR MATRIX & PHYSICAL KEY NOTCH 3D MODEL
        // ====================================================================
        const ram = item as RamSpec;
        const ramGroup = new THREE.Group();

        const pcbWidth = ram.formFactor === 'SO-DIMM' ? 1.8 : 3.2;
        const pcb = new THREE.Mesh(
          new THREE.BoxGeometry(pcbWidth, 0.95, 0.08),
          new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.45, metalness: 0.2 })
        );
        pcb.position.set(0, 0.25, 0);
        ramGroup.add(pcb);

        // Gold Contact Edge with Generation-Accurate Physical Notch Gap
        const notchX = ram.notchPositionRatio * pcbWidth;
        const leftEdgeW = Math.max(0.2, pcbWidth / 2 + notchX - 0.08);
        const rightEdgeW = Math.max(0.2, pcbWidth / 2 - notchX - 0.08);

        const goldMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          metalness: 0.92,
          roughness: 0.18,
        });
        const leftContacts = new THREE.Mesh(
          new THREE.BoxGeometry(leftEdgeW, 0.14, 0.09),
          goldMat
        );
        leftContacts.position.set(-pcbWidth / 2 + leftEdgeW / 2, -0.28, 0);
        ramGroup.add(leftContacts);

        const rightContacts = new THREE.Mesh(
          new THREE.BoxGeometry(rightEdgeW, 0.14, 0.09),
          goldMat
        );
        rightContacts.position.set(pcbWidth / 2 - rightEdgeW / 2, -0.28, 0);
        ramGroup.add(rightContacts);

        // Highlight ring around physical notch so student sees where the key is
        const notchMarker = new THREE.Mesh(
          new THREE.RingGeometry(0.08, 0.13, 24),
          new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide })
        );
        notchMarker.position.set(notchX, -0.28, 0.06);
        ramGroup.add(notchMarker);

        // 8 DRAM IC Chips with Glowing Volatile Capacitor Cells
        for (let c = 0; c < 8; c++) {
          const cx = -pcbWidth * 0.4 + (c * (pcbWidth * 0.8)) / 7;
          const chip = new THREE.Mesh(
            new THREE.BoxGeometry(0.26, 0.42, 0.06),
            new THREE.MeshStandardMaterial({
              color: 0x18181b,
              emissive: 0x10b981,
              emissiveIntensity: 0.5,
              roughness: 0.3,
            })
          );
          chip.position.set(cx, 0.25, 0.06);
          ramGroup.add(chip);
          ramCellMeshes.push(chip);
        }

        rootGroup.add(ramGroup);
      } else if (item.category === 'storage') {
        // ====================================================================
        // ELECTRONIC SSD (NAND FLASH CHANNELS & CONTROLLER — NO MOVING PARTS)
        // ====================================================================
        const ssdGroup = new THREE.Group();
        const pcb = new THREE.Mesh(
          new THREE.BoxGeometry(2.8, 0.1, 1.1),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.3 })
        );
        ssdGroup.add(pcb);

        // Controller ASIC
        const controller = new THREE.Mesh(
          new THREE.BoxGeometry(0.52, 0.12, 0.52),
          new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.88, roughness: 0.2 })
        );
        controller.position.set(-0.85, 0.1, 0);
        ssdGroup.add(controller);

        // 4 NAND Flash Packages
        const nandPositions: [number, number][] = [
          [0.05, -0.28],
          [0.05, 0.28],
          [0.85, -0.28],
          [0.85, 0.28],
        ];
        nandPositions.forEach(([nx, nz], idx) => {
          const nand = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.1, 0.42),
            new THREE.MeshStandardMaterial({
              color: 0x1e293b,
              emissive: 0x38bdf8,
              emissiveIntensity: 0.25,
            })
          );
          nand.position.set(nx, 0.1, nz);
          ssdGroup.add(nand);

          const pkt = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0xa855f7 })
          );
          ssdGroup.add(pkt);
          pulsePackets.push({
            mesh: pkt,
            start: new THREE.Vector3(-0.85, 0.18, 0),
            end: new THREE.Vector3(nx, 0.18, nz),
            speed: 2.8,
            phase: idx * 0.25,
          });
        });

        rootGroup.add(ssdGroup);
      } else {
        // ====================================================================
        // MOTHERBOARD, GPU, COOLER, PSU & OTHER COMPONENTS 3D SHOWCASE
        // ====================================================================
        const showcaseGroup = new THREE.Group();
        const mainBlock = new THREE.Mesh(
          new THREE.BoxGeometry(2.1, 0.45, 1.8),
          new THREE.MeshStandardMaterial({
            color: item.colorAccent,
            metalness: 0.65,
            roughness: 0.3,
          })
        );
        showcaseGroup.add(mainBlock);

        // Add spinning rotor for Cooler / GPU / PSU
        if (item.category === 'cooler' || item.category === 'gpu' || item.category === 'psu') {
          const rotor = new THREE.Group();
          rotor.position.set(0, 0.28, 0);
          for (let b = 0; b < 7; b++) {
            const blade = new THREE.Mesh(
              new THREE.BoxGeometry(0.55, 0.03, 0.14),
              new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.5, roughness: 0.2 })
            );
            const angle = (b * Math.PI * 2) / 7;
            blade.rotation.y = angle;
            blade.position.set(Math.cos(angle) * 0.32, 0, Math.sin(angle) * 0.32);
            rotor.add(blade);
          }
          showcaseGroup.add(rotor);
          spinningParts.push(rotor);
        }

        rootGroup.add(showcaseGroup);
      }
    };

    rebuildRef.current = buildMechanismModel;
    buildMechanismModel();

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

      controls.update();

      // Update HDD Internal Demonstration
      if (hddPlatterGroup && hddActuatorPivot && hddTopCoverMesh && hddReadWriteGlow) {
        // Cover visibility according to CLOSED / CUTAWAY / INTERNAL_ZOOM
        const coverMat = hddTopCoverMesh.material as THREE.MeshStandardMaterial;
        if (st.hddViewMode === 'CLOSED') {
          hddTopCoverMesh.visible = true;
          coverMat.opacity = 1.0;
        } else if (st.hddViewMode === 'CUTAWAY') {
          hddTopCoverMesh.visible = true;
          coverMat.opacity = 0.22;
        } else {
          hddTopCoverMesh.visible = false;
        }

        if (st.mechanismPlaying) {
          // Rotate magnetic platters at proportional RPM speed
          const rotSpeed = 9.5 * st.hddSpeedMultiplier;
          hddPlatterGroup.rotation.y += dt * rotSpeed;

          // Swing Voice Coil Actuator Arm to target track (0 = outer track, 5 = inner track)
          const targetAngle = -0.18 - st.hddTargetTrack * 0.085 +
            (st.hddOperation === 'SEEK' ? Math.sin(elapsed * 4.5) * 0.18 : 0);
          hddActuatorPivot.rotation.y = THREE.MathUtils.lerp(
            hddActuatorPivot.rotation.y,
            targetAngle,
            1 - Math.exp(-8 * dt)
          );

          // Update Read/Write Head Flux Glow
          const glowMat = hddReadWriteGlow.material as THREE.MeshBasicMaterial;
          if (st.hddOperation === 'READ') {
            glowMat.color.setHex(0x38bdf8); // Cyan Read Flux
            glowMat.opacity = 0.55 + Math.sin(elapsed * 18) * 0.35;
          } else if (st.hddOperation === 'WRITE') {
            glowMat.color.setHex(0xf97316); // Orange Write Flux
            glowMat.opacity = 0.65 + Math.sin(elapsed * 22) * 0.35;
          } else if (st.hddOperation === 'SEEK') {
            glowMat.color.setHex(0xeab308); // Yellow Seek
            glowMat.opacity = 0.5;
          } else {
            glowMat.opacity = 0.15;
          }
        }
      }

      // Update Data Packets along pathways
      if (st.mechanismPlaying) {
        for (const pkt of pulsePackets) {
          const active =
            !hddPlatterGroup || st.hddOperation === 'READ' || st.hddOperation === 'WRITE';
          pkt.mesh.visible = active;
          if (active) {
            const t = (elapsed * pkt.speed * st.hddSpeedMultiplier + pkt.phase) % 1;
            const dir = st.hddOperation === 'WRITE' ? 1 - t : t;
            pkt.mesh.position.lerpVectors(pkt.start, pkt.end, dir);
          }
        }

        for (const rotor of spinningParts) {
          rotor.rotation.y += dt * 8.0 * st.hddSpeedMultiplier;
        }
      }

      // Update RAM Volatility Demonstration
      if (ramCellMeshes.length > 0) {
        ramCellMeshes.forEach((chip, idx) => {
          const mat = chip.material as THREE.MeshStandardMaterial;
          if (st.volatilePowerOn) {
            mat.emissive.setHex(0x10b981);
            mat.emissiveIntensity = 0.35 + Math.sin(elapsed * 6 + idx) * 0.25;
          } else {
            // Power cut -> Volatile DRAM loses all stored charge immediately!
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
          }
        });
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (rebuildRef.current) {
      rebuildRef.current();
    }
  }, [itemId]);

  return (
    <div
      ref={mountRef}
      data-testid="mechanism-3d-canvas"
      className="h-full w-full cursor-grab active:cursor-grabbing"
      aria-label="Visualização 3D interativa do mecanismo interno do componente"
    />
  );
};
