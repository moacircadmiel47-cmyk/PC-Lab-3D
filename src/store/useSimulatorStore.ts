import { create } from 'zustand';
import {
  ComponentCategory,
  CompatibilityValidationResult,
  InstalledHardwareState,
  InteractionState,
  PostBootSimulationResult,
  SnapSlotId,
  CableOrAccessorySpec,
} from '../types/hardware';
import {
  createInitialInstalledState,
  createEmptyWorkbenchState,
  validateInstallation,
  validateRemoval,
  simulatePostBoot,
} from '../engine/compatibility';
import { getHardwareById } from '../data/catalog';
import { DIAGNOSTIC_SCENARIOS } from '../data/educationalContent';

export type SimulatorMode =
  | 'FREE_BUILD'
  | 'GUIDED_BUILD'
  | 'DIAGNOSTIC'
  | 'MECHANISM_LAB'
  | 'STUDY_GUIDE'
  | 'TEACHER_AREA';

export type HddViewMode = 'CLOSED' | 'CUTAWAY' | 'INTERNAL_ZOOM';
export type HddOperationMode = 'IDLE' | 'SEEK' | 'READ' | 'WRITE';

export type CameraPreset = 'ORBIT_MAIN' | 'SOCKET_CPU' | 'SLOTS_RAM' | 'STORAGE_HDD' | 'PCIE_GPU' | 'MOTHERBOARD_TOP';

export interface SavedBuildConfig {
  id: string;
  name: string;
  timestamp: string;
  state: InstalledHardwareState;
}

interface SimulatorStore {
  mode: SimulatorMode;
  setMode: (mode: SimulatorMode) => void;

  // Workbench installed hardware state + undo/redo
  installed: InstalledHardwareState;
  history: InstalledHardwareState[];
  future: InstalledHardwareState[];
  undo: () => void;
  redo: () => void;
  resetWorkbench: (empty?: boolean) => void;
  loadPresetStarterKit: () => void;

  // Selection, Dragging & Snap states
  activeCategory: ComponentCategory;
  setActiveCategory: (cat: ComponentCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  selectedInspectItemId: string;
  setSelectedInspectItemId: (id: string) => void;
  inspectorTab: 'OVERVIEW' | 'SPECS' | 'HOW_IT_WORKS' | 'INSTALLATION' | 'COMPATIBILITY' | 'QUIZ';
  setInspectorTab: (tab: SimulatorStore['inspectorTab']) => void;

  heldItemId: string | null;
  heldRotationStep: number;
  hoveredSnapSlot: SnapSlotId | null;
  interactionState: InteractionState;

  pickUpItem: (itemId: string) => void;
  rotateHeldItem: () => void;
  cancelHeldItem: () => void;
  setHoveredSnapSlot: (slot: SnapSlotId | null) => void;

  // Core actions: Install & Remove
  attemptInstallItem: (itemId: string, targetSlot: SnapSlotId) => CompatibilityValidationResult;
  attemptRemoveFromSlot: (targetSlot: SnapSlotId) => CompatibilityValidationResult;
  updateMotherboardBios: () => void;

  // Compatibility feedback & error log
  lastValidationResult: CompatibilityValidationResult | null;
  clearValidationBanner: () => void;
  compatibilityErrorLog: { timestamp: string; itemId: string; slot: SnapSlotId; result: CompatibilityValidationResult }[];

  // Camera & Case controls
  cameraPreset: CameraPreset;
  setCameraPreset: (preset: CameraPreset) => void;
  caseSidePanelOpen: boolean;
  toggleCaseSidePanel: () => void;
  lowPerformanceMode: boolean;
  toggleLowPerformanceMode: () => void;

  // HDD & Didactic Mechanism Lab state
  hddViewMode: HddViewMode;
  setHddViewMode: (view: HddViewMode) => void;
  hddOperation: HddOperationMode;
  setHddOperation: (op: HddOperationMode) => void;
  hddSpeedMultiplier: number;
  setHddSpeedMultiplier: (speed: number) => void;
  hddTargetTrack: number;
  hddTargetSector: number;
  triggerHddSeek: (track: number, sector: number, op: HddOperationMode) => void;

  mechanismPlaying: boolean;
  setMechanismPlaying: (playing: boolean) => void;
  selectedMotherboardRegionId: string;
  setSelectedMotherboardRegionId: (id: string) => void;

  // Virtual Power / POST Simulation
  isPoweredOn: boolean;
  showPostModal: boolean;
  lastPostResult: PostBootSimulationResult | null;
  powerOnComputer: () => PostBootSimulationResult;
  powerOffComputer: () => void;
  setShowPostModal: (show: boolean) => void;

  // Guided Assembly Mode
  currentGuidedStepIndex: number;
  setCurrentGuidedStepIndex: (idx: number) => void;
  safetyAcknowledged: boolean;
  acknowledgeSafety: () => void;
  showHints: boolean;
  toggleShowHints: () => void;
  pedagogicalScore: number;
  completedGuidedStepIds: string[];

  // Diagnostic / Troubleshooting Mode
  activeScenarioId: string;
  loadDiagnosticScenario: (scenarioId: string) => void;
  revealedCluesCount: number;
  revealNextClue: () => void;
  scenarioVerificationMessage: { resolved: boolean; feedback: string } | null;
  verifyCurrentScenario: () => void;

  // Saved builds (LocalStorage persistence)
  savedBuilds: SavedBuildConfig[];
  saveCurrentBuild: (name: string) => void;
  loadSavedBuild: (id: string) => void;
  deleteSavedBuild: (id: string) => void;

  // Teacher / Classroom Presentation Mode
  presentationMode: boolean;
  togglePresentationMode: () => void;
  difficultyLevel: 'Iniciante' | 'Intermediário' | 'Avançado';
  setDifficultyLevel: (level: 'Iniciante' | 'Intermediário' | 'Avançado') => void;
  customChallengeObjective: string;
  setCustomChallengeObjective: (obj: string) => void;
}

const STORAGE_KEY = 'pclab3d_saved_builds_v1';

function loadSavedBuildsFromStorage(): SavedBuildConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedBuildConfig[];
  } catch {
    return [];
  }
}

function applyInstallationToState(
  prev: InstalledHardwareState,
  itemId: string,
  targetSlot: SnapSlotId
): InstalledHardwareState {
  const next: InstalledHardwareState = {
    ...prev,
    ramSlots: { ...prev.ramSlots },
    m2Slots: { ...prev.m2Slots },
    driveBays: { ...prev.driveBays },
    cables: { ...prev.cables },
  };

  const item = getHardwareById(itemId);
  if (!item) return next;

  switch (targetSlot) {
    case 'slot_case':
      next.caseId = itemId;
      break;
    case 'slot_standoffs':
      next.standoffsInstalled = true;
      break;
    case 'slot_motherboard':
      next.motherboardId = itemId;
      next.motherboardBiosUpdated = false;
      break;
    case 'slot_cpu':
      next.cpuId = itemId;
      next.cpuOrientationCorrect = true;
      break;
    case 'slot_thermal_paste':
      next.thermalPasteApplied = true;
      break;
    case 'slot_cooler':
      next.coolerId = itemId;
      break;
    case 'slot_ram_1':
    case 'slot_ram_2':
    case 'slot_ram_3':
    case 'slot_ram_4':
      next.ramSlots[targetSlot] = itemId;
      break;
    case 'slot_m2_1':
    case 'slot_m2_2':
      next.m2Slots[targetSlot] = itemId;
      break;
    case 'slot_gpu_pcie16':
      next.gpuId = itemId;
      break;
    case 'slot_pcie_x1':
      next.pcieAddonId = itemId;
      break;
    case 'slot_drive_bay_1':
    case 'slot_drive_bay_2':
      next.driveBays[targetSlot] = itemId;
      break;
    case 'slot_psu':
      next.psuId = itemId;
      break;
    case 'slot_cmos_battery':
      next.cmosBatteryInstalled = true;
      break;
    case 'slot_beep_speaker':
      next.beepSpeakerInstalled = true;
      break;
    case 'slot_cable_24pin':
      next.cables.atx24Pin = true;
      break;
    case 'slot_cable_cpu_eps':
      next.cables.cpuEps = true;
      break;
    case 'slot_cable_pcie_power':
      next.cables.pciePower = true;
      break;
    case 'slot_cable_sata':
      next.cables.sataData = true;
      break;
    case 'slot_cable_front_panel':
      next.cables.frontPanel = true;
      break;
  }

  return next;
}

function applyRemovalToState(
  prev: InstalledHardwareState,
  targetSlot: SnapSlotId
): InstalledHardwareState {
  const next: InstalledHardwareState = {
    ...prev,
    ramSlots: { ...prev.ramSlots },
    m2Slots: { ...prev.m2Slots },
    driveBays: { ...prev.driveBays },
    cables: { ...prev.cables },
  };

  switch (targetSlot) {
    case 'slot_case':
      next.caseId = null;
      next.standoffsInstalled = false;
      break;
    case 'slot_standoffs':
      next.standoffsInstalled = false;
      break;
    case 'slot_motherboard':
      next.motherboardId = null;
      next.motherboardBiosUpdated = false;
      break;
    case 'slot_cpu':
      next.cpuId = null;
      next.thermalPasteApplied = false;
      break;
    case 'slot_thermal_paste':
      next.thermalPasteApplied = false;
      break;
    case 'slot_cooler':
      next.coolerId = null;
      break;
    case 'slot_ram_1':
    case 'slot_ram_2':
    case 'slot_ram_3':
    case 'slot_ram_4':
      next.ramSlots[targetSlot] = null;
      break;
    case 'slot_m2_1':
    case 'slot_m2_2':
      next.m2Slots[targetSlot] = null;
      break;
    case 'slot_gpu_pcie16':
      next.gpuId = null;
      next.cables.pciePower = false;
      break;
    case 'slot_pcie_x1':
      next.pcieAddonId = null;
      break;
    case 'slot_drive_bay_1':
    case 'slot_drive_bay_2':
      next.driveBays[targetSlot] = null;
      if (!next.driveBays.slot_drive_bay_1 && !next.driveBays.slot_drive_bay_2) {
        next.cables.sataData = false;
      }
      break;
    case 'slot_psu':
      next.psuId = null;
      break;
    case 'slot_cmos_battery':
      next.cmosBatteryInstalled = false;
      break;
    case 'slot_beep_speaker':
      next.beepSpeakerInstalled = false;
      break;
    case 'slot_cable_24pin':
      next.cables.atx24Pin = false;
      break;
    case 'slot_cable_cpu_eps':
      next.cables.cpuEps = false;
      break;
    case 'slot_cable_pcie_power':
      next.cables.pciePower = false;
      break;
    case 'slot_cable_sata':
      next.cables.sataData = false;
      break;
    case 'slot_cable_front_panel':
      next.cables.frontPanel = false;
      break;
  }

  return next;
}

export function getSuggestedTargetSlotForItem(
  itemId: string,
  state: InstalledHardwareState
): SnapSlotId {
  const item = getHardwareById(itemId);
  if (!item) return 'slot_motherboard';

  switch (item.category) {
    case 'case':
      return 'slot_case';
    case 'motherboard':
      return 'slot_motherboard';
    case 'cpu':
      return 'slot_cpu';
    case 'cooler':
      return 'slot_cooler';
    case 'ram':
      if (!state.ramSlots.slot_ram_1) return 'slot_ram_1';
      if (!state.ramSlots.slot_ram_2) return 'slot_ram_2';
      if (!state.ramSlots.slot_ram_3) return 'slot_ram_3';
      return 'slot_ram_4';
    case 'storage':
      if (item.formFactor === 'M2_2280') {
        return !state.m2Slots.slot_m2_1 ? 'slot_m2_1' : 'slot_m2_2';
      }
      return !state.driveBays.slot_drive_bay_1 ? 'slot_drive_bay_1' : 'slot_drive_bay_2';
    case 'gpu':
      return item.interface === 'PCIe_x1' ? 'slot_pcie_x1' : 'slot_gpu_pcie16';
    case 'psu':
      return 'slot_psu';
    case 'cable': {
      const acc = item as CableOrAccessorySpec;
      switch (acc.accessoryType) {
        case 'CASE_STANDOFFS':
          return 'slot_standoffs';
        case 'THERMAL_PASTE':
          return 'slot_thermal_paste';
        case 'CMOS_BATTERY':
          return 'slot_cmos_battery';
        case 'BEEP_SPEAKER':
          return 'slot_beep_speaker';
        case 'CABLE_ATX_24PIN':
          return 'slot_cable_24pin';
        case 'CABLE_CPU_EPS':
          return 'slot_cable_cpu_eps';
        case 'CABLE_PCIE_POWER':
          return 'slot_cable_pcie_power';
        case 'CABLE_SATA_DATA':
          return 'slot_cable_sata';
        case 'CABLE_FRONT_PANEL':
          return 'slot_cable_front_panel';
      }
    }
  }
}

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
  mode: 'FREE_BUILD',
  setMode: (mode) => set({ mode }),

  installed: createInitialInstalledState(),
  history: [],
  future: [],

  undo: () => {
    const { history, installed, future } = get();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    set({
      installed: previous,
      history: history.slice(0, -1),
      future: [installed, ...future],
      isPoweredOn: false,
    });
  },

  redo: () => {
    const { history, installed, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      installed: next,
      history: [...history, installed],
      future: future.slice(1),
      isPoweredOn: false,
    });
  },

  resetWorkbench: (empty = false) => {
    const { installed, history } = get();
    set({
      installed: empty ? createEmptyWorkbenchState() : createInitialInstalledState(),
      history: [...history.slice(-19), installed],
      future: [],
      heldItemId: null,
      heldRotationStep: 0,
      interactionState: 'AVAILABLE',
      isPoweredOn: false,
      lastPostResult: null,
      showPostModal: false,
      lastValidationResult: {
        status: 'COMPATIBLE',
        allowed: true,
        code: 'WORKBENCH_RESET',
        title: empty ? 'Bancada Limpa (Do Zero)' : 'Bancada Reiniciada (Base AM4 Pronta)',
        message: empty
          ? 'Todos os componentes foram removidos. Comece escolhendo o gabinete, espaçadores e placa-mãe.'
          : 'Gabinete Corsair 4000D, Placa-Mãe ASUS B550M-Plus (AM4 DDR4) e Fonte 750W posicionados. Arraste ou instale a CPU, RAM, Armazenamento e GPU!',
        educationalDetails: 'Você pode alternar entre a bancada pré-preparada (para testar encaixe imediato de CPU e RAM) ou começar do zero absoluto.',
      },
    });
  },

  loadPresetStarterKit: () => {
    const { installed, history } = get();
    const fullState = createInitialInstalledState();
    fullState.cpuId = 'cpu-amd-ryzen-5-5600x';
    fullState.thermalPasteApplied = true;
    fullState.coolerId = 'cooler-deepcool-ak400-tower';
    fullState.ramSlots.slot_ram_2 = 'ram-ddr4-16gb-3200';
    fullState.ramSlots.slot_ram_4 = 'ram-ddr4-16gb-3200';
    fullState.m2Slots.slot_m2_1 = 'storage-ssd-samsung-980-pro-1tb-nvme4';
    fullState.driveBays.slot_drive_bay_1 = 'storage-hdd-seagate-2tb-35';
    fullState.cables.sataData = true;
    fullState.gpuId = 'gpu-gtx-1650-4gb';

    set({
      installed: fullState,
      history: [...history.slice(-19), installed],
      future: [],
      heldItemId: null,
      isPoweredOn: false,
      lastValidationResult: {
        status: 'COMPATIBLE',
        allowed: true,
        code: 'PRESET_LOADED',
        title: 'Configuração Completa de Demonstração Montada',
        message: 'PC completo com Ryzen 5 5600X, 32GB DDR4 Dual-Channel, SSD NVMe + HDD 2TB e GTX 1650 montado na bancada.',
        educationalDetails: 'Clique em "Ligar PC (POST)" para ver a inicialização ou selecione o HDD para explorar seu mecanismo interno!',
      },
    });
  },

  activeCategory: 'cpu',
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  selectedInspectItemId: 'storage-hdd-seagate-2tb-35',
  setSelectedInspectItemId: (selectedInspectItemId) => set({ selectedInspectItemId }),
  inspectorTab: 'OVERVIEW',
  setInspectorTab: (inspectorTab) => set({ inspectorTab }),

  heldItemId: null,
  heldRotationStep: 0,
  hoveredSnapSlot: null,
  interactionState: 'AVAILABLE',

  pickUpItem: (itemId) => {
    set({
      heldItemId: itemId,
      selectedInspectItemId: itemId,
      heldRotationStep: 0,
      interactionState: 'DRAGGING',
    });
  },

  rotateHeldItem: () => {
    set((s) => ({ heldRotationStep: (s.heldRotationStep + 1) % 4 }));
  },

  cancelHeldItem: () => {
    set({
      heldItemId: null,
      heldRotationStep: 0,
      hoveredSnapSlot: null,
      interactionState: 'AVAILABLE',
    });
  },

  setHoveredSnapSlot: (slot) => {
    const { heldItemId, installed, heldRotationStep } = get();
    if (!slot || !heldItemId) {
      set({ hoveredSnapSlot: slot, interactionState: heldItemId ? 'DRAGGING' : 'AVAILABLE' });
      return;
    }
    const res = validateInstallation(installed, heldItemId, slot, heldRotationStep);
    const nextState: InteractionState =
      res.status === 'DEPENDENCY_MISSING'
        ? 'BLOCKED_BY_DEPENDENCY'
        : res.allowed
        ? 'SNAP_VALID'
        : 'SNAP_INVALID';
    set({ hoveredSnapSlot: slot, interactionState: nextState });
  },

  attemptInstallItem: (itemId, targetSlot) => {
    const { installed, heldRotationStep, history, compatibilityErrorLog, pedagogicalScore } = get();
    const res = validateInstallation(installed, itemId, targetSlot, heldRotationStep);

    if (res.allowed) {
      const nextInstalled = applyInstallationToState(installed, itemId, targetSlot);
      set({
        installed: nextInstalled,
        history: [...history.slice(-19), installed],
        future: [],
        heldItemId: null,
        heldRotationStep: 0,
        hoveredSnapSlot: null,
        interactionState: 'INSTALLED',
        lastValidationResult: res,
        selectedInspectItemId: itemId,
        isPoweredOn: false,
        pedagogicalScore: pedagogicalScore + (res.status === 'COMPATIBLE' ? 15 : 5),
      });
    } else {
      const now = new Date().toLocaleTimeString('pt-BR');
      set({
        interactionState: res.status === 'DEPENDENCY_MISSING' ? 'BLOCKED_BY_DEPENDENCY' : 'SNAP_INVALID',
        lastValidationResult: res,
        compatibilityErrorLog: [
          { timestamp: now, itemId, slot: targetSlot, result: res },
          ...compatibilityErrorLog,
        ],
        pedagogicalScore: Math.max(0, pedagogicalScore - 5),
      });
    }

    return res;
  },

  attemptRemoveFromSlot: (targetSlot) => {
    const { installed, history } = get();
    const res = validateRemoval(installed, targetSlot);
    if (res.allowed) {
      const nextInstalled = applyRemovalToState(installed, targetSlot);
      set({
        installed: nextInstalled,
        history: [...history.slice(-19), installed],
        future: [],
        interactionState: 'REMOVED',
        lastValidationResult: res,
        isPoweredOn: false,
      });
    } else {
      set({
        interactionState: 'BLOCKED_BY_DEPENDENCY',
        lastValidationResult: res,
      });
    }
    return res;
  },

  updateMotherboardBios: () => {
    const { installed } = get();
    if (!installed.motherboardId) return;
    const mb = getHardwareById(installed.motherboardId);
    set({
      installed: { ...installed, motherboardBiosUpdated: true },
      lastValidationResult: {
        status: 'COMPATIBLE',
        allowed: true,
        code: 'BIOS_UPDATED_OK',
        title: 'Firmware BIOS/UEFI Atualizado via USB BIOS Flashback',
        message: `A memória Flash da placa-mãe ${mb?.name ?? ''} foi atualizada para a revisão mais recente com suporte a novos microcódigos de CPU!`,
        educationalDetails: 'O recurso USB BIOS Flashback permite gravar a nova versão da BIOS usando apenas a fonte de alimentação e um pendrive formatado em FAT32.',
      },
    });
  },

  lastValidationResult: {
    status: 'COMPATIBLE',
    allowed: true,
    code: 'WELCOME_READY',
    title: 'Bancada 3D Pronta — Placa-Mãe ASUS B550M-Plus (AM4 DDR4) Posicionada',
    message: 'Arraste uma CPU para o socket ou clique em "Encaixar no Slot" no catálogo para testar encaixes reais e regras de compatibilidade!',
    educationalDetails: 'Dica rápida: Experimente tentar instalar um processador Intel LGA 1700 ou uma memória DDR3/DDR5 na placa AM4 para ver o diagnóstico técnico de incompatibilidade.',
  },
  clearValidationBanner: () => set({ lastValidationResult: null }),
  compatibilityErrorLog: [],

  cameraPreset: 'ORBIT_MAIN',
  setCameraPreset: (cameraPreset) => set({ cameraPreset }),
  caseSidePanelOpen: true,
  toggleCaseSidePanel: () => set((s) => ({ caseSidePanelOpen: !s.caseSidePanelOpen })),
  lowPerformanceMode: false,
  toggleLowPerformanceMode: () => set((s) => ({ lowPerformanceMode: !s.lowPerformanceMode })),

  // HDD & Didactic Mechanism Lab
  hddViewMode: 'INTERNAL_ZOOM',
  setHddViewMode: (hddViewMode) => set({ hddViewMode }),
  hddOperation: 'READ',
  setHddOperation: (hddOperation) => set({ hddOperation }),
  hddSpeedMultiplier: 1,
  setHddSpeedMultiplier: (hddSpeedMultiplier) => set({ hddSpeedMultiplier }),
  hddTargetTrack: 3,
  hddTargetSector: 5,
  triggerHddSeek: (hddTargetTrack, hddTargetSector, hddOperation) =>
    set({ hddTargetTrack, hddTargetSector, hddOperation }),

  mechanismPlaying: true,
  setMechanismPlaying: (mechanismPlaying) => set({ mechanismPlaying }),
  selectedMotherboardRegionId: 'region-socket',
  setSelectedMotherboardRegionId: (selectedMotherboardRegionId) => set({ selectedMotherboardRegionId }),

  // Virtual Power / POST
  isPoweredOn: false,
  showPostModal: false,
  lastPostResult: null,
  powerOnComputer: () => {
    const { installed, pedagogicalScore } = get();
    const result = simulatePostBoot(installed);
    set({
      isPoweredOn: result.canPowerOn,
      lastPostResult: result,
      showPostModal: true,
      pedagogicalScore: result.bootToOsSuccess ? pedagogicalScore + 30 : pedagogicalScore,
    });
    return result;
  },
  powerOffComputer: () => set({ isPoweredOn: false, showPostModal: false }),
  setShowPostModal: (showPostModal) => set({ showPostModal }),

  // Guided Assembly Mode
  currentGuidedStepIndex: 0,
  setCurrentGuidedStepIndex: (currentGuidedStepIndex) => set({ currentGuidedStepIndex }),
  safetyAcknowledged: false,
  acknowledgeSafety: () =>
    set((s) => ({
      safetyAcknowledged: true,
      pedagogicalScore: s.safetyAcknowledged ? s.pedagogicalScore : s.pedagogicalScore + 10,
    })),
  showHints: true,
  toggleShowHints: () => set((s) => ({ showHints: !s.showHints })),
  pedagogicalScore: 100,
  completedGuidedStepIds: [],

  // Diagnostic Mode
  activeScenarioId: DIAGNOSTIC_SCENARIOS[0].id,
  loadDiagnosticScenario: (scenarioId) => {
    const scenario = DIAGNOSTIC_SCENARIOS.find((s) => s.id === scenarioId) ?? DIAGNOSTIC_SCENARIOS[0];
    set({
      mode: 'DIAGNOSTIC',
      activeScenarioId: scenario.id,
      installed: JSON.parse(JSON.stringify(scenario.initialState)) as InstalledHardwareState,
      revealedCluesCount: 1,
      scenarioVerificationMessage: null,
      isPoweredOn: false,
      lastPostResult: null,
      showPostModal: false,
      lastValidationResult: {
        status: 'COMPATIBLE_WITH_WARNINGS',
        allowed: true,
        code: 'DIAG_SCENARIO_LOADED',
        title: `Cenário Carregado: ${scenario.title}`,
        message: scenario.symptomDescription,
        educationalDetails: 'Inspecione a bancada, acione o botão "Ligar PC (POST)" para ver o código de erro e corrija o defeito.',
      },
    });
  },
  revealedCluesCount: 1,
  revealNextClue: () => set((s) => ({ revealedCluesCount: Math.min(3, s.revealedCluesCount + 1) })),
  scenarioVerificationMessage: null,
  verifyCurrentScenario: () => {
    const { activeScenarioId, installed, pedagogicalScore } = get();
    const scenario = DIAGNOSTIC_SCENARIOS.find((s) => s.id === activeScenarioId);
    if (!scenario) return;
    const postRes = simulatePostBoot(installed);
    const check = scenario.verifyResolved(installed, postRes);
    set({
      lastPostResult: postRes,
      isPoweredOn: postRes.canPowerOn,
      scenarioVerificationMessage: check,
      pedagogicalScore: check.resolved ? pedagogicalScore + 40 : pedagogicalScore,
    });
  },

  // Saved builds
  savedBuilds: loadSavedBuildsFromStorage(),
  saveCurrentBuild: (name) => {
    const { installed, savedBuilds } = get();
    const newEntry: SavedBuildConfig = {
      id: `build-${Date.now()}`,
      name: name.trim() || `Montagem ${savedBuilds.length + 1}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      state: JSON.parse(JSON.stringify(installed)) as InstalledHardwareState,
    };
    const updated = [newEntry, ...savedBuilds];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage quota errors
    }
    set({ savedBuilds: updated });
  },
  loadSavedBuild: (id) => {
    const { savedBuilds, installed, history } = get();
    const found = savedBuilds.find((b) => b.id === id);
    if (!found) return;
    set({
      installed: JSON.parse(JSON.stringify(found.state)) as InstalledHardwareState,
      history: [...history.slice(-19), installed],
      future: [],
      isPoweredOn: false,
    });
  },
  deleteSavedBuild: (id) => {
    const { savedBuilds } = get();
    const updated = savedBuilds.filter((b) => b.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    set({ savedBuilds: updated });
  },

  // Teacher / Classroom Mode
  presentationMode: false,
  togglePresentationMode: () => set((s) => ({ presentationMode: !s.presentationMode })),
  difficultyLevel: 'Iniciante',
  setDifficultyLevel: (difficultyLevel) =>
    set({
      difficultyLevel,
      showHints: difficultyLevel !== 'Avançado',
    }),
  customChallengeObjective: 'Monte um computador compatível com processador AM4 ou LGA 1700, 16 GB de RAM e um HDD de 2 TB funcional.',
  setCustomChallengeObjective: (customChallengeObjective) => set({ customChallengeObjective }),
}));
