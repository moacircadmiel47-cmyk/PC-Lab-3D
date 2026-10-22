export type ComponentCategory =
  | 'motherboard'
  | 'cpu'
  | 'ram'
  | 'storage'
  | 'gpu'
  | 'cooler'
  | 'psu'
  | 'case'
  | 'cable';

export type CpuSocket =
  | 'LGA775'
  | 'LGA1151'
  | 'LGA1200'
  | 'LGA1700'
  | 'LGA1851'
  | 'AM3+'
  | 'AM4'
  | 'AM5';

export type RamGeneration = 'DDR' | 'DDR2' | 'DDR3' | 'DDR4' | 'DDR5';
export type RamFormFactor = 'DIMM' | 'SO-DIMM';

export type MotherboardFormFactor = 'ATX' | 'Micro-ATX' | 'Mini-ITX';

export type StorageInterface = 'SATA_3' | 'M2_SATA' | 'M2_NVME_PCIE3' | 'M2_NVME_PCIE4' | 'M2_NVME_PCIE5';
export type StorageFormFactor = '3.5_INCH' | '2.5_INCH' | 'M2_2280';
export type M2KeyType = 'B+M' | 'M' | 'NONE';

export type CompatibilityStatus =
  | 'COMPATIBLE'
  | 'INCOMPATIBLE'
  | 'COMPATIBLE_WITH_WARNINGS'
  | 'BIOS_UPDATE_REQUIRED'
  | 'INSUFFICIENT_DATA'
  | 'DEPENDENCY_MISSING';

export interface CompatibilityValidationResult {
  status: CompatibilityStatus;
  allowed: boolean;
  code: string;
  title: string;
  message: string;
  educationalDetails: string;
  remediation?: string;
}

export interface M2SlotSpec {
  id: string;
  label: string;
  key: 'M' | 'B+M';
  supportedProtocols: ('SATA' | 'NVMe_PCIe3' | 'NVMe_PCIe4' | 'NVMe_PCIe5')[];
  sharesBandwidthWithSataPort?: number;
}

export interface BaseHardwareItem {
  id: string;
  name: string;
  category: ComponentCategory;
  manufacturer: string;
  model: string;
  isDidacticGeneric?: boolean;
  summary: string;
  functionInPc: string;
  handlingPrecautions: string[];
  curiosities: string[];
  colorAccent: string;
  incompleteSpecsWarning?: string; // If present, signals missing technical verification data
}

export interface MotherboardSpec extends BaseHardwareItem {
  category: 'motherboard';
  socket: CpuSocket;
  platform: 'Intel' | 'AMD';
  chipset: string;
  formFactor: MotherboardFormFactor;
  supportedCpuGenerations: string[];
  shippedBiosVersion: string;
  latestBiosVersion: string;
  ramGeneration: RamGeneration;
  ramFormFactor: RamFormFactor;
  ramSlots: number;
  maxRamCapacityGb: number | null; // null = insufficient data
  maxRamSpeedMhz: number;
  pcieX16Slots: number;
  pcieGeneration: 3 | 4 | 5;
  pcieX1Slots: number;
  sataPorts: number;
  m2Slots: M2SlotSpec[];
  cpuPowerConnector: '4-pin' | '8-pin' | '8+4-pin';
  mainPowerConnector: '24-pin';
  pcbColor: string;
  heatsinkColor: string;
}

export interface CpuSpec extends BaseHardwareItem {
  category: 'cpu';
  manufacturer: 'Intel' | 'AMD';
  socket: CpuSocket;
  generation: string;
  architecture: string;
  cores: number;
  threads: number;
  baseClockGhz: number;
  boostClockGhz: number;
  cacheMb: number;
  tdpWatts: number | null; // null = insufficient data
  supportedRamTypes: RamGeneration[];
  hasIntegratedGraphics: boolean;
  integratedGraphicsName?: string;
  compatibleChipsets: string[];
  minBiosVersionByChipset?: Record<string, string>;
}

export interface RamSpec extends BaseHardwareItem {
  category: 'ram';
  generation: RamGeneration;
  capacityGb: number;
  speedMTs: number;
  formFactor: RamFormFactor;
  voltageV: number;
  casLatency: string;
  pins: number;
  notchPositionRatio: number; // Visual & physical notch position along connector (-0.35 to +0.35)
  hasHeatspreader: boolean;
  heatspreaderColor: string;
  isSimulatedDefective?: boolean;
}

export interface StorageSpec extends BaseHardwareItem {
  category: 'storage';
  storageType: 'HDD' | 'SSD_SATA' | 'SSD_M2_SATA' | 'SSD_M2_NVME';
  capacityGb: number;
  formFactor: StorageFormFactor;
  interface: StorageInterface;
  protocol: 'AHCI/SATA' | 'NVMe/PCIe';
  m2Key: M2KeyType;
  rpm?: number;
  readSpeedMBs: number;
  writeSpeedMBs: number;
  requiresSataPowerAndDataCable: boolean;
  powerConsumptionWatts: number | null; // null = insufficient data
}

export interface GpuSpec extends BaseHardwareItem {
  category: 'gpu';
  chipsetManufacturer: 'NVIDIA' | 'AMD' | 'Intel' | 'PCIe_Addon';
  vramGb: number;
  vramType: string;
  interface: 'PCIe_x16' | 'PCIe_x1';
  pcieGeneration: 3 | 4;
  lengthMm: number;
  tdpWatts: number;
  requiredPowerConnector: 'NONE' | '1x8-pin' | '2x8-pin' | '12V-2x6';
  recommendedPsuWatts: number;
  fanCount: 1 | 2 | 3;
}

export interface CoolerSpec extends BaseHardwareItem {
  category: 'cooler';
  coolerType: 'AIR_STOCK' | 'AIR_TOWER' | 'AIO_LIQUID_240' | 'AIR_LOW_PROFILE';
  supportedSockets: CpuSocket[];
  maxTdpWatts: number;
  heightMm: number;
  radiatorSizeMm?: number;
}

export interface PsuSpec extends BaseHardwareItem {
  category: 'psu';
  wattage: number | null; // null = unlabeled/unknown wattage PSU
  efficiencyRating: string;
  formFactor: 'ATX' | 'SFX';
  lengthMm: number;
  has24PinAtx: boolean;
  cpu8PinCount: number;
  pcie8PinCount: number;
  has12V2x6Connector: boolean;
  sataPowerCount: number;
  modular: boolean;
}

export interface CaseSpec extends BaseHardwareItem {
  category: 'case';
  supportedFormFactors: MotherboardFormFactor[];
  maxGpuLengthMm: number | null; // null = insufficient data
  maxCoolerHeightMm: number | null;
  maxPsuLengthMm: number;
  supports240mmRadiator: boolean;
  driveBays35: number;
  driveBays25: number;
  chassisColor: string;
}

export interface CableOrAccessorySpec extends BaseHardwareItem {
  category: 'cable';
  accessoryType:
    | 'THERMAL_PASTE'
    | 'CMOS_BATTERY'
    | 'CABLE_ATX_24PIN'
    | 'CABLE_CPU_EPS'
    | 'CABLE_PCIE_POWER'
    | 'CABLE_SATA_DATA'
    | 'CABLE_FRONT_PANEL'
    | 'CASE_STANDOFFS'
    | 'BEEP_SPEAKER';
}

export type HardwareItem =
  | MotherboardSpec
  | CpuSpec
  | RamSpec
  | StorageSpec
  | GpuSpec
  | CoolerSpec
  | PsuSpec
  | PlayableCaseSpec
  | CableOrAccessorySpec;

export type PlayableCaseSpec = CaseSpec;

export type SnapSlotId =
  | 'slot_case'
  | 'slot_standoffs'
  | 'slot_motherboard'
  | 'slot_cpu'
  | 'slot_thermal_paste'
  | 'slot_cooler'
  | 'slot_ram_1'
  | 'slot_ram_2'
  | 'slot_ram_3'
  | 'slot_ram_4'
  | 'slot_m2_1'
  | 'slot_m2_2'
  | 'slot_gpu_pcie16'
  | 'slot_pcie_x1'
  | 'slot_drive_bay_1'
  | 'slot_drive_bay_2'
  | 'slot_psu'
  | 'slot_cmos_battery'
  | 'slot_beep_speaker'
  | 'slot_cable_24pin'
  | 'slot_cable_cpu_eps'
  | 'slot_cable_pcie_power'
  | 'slot_cable_sata'
  | 'slot_cable_front_panel';

export type InteractionState =
  | 'AVAILABLE'
  | 'SELECTED'
  | 'DRAGGING'
  | 'NEAR_SNAP'
  | 'SNAP_VALID'
  | 'SNAP_INVALID'
  | 'INSTALLED'
  | 'REMOVED'
  | 'BLOCKED_BY_DEPENDENCY';

export interface SnapPointDefinition {
  id: SnapSlotId;
  label: string;
  acceptedCategory: ComponentCategory;
  acceptedAccessoryType?: CableOrAccessorySpec['accessoryType'];
  position: [number, number, number];
  rotation: [number, number, number];
  description: string;
}

export interface InstalledHardwareState {
  caseId: string | null;
  standoffsInstalled: boolean;
  motherboardId: string | null;
  motherboardBiosUpdated: boolean;
  cpuId: string | null;
  cpuOrientationCorrect: boolean;
  thermalPasteApplied: boolean;
  coolerId: string | null;
  ramSlots: Record<'slot_ram_1' | 'slot_ram_2' | 'slot_ram_3' | 'slot_ram_4', string | null>;
  m2Slots: Record<'slot_m2_1' | 'slot_m2_2', string | null>;
  gpuId: string | null;
  pcieAddonId: string | null;
  driveBays: Record<'slot_drive_bay_1' | 'slot_drive_bay_2', string | null>;
  psuId: string | null;
  cmosBatteryInstalled: boolean;
  beepSpeakerInstalled: boolean;
  cables: {
    atx24Pin: boolean;
    cpuEps: boolean;
    pciePower: boolean;
    sataData: boolean;
    frontPanel: boolean;
  };
}

export interface PostStageResult {
  stageOrder: number;
  stageCode: string;
  stageName: string;
  status: 'PASS' | 'WARN' | 'FAIL' | 'SKIPPED';
  detail: string;
}

export interface PostBootSimulationResult {
  canPowerOn: boolean;
  postSuccess: boolean;
  bootToOsSuccess: boolean;
  beepCode: string;
  postHexCode: string;
  summaryTitle: string;
  summaryMessage: string;
  stages: PostStageResult[];
  detectedErrors: CompatibilityValidationResult[];
}

export interface DiagnosticScenario {
  id: string;
  title: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  symptomDescription: string;
  initialState: InstalledHardwareState;
  simulatedFaultType?: 'DEFECTIVE_RAM' | 'OUTDATED_BIOS' | 'MISSING_CPU_POWER' | 'MISSING_THERMAL_PASTE' | 'NO_VIDEO_OUTPUT' | 'UNCONNECTED_STORAGE' | 'MISSING_GPU_POWER' | 'INSUFFICIENT_PSU';
  clues: string[];
  diagnosticProcedure: string[];
  expectedSolutionDescription: string;
  causeExplanation: string;
  verifyResolved: (state: InstalledHardwareState, postResult: PostBootSimulationResult) => {
    resolved: boolean;
    feedback: string;
  };
}

export interface GuidedStep {
  stepNumber: number;
  id: string;
  title: string;
  instruction: string;
  pedagogicalWhy: string;
  targetSlot: SnapSlotId | 'POWER_BUTTON' | 'SAFETY_CHECK' | 'DIAGNOSTIC_CHECK';
  hint1: string;
  hint2: string;
  isCompleted: (state: InstalledHardwareState, safetyAcknowledged: boolean, postPassed: boolean) => boolean;
}
