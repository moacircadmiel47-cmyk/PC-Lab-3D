import {
  CompatibilityValidationResult,
  InstalledHardwareState,
  SnapSlotId,
  MotherboardSpec,
  CpuSpec,
  RamSpec,
  StorageSpec,
  GpuSpec,
  CoolerSpec,
  PsuSpec,
  CaseSpec,
  CableOrAccessorySpec,
  PostBootSimulationResult,
  PostStageResult,
} from '../types/hardware';
import { getHardwareById } from '../data/catalog';

export function createInitialInstalledState(): InstalledHardwareState {
  return {
    caseId: 'case-corsair-4000d-atx',
    standoffsInstalled: true,
    motherboardId: 'mb-asus-b550m-tuf',
    motherboardBiosUpdated: false,
    cpuId: null,
    cpuOrientationCorrect: true,
    thermalPasteApplied: false,
    coolerId: null,
    ramSlots: {
      slot_ram_1: null,
      slot_ram_2: null,
      slot_ram_3: null,
      slot_ram_4: null,
    },
    m2Slots: {
      slot_m2_1: null,
      slot_m2_2: null,
    },
    gpuId: null,
    pcieAddonId: null,
    driveBays: {
      slot_drive_bay_1: null,
      slot_drive_bay_2: null,
    },
    psuId: 'psu-xpg-core-reactor-750w-atx3',
    cmosBatteryInstalled: true,
    beepSpeakerInstalled: true,
    cables: {
      atx24Pin: true,
      cpuEps: true,
      pciePower: false,
      sataData: false,
      frontPanel: true,
    },
  };
}

export function createEmptyWorkbenchState(): InstalledHardwareState {
  return {
    caseId: null,
    standoffsInstalled: false,
    motherboardId: null,
    motherboardBiosUpdated: false,
    cpuId: null,
    cpuOrientationCorrect: true,
    thermalPasteApplied: false,
    coolerId: null,
    ramSlots: {
      slot_ram_1: null,
      slot_ram_2: null,
      slot_ram_3: null,
      slot_ram_4: null,
    },
    m2Slots: {
      slot_m2_1: null,
      slot_m2_2: null,
    },
    gpuId: null,
    pcieAddonId: null,
    driveBays: {
      slot_drive_bay_1: null,
      slot_drive_bay_2: null,
    },
    psuId: null,
    cmosBatteryInstalled: false,
    beepSpeakerInstalled: false,
    cables: {
      atx24Pin: false,
      cpuEps: false,
      pciePower: false,
      sataData: false,
      frontPanel: false,
    },
  };
}

export function validateInstallation(
  state: InstalledHardwareState,
  itemId: string,
  targetSlot: SnapSlotId,
  rotationStep = 0
): CompatibilityValidationResult {
  const item = getHardwareById(itemId);
  if (!item) {
    return {
      status: 'INSUFFICIENT_DATA',
      allowed: false,
      code: 'ITEM_NOT_FOUND',
      title: 'Informações Insuficientes',
      message: 'Peça não encontrada no banco de dados técnico verificado.',
      educationalDetails: 'O sistema nunca inventa especificações para componentes não cadastrados.',
    };
  }

  const mb = state.motherboardId ? (getHardwareById(state.motherboardId) as MotherboardSpec | undefined) : undefined;
  const pcCase = state.caseId ? (getHardwareById(state.caseId) as CaseSpec | undefined) : undefined;
  const cpu = state.cpuId ? (getHardwareById(state.cpuId) as CpuSpec | undefined) : undefined;
  const psu = state.psuId ? (getHardwareById(state.psuId) as PsuSpec | undefined) : undefined;

  // 1. CASE INSTALLATION
  if (targetSlot === 'slot_case') {
    if (item.category !== 'case') {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'WRONG_SLOT_CATEGORY',
        title: 'Local de Encaixe Incorreto',
        message: `Instalação recusada: "${item.name}" não é um gabinete.`,
        educationalDetails: 'Cada região da bancada possui pontos de encaixe específicos para a categoria do componente.',
      };
    }
    const newCase = item as CaseSpec;
    if (mb && !newCase.supportedFormFactors.includes(mb.formFactor)) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'CASE_MB_FORM_FACTOR_MISMATCH',
        title: 'Gabinete Incompatível com a Placa-Mãe',
        message: `Instalação recusada: a placa-mãe instalada possui formato ${mb.formFactor}, mas o gabinete ${newCase.name} suporta apenas: ${newCase.supportedFormFactors.join(', ')}.`,
        educationalDetails: 'Placas ATX (305 x 244 mm) não cabem fisicamente em gabinetes projetados exclusivamente para Micro-ATX ou Mini-ITX.',
      };
    }
    return {
      status: 'COMPATIBLE',
      allowed: true,
      code: 'CASE_OK',
      title: 'Gabinete Posicionado',
      message: `${newCase.name} posicionado na bancada com sucesso.`,
      educationalDetails: `Suporta placas ${newCase.supportedFormFactors.join(', ')}, GPUs até ${newCase.maxGpuLengthMm ?? '?'} mm e coolers até ${newCase.maxCoolerHeightMm ?? '?'} mm.`,
    };
  }

  // 2. MOTHERBOARD INSTALLATION
  if (targetSlot === 'slot_motherboard') {
    if (item.category !== 'motherboard') {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'WRONG_SLOT_CATEGORY',
        title: 'Local de Encaixe Incorreto',
        message: `Instalação recusada: "${item.name}" não é uma placa-mãe.`,
        educationalDetails: 'A bandeja principal do gabinete aceita apenas placas-mãe.',
      };
    }
    const newMb = item as MotherboardSpec;
    if (pcCase && !state.standoffsInstalled) {
      return {
        status: 'DEPENDENCY_MISSING',
        allowed: false,
        code: 'MISSING_STANDOFFS',
        title: 'Dependência Obrigatória: Espaçadores (Standoffs)',
        message: 'Instalação bloqueada: instale primeiro os Espaçadores Metálicos (Standoffs) no gabinete antes de fixar a placa-mãe!',
        educationalDetails: 'Parafusar a placa-mãe diretamente na chapa metálica do gabinete sem os espaçadores causa curto-circuito nas trilhas traseiras do PCB.',
        remediation: 'Selecione o "Kit de Espaçadores Metálicos (Standoffs M3)" na categoria Cabos/Acessórios e instale no gabinete.',
      };
    }
    if (pcCase && !pcCase.supportedFormFactors.includes(newMb.formFactor)) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'MB_CASE_FORM_FACTOR_MISMATCH',
        title: 'Formato Físico Incompatível com o Gabinete',
        message: `Instalação recusada: a placa-mãe ${newMb.name} é do formato ${newMb.formFactor}, mas o gabinete ${pcCase.name} suporta apenas ${pcCase.supportedFormFactors.join(' e ')}.`,
        educationalDetails: 'Dimensões padrão: ATX (305×244 mm), Micro-ATX (244×244 mm), Mini-ITX (170×170 mm). Um gabinete menor não possui furação nem altura para placas maiores.',
      };
    }
    if (newMb.incompleteSpecsWarning) {
      return {
        status: 'COMPATIBLE_WITH_WARNINGS',
        allowed: true,
        code: 'MB_INCOMPLETE_SPECS_NOTICE',
        title: 'Placa-Mãe Instalada (Documentação OEM Incompleta)',
        message: `${newMb.name} instalada. Atenção: ${newMb.incompleteSpecsWarning}`,
        educationalDetails: 'Em equipamentos OEM sem tabela pública de CPUs/TDP, o sistema sinalizará "Informações Insuficientes" ao tentar validar processadores não documentados.',
      };
    }
    return {
      status: 'COMPATIBLE',
      allowed: true,
      code: 'MB_OK',
      title: 'Placa-Mãe Instalada',
      message: `${newMb.name} (${newMb.socket} · ${newMb.chipset} · ${newMb.ramGeneration}) fixada sobre os espaçadores.`,
      educationalDetails: `Socket ${newMb.socket}, ${newMb.ramSlots} slots ${newMb.ramGeneration} e ${newMb.m2Slots.length} slot(s) M.2 prontos para receber componentes.`,
    };
  }

  // 3. CPU INSTALLATION
  if (targetSlot === 'slot_cpu') {
    if (item.category !== 'cpu') {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'WRONG_SLOT_CATEGORY',
        title: 'Peça Incorreta para o Socket da CPU',
        message: `Instalação recusada: o socket da CPU aceita apenas processadores, não "${item.name}".`,
        educationalDetails: 'O socket ZIF/LGA central é exclusivo para a Unidade Central de Processamento (CPU).',
      };
    }
    if (!mb) {
      return {
        status: 'DEPENDENCY_MISSING',
        allowed: false,
        code: 'MISSING_MOTHERBOARD',
        title: 'Placa-Mãe Não Instalada',
        message: 'Instalação bloqueada: instale uma placa-mãe na bancada antes de encaixar o processador.',
        educationalDetails: 'O processador é instalado diretamente no socket da placa-mãe.',
      };
    }
    if (state.coolerId) {
      return {
        status: 'DEPENDENCY_MISSING',
        allowed: false,
        code: 'COOLER_BLOCKING_SOCKET',
        title: 'Socket Bloqueado pelo Cooler',
        message: 'Remova o cooler do processador antes de trocar ou instalar uma CPU.',
        educationalDetails: 'O dissipador térmico cobre fisicamente o socket do processador.',
      };
    }
    if (state.cpuId) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'CPU_SLOT_OCCUPIED',
        title: 'Socket da CPU Já Ocupado',
        message: 'Já existe um processador instalado neste socket. Remova-o antes de instalar outro.',
        educationalDetails: 'Apenas um processador pode ocupar o socket por vez.',
      };
    }

    const candidateCpu = item as CpuSpec;

    // Rotation / orientation check (Zero Insertion Force triangle alignment)
    if (rotationStep % 4 !== 0) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'CPU_WRONG_ORIENTATION',
        title: 'Orientação Física Incorreta (Pino 1 Desalinhado)',
        message: `Instalação recusada: o processador está girado em ${(rotationStep % 4) * 90}°. Alinhe o triângulo dourado (Pino 1) e os entalhes laterais com o socket (0°) antes de encaixar!`,
        educationalDetails: 'Forçar um processador fora da orientação do Pino 1 entorta os pinos do socket (LGA) ou da própria CPU (PGA), inutilizando a peça.',
        remediation: 'Pressione a tecla "R" ou clique em "Girar Peça (0°)" para alinhar o Pino 1.',
      };
    }

    // Socket check
    if (candidateCpu.socket !== mb.socket) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'CPU_SOCKET_MISMATCH',
        title: 'Socket Físico Incompatível',
        message: `Instalação recusada: este processador (${candidateCpu.name}) utiliza o socket ${candidateCpu.socket}, mas a placa-mãe selecionada (${mb.name}) possui socket ${mb.socket}. Escolha um processador ${mb.socket} compatível ou uma placa-mãe apropriada.`,
        educationalDetails: `O socket ${candidateCpu.socket} (${candidateCpu.manufacturer}) possui dimensões, contagem de pinos e pinagem elétrica diferentes do socket ${mb.socket} (${mb.platform}).`,
      };
    }

    // Check for insufficient technical data (Rule 3: Never invent compatibility when specs are missing!)
    if (
      mb.incompleteSpecsWarning ||
      mb.supportedCpuGenerations.length === 0 ||
      candidateCpu.tdpWatts === null
    ) {
      return {
        status: 'INSUFFICIENT_DATA',
        allowed: false,
        code: 'CPU_MB_INSUFFICIENT_DATA',
        title: 'Informações Insuficientes para Confirmar Compatibilidade',
        message: `Não foi possível confirmar se a placa-mãe ${mb.name} suporta o processador ${candidateCpu.name} (${candidateCpu.tdpWatts ?? '?'}W). A documentação técnica desta placa OEM não especifica a lista de microcódigos BIOS nem o limite térmico do VRM.`,
        educationalDetails: 'Regra de engenharia: quando o fabricante não documenta o suporte de chipset/VRM/BIOS para uma CPU, o técnico não deve adivinhar nem declarar a combinação como compatível.',
        remediation: 'Utilize uma placa-mãe com especificações completas documentadas (ex: Intel DG41RQ para LGA 775).',
      };
    }

    // Chipset & CPU generation check
    const chipsetSupported = candidateCpu.compatibleChipsets.includes(mb.chipset);
    const generationSupported = mb.supportedCpuGenerations.includes(candidateCpu.generation);
    if (!chipsetSupported || !generationSupported) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'CPU_CHIPSET_INCOMPATIBLE',
        title: 'Incompatibilidade de Chipset / Geração',
        message: `Instalação recusada: embora ambos utilizem o socket ${mb.socket}, o chipset ${mb.chipset} da placa ${mb.name} suporta apenas ${mb.supportedCpuGenerations.join(', ')} e não é compatível com ${candidateCpu.name} (${candidateCpu.generation}).`,
        educationalDetails: 'Mesmo com o mesmo socket físico, mudanças no gerenciamento de energia (VRM), linhas PCIe e microcódigo do chipset podem impedir o suporte entre gerações diferentes.',
      };
    }

    // Check RAM controller vs Motherboard RAM generation
    if (!candidateCpu.supportedRamTypes.includes(mb.ramGeneration)) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'CPU_IMC_RAM_MISMATCH',
        title: 'Controlador de Memória Incompatível',
        message: `Instalação recusada: o processador ${candidateCpu.name} suporta apenas memória ${candidateCpu.supportedRamTypes.join('/')}, mas a placa-mãe possui slots ${mb.ramGeneration}.`,
        educationalDetails: 'O controlador de memória integrado (IMC) do processador precisa suportar o padrão DDR presente na placa-mãe.',
      };
    }

    // Check BIOS requirement
    const requiredBios = candidateCpu.minBiosVersionByChipset?.[mb.chipset];
    if (requiredBios && !state.motherboardBiosUpdated && mb.shippedBiosVersion < requiredBios) {
      return {
        status: 'BIOS_UPDATE_REQUIRED',
        allowed: true,
        code: 'BIOS_UPDATE_NEEDED',
        title: 'Encaixado — Requer Atualização de BIOS',
        message: `${candidateCpu.name} encaixou fisicamente no socket ${mb.socket}, mas a placa-mãe ${mb.name} está com a BIOS de fábrica (${mb.shippedBiosVersion}) e exige a versão ${requiredBios} ou superior para reconhecer a arquitetura ${candidateCpu.architecture}!`,
        educationalDetails: 'Sem atualizar o firmware BIOS/UEFI (ex: via USB BIOS Flashback ou com um processador mais antigo), o computador falhará no POST com o LED CPU aceso.',
        remediation: 'Clique no botão "Atualizar BIOS (USB Flashback)" na barra da bancada antes de ligar o PC.',
      };
    }

    return {
      status: 'COMPATIBLE',
      allowed: true,
      code: 'CPU_OK',
      title: 'Processador Instalado com Sucesso',
      message: `${candidateCpu.name} instalado corretamente no socket ${mb.socket} (${mb.chipset}).`,
      educationalDetails: `Alavanca de retenção travada. Próximo passo obrigatório: aplicar pasta térmica e instalar um cooler compatível com TDP de ${candidateCpu.tdpWatts}W.`,
    };
  }

  // 4. THERMAL PASTE & ACCESSORIES / CABLES
  if (item.category === 'cable') {
    const acc = item as CableOrAccessorySpec;

    if (targetSlot === 'slot_standoffs' && acc.accessoryType === 'CASE_STANDOFFS') {
      if (!pcCase) {
        return {
          status: 'DEPENDENCY_MISSING',
          allowed: false,
          code: 'MISSING_CASE_FOR_STANDOFFS',
          title: 'Gabinete Necessário',
          message: 'Posicione primeiro um gabinete na bancada para instalar os espaçadores metálicos.',
          educationalDetails: 'Os espaçadores (standoffs) são rosqueados na chapa interna do gabinete.',
        };
      }
      return {
        status: 'COMPATIBLE',
        allowed: true,
        code: 'STANDOFFS_OK',
        title: 'Espaçadores (Standoffs) Instalados',
        message: 'Os espaçadores de latão M3 foram alinhados e rosqueados no gabinete.',
        educationalDetails: 'Agora a placa-mãe pode ser parafusada com segurança sem encostar a solda traseira no chassi.',
      };
    }

    if (targetSlot === 'slot_thermal_paste' && acc.accessoryType === 'THERMAL_PASTE') {
      if (!cpu) {
        return {
          status: 'DEPENDENCY_MISSING',
          allowed: false,
          code: 'MISSING_CPU_FOR_PASTE',
          title: 'Processador Não Instalado',
          message: 'Instalação bloqueada: instale o processador no socket antes de aplicar a pasta térmica.',
          educationalDetails: 'A pasta térmica deve ser aplicada no centro do difusor metálico (IHS) do processador.',
        };
      }
      if (state.coolerId) {
        return {
          status: 'DEPENDENCY_MISSING',
          allowed: false,
          code: 'COOLER_ALREADY_ON',
          title: 'Cooler Já Instalado',
          message: 'Remova o cooler caso precise reaplicar a pasta térmica.',
          educationalDetails: 'A pasta térmica fica entre o topo do processador e a base do dissipador.',
        };
      }
      return {
        status: 'COMPATIBLE',
        allowed: true,
        code: 'THERMAL_PASTE_OK',
        title: 'Pasta Térmica Aplicada',
        message: 'Quantidade ideal de pasta térmica aplicada no centro do IHS do processador.',
        educationalDetails: 'Ao instalar o cooler, a pressão da base espalhará o composto eliminando microbolhas de ar.',
      };
    }

    if (targetSlot === 'slot_cmos_battery' && acc.accessoryType === 'CMOS_BATTERY') {
      if (!mb) {
        return {
          status: 'DEPENDENCY_MISSING',
          allowed: false,
          code: 'MISSING_MB_FOR_CMOS',
          title: 'Placa-Mãe Necessária',
          message: 'Instale a placa-mãe antes de encaixar a bateria CMOS CR2032.',
          educationalDetails: 'O suporte da bateria CR2032 fica soldado na placa-mãe.',
        };
      }
      return {
        status: 'COMPATIBLE',
        allowed: true,
        code: 'CMOS_OK',
        title: 'Bateria CMOS CR2032 Instalada',
        message: 'Bateria de lítio 3V instalada no suporte da placa-mãe.',
        educationalDetails: 'Garante a retenção das configurações de BIOS/UEFI e funcionamento do relógio RTC.',
      };
    }

    if (targetSlot === 'slot_beep_speaker' && acc.accessoryType === 'BEEP_SPEAKER') {
      if (!mb) {
        return {
          status: 'DEPENDENCY_MISSING',
          allowed: false,
          code: 'MISSING_MB_FOR_SPEAKER',
          title: 'Placa-Mãe Necessária',
          message: 'Instale a placa-mãe antes de conectar o alto-falante interno de diagnóstico (Beep Speaker).',
          educationalDetails: 'O speaker é conectado ao header de 4 pinos próximo ao painel frontal da placa-mãe.',
        };
      }
      return {
        status: 'COMPATIBLE',
        allowed: true,
        code: 'SPEAKER_OK',
        title: 'Speaker de Diagnóstico Conectado',
        message: 'Alto-falante piezoelétrico conectado ao header SPEAKER da placa-mãe.',
        educationalDetails: 'Emitirá sinais sonoros (bipes de POST) durante a inicialização.',
      };
    }

    if (targetSlot === 'slot_cable_24pin' && acc.accessoryType === 'CABLE_ATX_24PIN') {
      if (!mb || !psu) {
        return {
          status: 'DEPENDENCY_MISSING',
          allowed: false,
          code: 'MISSING_MB_OR_PSU_24PIN',
          title: 'Placa-Mãe e Fonte Necessárias',
          message: 'Instalação bloqueada: tanto a placa-mãe quanto a fonte de alimentação devem estar instaladas antes de conectar o cabo ATX de 24 pinos.',
          educationalDetails: 'O cabo ATX 24 pinos liga a saída principal da fonte ao conector de alimentação da placa-mãe.',
        };
      }
      return {
        status: 'COMPATIBLE',
        allowed: true,
        code: 'CABLE_24PIN_OK',
        title: 'Cabo ATX 24 Pinos Conectado',
        message: 'Alimentação principal (+12V, +5V, +3.3V, +5VSB) conectada à placa-mãe.',
        educationalDetails: 'Trava lateral presa com firmeza.',
      };
    }

    if (targetSlot === 'slot_cable_cpu_eps' && acc.accessoryType === 'CABLE_CPU_EPS') {
      if (!mb || !psu) {
        return {
          status: 'DEPENDENCY_MISSING',
          allowed: false,
          code: 'MISSING_MB_OR_PSU_EPS',
          title: 'Placa-Mãe e Fonte Necessárias',
          message: 'Instale a placa-mãe e a fonte antes de conectar o cabo EPS 12V da CPU.',
          educationalDetails: 'O cabo EPS 4+4 pinos alimenta o circuito VRM do processador.',
        };
      }
      if (mb.cpuPowerConnector === '8+4-pin' && psu.cpu8PinCount < 2) {
        return {
          status: 'COMPATIBLE_WITH_WARNINGS',
          allowed: true,
          code: 'CPU_EPS_SINGLE_8PIN_WARNING',
          title: 'Cabo EPS 8 Pinos Conectado (Sem +4 Pinos Auxiliar)',
          message: `O conector principal de 8 pinos foi ligado na ${mb.name}, mas a fonte ${psu.name} possui apenas 1 cabo EPS (o conector auxiliar de 4 pinos para overclock extremo ficou vazio).`,
          educationalDetails: 'Placas Z790/Z890 funcionam perfeitamente em uso normal apenas com o conector de 8 pinos (que suporta até 336W); o conector extra de 4 pinos só é exigido em overclock extremo.',
        };
      }
      return {
        status: 'COMPATIBLE',
        allowed: true,
        code: 'CABLE_EPS_OK',
        title: 'Cabo de Alimentação da CPU (EPS 12V) Conectado',
        message: `Conector ${mb.cpuPowerConnector} ligado ao VRM da placa-mãe.`,
        educationalDetails: 'Fornece a linha dedicada de +12V essencial para o processador operar.',
      };
    }

    if (targetSlot === 'slot_cable_pcie_power' && acc.accessoryType === 'CABLE_PCIE_POWER') {
      const gpu = state.gpuId ? (getHardwareById(state.gpuId) as GpuSpec | undefined) : undefined;
      if (!gpu || !psu) {
        return {
          status: 'DEPENDENCY_MISSING',
          allowed: false,
          code: 'MISSING_GPU_OR_PSU',
          title: 'Placa de Vídeo e Fonte Necessárias',
          message: 'Instale uma placa de vídeo dedicada e uma fonte de alimentação antes de conectar o cabo de energia PCIe.',
          educationalDetails: 'O cabo PCIe liga a fonte diretamente ao conector superior da placa de vídeo.',
        };
      }
      if (gpu.requiredPowerConnector === 'NONE') {
        return {
          status: 'INCOMPATIBLE',
          allowed: false,
          code: 'GPU_NO_POWER_CONNECTOR',
          title: 'Placa de Vídeo Não Possui Conector de Energia Auxiliar',
          message: `A placa ${gpu.name} (${gpu.tdpWatts}W) recebe toda a energia necessária pelo próprio slot PCI Express x16 e não possui entrada para cabo da fonte.`,
          educationalDetails: 'Placas de vídeo com TDP até 75W frequentemente dispensam conector auxiliar da fonte.',
        };
      }
      if (gpu.requiredPowerConnector === '1x8-pin' && psu.pcie8PinCount < 1) {
        return {
          status: 'INCOMPATIBLE',
          allowed: false,
          code: 'PSU_MISSING_PCIE_8PIN',
          title: 'Fonte Não Possui Conector PCIe de 8 Pinos',
          message: `Instalação recusada: a placa ${gpu.name} exige 1 conector PCIe de 8 pinos, mas a fonte instalada (${psu.name}) possui 0 conectores PCIe!`,
          educationalDetails: 'Fontes genéricas de baixa potência não possuem cabeamento nem capacidade na linha +12V para alimentar placas de vídeo dedicadas.',
          remediation: 'Substitua a fonte por um modelo de 550W ou 750W que possua conectores PCIe.',
        };
      }
      if (gpu.requiredPowerConnector === '12V-2x6' && !psu.has12V2x6Connector && psu.pcie8PinCount < 2) {
        return {
          status: 'INCOMPATIBLE',
          allowed: false,
          code: 'PSU_MISSING_12V2X6',
          title: 'Fonte Sem Suporte a Conector 12V-2x6 / 2x8-Pin',
          message: `Instalação recusada: a placa ${gpu.name} exige alimentação 12V-2x6 (ou 2 conectores PCIe 8 pinos), ausentes na fonte ${psu.name}.`,
          educationalDetails: 'GPUs de alto desempenho exigem fontes modernas com cabeamento dedicado de alta corrente.',
        };
      }
      return {
        status: 'COMPATIBLE',
        allowed: true,
        code: 'CABLE_PCIE_OK',
        title: 'Alimentação da Placa de Vídeo Conectada',
        message: `Cabo ${gpu.requiredPowerConnector} conectado com firmeza à ${gpu.name}.`,
        educationalDetails: 'A GPU agora recebe energia suficiente tanto do slot PCIe quanto da fonte.',
      };
    }

    if (targetSlot === 'slot_cable_sata' && acc.accessoryType === 'CABLE_SATA_DATA') {
      const hasSataDrive = Boolean(state.driveBays.slot_drive_bay_1 || state.driveBays.slot_drive_bay_2);
      if (!mb || !psu || !hasSataDrive) {
        return {
          status: 'DEPENDENCY_MISSING',
          allowed: false,
          code: 'MISSING_SATA_DRIVE_OR_MB',
          title: 'Unidade SATA, Placa-Mãe e Fonte Necessárias',
          message: 'Instale primeiro um HDD ou SSD SATA na baia de discos (além da placa-mãe e da fonte) antes de conectar os cabos SATA.',
          educationalDetails: 'Dispositivos SATA de 2,5" e 3,5" exigem cabo de dados SATA (7 pinos) na placa-mãe e cabo de energia SATA (15 pinos) na fonte.',
        };
      }
      return {
        status: 'COMPATIBLE',
        allowed: true,
        code: 'CABLE_SATA_OK',
        title: 'Cabos de Dados e Energia SATA Conectados',
        message: 'O cabo de dados SATA III (6 Gbps) e a alimentação SATA da fonte foram conectados às unidades instaladas.',
        educationalDetails: 'Comunicação entre o controlador SATA da placa-mãe e o armazenamento estabelecida.',
      };
    }

    if (targetSlot === 'slot_cable_front_panel' && acc.accessoryType === 'CABLE_FRONT_PANEL') {
      if (!mb) {
        return {
          status: 'DEPENDENCY_MISSING',
          allowed: false,
          code: 'MISSING_MB_FPANEL',
          title: 'Placa-Mãe Necessária',
          message: 'Instale a placa-mãe antes de conectar os cabos do painel frontal (F_PANEL).',
          educationalDetails: 'O header F_PANEL fica no canto inferior direito da placa-mãe.',
        };
      }
      return {
        status: 'COMPATIBLE',
        allowed: true,
        code: 'CABLE_FPANEL_OK',
        title: 'Painel Frontal (F_PANEL) Conectado',
        message: 'Conectores PWR_SW, RESET_SW, PWR_LED e HDD_LED ligados ao header F_PANEL da placa-mãe.',
        educationalDetails: 'Agora o botão de ligar do gabinete pode acionar a inicialização da placa-mãe.',
      };
    }

    return {
      status: 'INCOMPATIBLE',
      allowed: false,
      code: 'WRONG_ACCESSORY_TARGET',
      title: 'Conector Incompatível com Este Ponto',
      message: `Instalação recusada: "${acc.name}" não pertence ao ponto "${targetSlot}".`,
      educationalDetails: 'Verifique a função de cada cabo ou acessório e arraste-o para o conector correspondente destacado na placa-mãe.',
    };
  }

  // 5. COOLER INSTALLATION
  if (targetSlot === 'slot_cooler') {
    if (item.category !== 'cooler') {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'WRONG_SLOT_CATEGORY',
        title: 'Peça Incorreta para Refrigeração',
        message: `O suporte sobre o processador aceita apenas um Cooler / Dissipador, não "${item.name}".`,
        educationalDetails: 'Selecione um cooler a ar ou refrigeração líquida AIO.',
      };
    }
    if (!mb || !cpu) {
      return {
        status: 'DEPENDENCY_MISSING',
        allowed: false,
        code: 'MISSING_CPU_FOR_COOLER',
        title: 'Processador Não Instalado',
        message: 'Instalação bloqueada: instale a placa-mãe e o processador antes de montar o cooler.',
        educationalDetails: 'O cooler é fixado sobre o processador.',
      };
    }
    if (!state.thermalPasteApplied) {
      return {
        status: 'DEPENDENCY_MISSING',
        allowed: false,
        code: 'MISSING_THERMAL_PASTE',
        title: 'Dependência Didática: Aplique a Pasta Térmica Primeiro!',
        message: 'Instalação bloqueada: você ainda não aplicou a pasta térmica sobre o processador! Sem pasta térmica, o ar microscópico entre o IHS e o cooler causará superaquecimento imediato.',
        educationalDetails: 'Na montagem correta, aplica-se a pasta térmica antes de assentar e parafusar o dissipador.',
        remediation: 'Selecione a "Pasta Térmica Arctic MX-4" na aba Cabos/Acessórios e aplique sobre a CPU.',
      };
    }

    const cooler = item as CoolerSpec;

    if (!cooler.supportedSockets.includes(mb.socket)) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'COOLER_SOCKET_MISMATCH',
        title: 'Furação do Cooler Incompatível com o Socket',
        message: `Instalação recusada: o cooler ${cooler.name} suporta os sockets [${cooler.supportedSockets.join(', ')}], mas a placa-mãe utiliza o socket ${mb.socket}.`,
        educationalDetails: 'O espaçamento entre os furos de fixação do backplate varia entre plataformas antigas e modernas.',
      };
    }

    if (pcCase) {
      if (pcCase.maxCoolerHeightMm === null) {
        return {
          status: 'INSUFFICIENT_DATA',
          allowed: false,
          code: 'CASE_COOLER_HEIGHT_UNKNOWN',
          title: 'Informações Insuficientes de Altura no Gabinete',
          message: 'O gabinete selecionado não informa a altura máxima suportada para o cooler da CPU.',
          educationalDetails: 'Sem a medida de folga lateral do gabinete, não é possível confirmar se o dissipador permitirá fechar a tampa lateral.',
        };
      }
      if (cooler.heightMm > pcCase.maxCoolerHeightMm) {
        return {
          status: 'INCOMPATIBLE',
          allowed: false,
          code: 'COOLER_TOO_TALL_FOR_CASE',
          title: 'Cooler Muito Alto para o Gabinete',
          message: `Instalação recusada: o cooler ${cooler.name} possui ${cooler.heightMm} mm de altura, excedendo o limite físico de ${pcCase.maxCoolerHeightMm} mm do gabinete ${pcCase.name}!`,
          educationalDetails: 'Gabinetes compactos Mini-ITX exigem coolers de perfil baixo (low-profile) ou refrigeração compatível.',
        };
      }
      if (cooler.radiatorSizeMm === 240 && !pcCase.supports240mmRadiator) {
        return {
          status: 'INCOMPATIBLE',
          allowed: false,
          code: 'CASE_NO_240MM_RADIATOR_SUPPORT',
          title: 'Gabinete Não Comporta Radiador de 240 mm',
          message: `Instalação recusada: o Water Cooler ${cooler.name} possui um radiador duplo de 240 mm, mas o gabinete compacto ${pcCase.name} não possui espaço para radiadores de 240 mm.`,
          educationalDetails: 'Verifique sempre o suporte a radiadores no topo ou na frente do gabinete antes de escolher um Water Cooler AIO.',
        };
      }
    }

    if (cpu.tdpWatts !== null && cooler.maxTdpWatts < cpu.tdpWatts) {
      return {
        status: 'COMPATIBLE_WITH_WARNINGS',
        allowed: true,
        code: 'COOLER_TDP_INSUFFICIENT_WARNING',
        title: 'Cooler Instalado com Ressalva Térmica (TDP Subdimensionado)',
        message: `Atenção: o processador ${cpu.name} possui TDP de ${cpu.tdpWatts}W, mas o ${cooler.name} é dimensionado para apenas ${cooler.maxTdpWatts}W! O computador sofrerá Thermal Throttling (redução de clock por superaquecimento).`,
        educationalDetails: 'O dissipador encaixa fisicamente no socket, mas sua capacidade de dissipação térmica é inferior ao calor gerado pela CPU sob carga.',
        remediation: 'Recomendado substituir por um cooler de torre (220W) ou Water Cooler AIO (250W).',
      };
    }

    return {
      status: 'COMPATIBLE',
      allowed: true,
      code: 'COOLER_OK',
      title: 'Sistema de Refrigeração Instalado',
      message: `${cooler.name} fixado sobre o processador e conectado ao header CPU_FAN.`,
      educationalDetails: `Capacidade térmica de ${cooler.maxTdpWatts}W adequada para o TDP de ${cpu.tdpWatts ?? '?'}W da CPU.`,
    };
  }

  // 6. RAM INSTALLATION
  if (
    targetSlot === 'slot_ram_1' ||
    targetSlot === 'slot_ram_2' ||
    targetSlot === 'slot_ram_3' ||
    targetSlot === 'slot_ram_4'
  ) {
    if (item.category !== 'ram') {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'WRONG_SLOT_CATEGORY',
        title: 'Slot Exclusivo para Memória RAM',
        message: `Instalação recusada: os slots DIMM aceitam apenas módulos de memória RAM, não "${item.name}".`,
        educationalDetails: 'Arraste a peça para o conector correto.',
      };
    }
    if (!mb) {
      return {
        status: 'DEPENDENCY_MISSING',
        allowed: false,
        code: 'MISSING_MB_FOR_RAM',
        title: 'Placa-Mãe Não Instalada',
        message: 'Instale uma placa-mãe antes de encaixar os módulos de memória RAM.',
        educationalDetails: 'Os slots DIMM estão localizados na placa-mãe.',
      };
    }

    const slotNumber = Number(targetSlot.replace('slot_ram_', ''));
    if (slotNumber > mb.ramSlots) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'RAM_SLOT_NOT_PRESENT_ON_MB',
        title: 'Slot Indisponível Nesta Placa-Mãe',
        message: `Instalação recusada: a placa-mãe ${mb.name} (${mb.formFactor}) possui apenas ${mb.ramSlots} slots de memória (DIMM 1 e DIMM 2). O slot ${slotNumber} não existe neste modelo.`,
        educationalDetails: 'Placas Mini-ITX e modelos Micro-ATX de entrada frequentemente possuem apenas 2 slots de memória RAM.',
      };
    }

    if (state.ramSlots[targetSlot] !== null) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'RAM_SLOT_OCCUPIED',
        title: 'Slot de Memória Ocupado',
        message: `O slot ${targetSlot.toUpperCase()} já possui um módulo instalado. Escolha um slot vazio ou remova o pente atual.`,
        educationalDetails: 'Para ativar o Dual-Channel em placas de 4 slots, prefira os slots A2 (Slot 2) e B2 (Slot 4).',
      };
    }

    const ram = item as RamSpec;

    // Form factor check (SO-DIMM vs DIMM)
    if (ram.formFactor !== mb.ramFormFactor) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'RAM_FORM_FACTOR_MISMATCH',
        title: 'Formato Físico Incompatível (SO-DIMM vs DIMM)',
        message: `Instalação recusada: o módulo ${ram.name} possui formato ${ram.formFactor} (${ram.pins} pinos, padrão de notebook), mas a placa-mãe utiliza slots ${mb.ramFormFactor} de desktop!`,
        educationalDetails: 'Um pente SO-DIMM tem 67,6 mm de largura contra 133,35 mm de um pente DIMM de desktop, sendo fisicamente impossível encaixá-lo.',
      };
    }

    // DDR Generation check (DDR, DDR2, DDR3, DDR4, DDR5)
    if (ram.generation !== mb.ramGeneration) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'RAM_DDR_GENERATION_MISMATCH',
        title: `Geração de Memória Incompatível (${ram.generation} em Slot ${mb.ramGeneration})`,
        message: `Instalação recusada: você tentou instalar uma memória ${ram.generation} (${ram.pins} pinos, ${ram.voltageV}V) em uma placa-mãe ${mb.name} que aceita exclusivamente ${mb.ramGeneration}!`,
        educationalDetails: `Cada geração DDR (${ram.generation} vs ${mb.ramGeneration}) possui o entalhe físico (key notch) em uma posição diferente para impedir a inserção incorreta e evitar queimar o módulo por diferença de tensão elétrica.`,
      };
    }

    // Check rotation (180 degrees flipped notch)
    if (rotationStep % 2 !== 0) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'RAM_NOTCH_INVERTED',
        title: 'Módulo Invertido (Entalhe Físico Desalinhado)',
        message: 'Instalação recusada: o entalhe (key notch) da memória está invertido em 180° em relação à trava central do slot DIMM! Gire o módulo antes de encaixar.',
        educationalDetails: 'O entalhe nos contatos dourados do pente de RAM é descentralizado justamente para impedir que o módulo seja encaixado ao contrário.',
        remediation: 'Pressione "R" ou clique em "Girar Peça" para alinhar o entalhe do módulo com o slot.',
      };
    }

    // Check insufficient data on motherboard max RAM capacity
    if (mb.maxRamCapacityGb === null) {
      return {
        status: 'INSUFFICIENT_DATA',
        allowed: false,
        code: 'RAM_MAX_CAPACITY_UNKNOWN',
        title: 'Informações Insuficientes de Capacidade Máxima',
        message: `Não foi possível confirmar se o chipset ${mb.chipset} da placa ${mb.name} reconhece módulos de ${ram.capacityGb} GB, pois a capacidade máxima suportada por slot não consta na documentação técnica.`,
        educationalDetails: 'O sistema recusa confirmar compatibilidade quando faltam especificações verificadas do controlador de memória.',
      };
    }

    const currentRamTotal = Object.values(state.ramSlots).reduce((acc, id) => {
      const r = getHardwareById(id) as RamSpec | undefined;
      return acc + (r ? r.capacityGb : 0);
    }, 0);

    const maxPerSlot = mb.maxRamCapacityGb / mb.ramSlots;
    if (ram.capacityGb > maxPerSlot || currentRamTotal + ram.capacityGb > mb.maxRamCapacityGb) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'RAM_CAPACITY_EXCEEDED',
        title: 'Capacidade de Memória Excede o Limite da Placa-Mãe',
        message: `Instalação recusada: a placa-mãe ${mb.name} suporta no máximo ${mb.maxRamCapacityGb} GB no total (${maxPerSlot} GB por slot), mas este módulo possui ${ram.capacityGb} GB.`,
        educationalDetails: 'Placas-mãe antigas como LGA 775 (máx. 4 GB por slot) não conseguem endereçar módulos de alta densidade.',
      };
    }

    if (ram.speedMTs > mb.maxRamSpeedMhz) {
      return {
        status: 'COMPATIBLE_WITH_WARNINGS',
        allowed: true,
        code: 'RAM_SPEED_DOWNCLOCKED',
        title: 'Memória Instalada (Frequência Ajustada pela Placa-Mãe)',
        message: `${ram.name} (${ram.speedMTs} MT/s) instalada, mas operará limitada a ${mb.maxRamSpeedMhz} MT/s devido ao limite da placa-mãe ${mb.name}.`,
        educationalDetails: 'Módulos DDR com frequência superior ao limite do chipset/CPU reduzem automaticamente seu clock (downclock) via perfil JEDEC.',
      };
    }

    return {
      status: 'COMPATIBLE',
      allowed: true,
      code: 'RAM_OK',
      title: 'Memória RAM Instalada',
      message: `${ram.name} (${ram.capacityGb} GB ${ram.generation}-${ram.speedMTs}) encaixada no ${targetSlot.toUpperCase()} com as travas laterais fechadas.`,
      educationalDetails: `Entalhe de ${ram.pins} pinos (${ram.voltageV}V) alinhado perfeitamente.`,
    };
  }

  // 7. M.2 STORAGE INSTALLATION
  if (targetSlot === 'slot_m2_1' || targetSlot === 'slot_m2_2') {
    if (item.category !== 'storage') {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'WRONG_SLOT_CATEGORY',
        title: 'Slot Exclusivo para Armazenamento M.2',
        message: `O slot M.2 aceita apenas SSDs em formato M.2, não "${item.name}".`,
        educationalDetails: 'Selecione uma unidade de armazenamento M.2 2280.',
      };
    }
    if (!mb) {
      return {
        status: 'DEPENDENCY_MISSING',
        allowed: false,
        code: 'MISSING_MB_FOR_M2',
        title: 'Placa-Mãe Necessária',
        message: 'Instale uma placa-mãe antes de instalar dispositivos M.2.',
        educationalDetails: 'Os conectores M.2 ficam soldados na superfície da placa-mãe.',
      };
    }
    if (state.m2Slots[targetSlot] !== null) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'M2_SLOT_OCCUPIED',
        title: 'Slot M.2 Já Ocupado',
        message: 'Já existe um SSD M.2 instalado neste conector.',
        educationalDetails: 'Remova o SSD atual ou utilize o segundo slot M.2 caso a placa-mãe possua.',
      };
    }

    const storage = item as StorageSpec;
    if (storage.formFactor !== 'M2_2280') {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'STORAGE_NOT_M2_FORM_FACTOR',
        title: 'Formato Físico Incompatível com Slot M.2',
        message: `Instalação recusada: ${storage.name} possui formato físico de ${storage.formFactor === '3.5_INCH' ? '3,5 polegadas' : '2,5 polegadas'} (interface SATA com cabos) e não pode ser conectado em um slot M.2 na placa-mãe!`,
        educationalDetails: 'Discos de 3,5" e 2,5" devem ser instalados nas baias laterais do gabinete e ligados por cabos SATA.',
        remediation: 'Arraste este disco para a "Baia de Armazenamento SATA 1 ou 2" do gabinete.',
      };
    }

    const m2Spec = mb.m2Slots.find((s) => s.id === targetSlot);
    if (!m2Spec) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'M2_SLOT_NOT_AVAILABLE_ON_MB',
        title: 'Slot M.2 Inexistente Nesta Placa-Mãe',
        message: `Instalação recusada: a placa-mãe ${mb.name} (${mb.chipset}) possui ${mb.m2Slots.length} slot(s) M.2 e não dispõe do conector ${targetSlot.toUpperCase()}.`,
        educationalDetails: 'Placas-mãe mais antigas (como LGA 775 e AM3+) não possuem conectores M.2, exigindo discos SATA de 2,5" ou 3,5".',
      };
    }

    // Protocol check: M.2 SATA vs M.2 NVMe PCIe
    if (storage.storageType === 'SSD_M2_SATA' && !m2Spec.supportedProtocols.includes('SATA')) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'M2_PROTOCOL_MISMATCH_SATA_IN_NVME_ONLY',
        title: 'Incompatibilidade de Protocolo M.2 (SATA vs NVMe Exclusivo)',
        message: `Instalação recusada: o SSD "${storage.name}" utiliza o protocolo AHCI/SATA (Chave B+M), mas o slot "${m2Spec.label}" da placa-mãe ${mb.name} suporta exclusivamente o protocolo PCIe NVMe!`,
        educationalDetails: 'M.2 é apenas o formato físico do conector! Um SSD M.2 SATA exige que o slot M.2 esteja ligado a uma porta do controlador SATA; em slots ligados apenas às linhas PCI Express (NVMe), ele não funciona.',
        remediation: 'Escolha um SSD M.2 NVMe (ex: Samsung 980 PRO) ou utilize um slot M.2 híbrido que suporte SATA.',
      };
    }

    if (storage.interface === 'M2_NVME_PCIE5' && !m2Spec.supportedProtocols.includes('NVMe_PCIe5')) {
      return {
        status: 'COMPATIBLE_WITH_WARNINGS',
        allowed: true,
        code: 'M2_PCIE5_DOWNGRADED_BANDWIDTH',
        title: 'SSD M.2 PCIe 5.0 Instalado (Operando em Modo Retrocompatível)',
        message: `${storage.name} instalado no slot ${m2Spec.label}. Como este slot opera em PCIe ${mb.pcieGeneration}.0, a velocidade máxima ficará limitada ao barramento do slot.`,
        educationalDetails: 'O padrão PCI Express é retrocompatível: um SSD PCIe 5.0 funciona normalmente em slots PCIe 4.0 ou 3.0, apenas reduzindo sua taxa de transferência de pico.',
      };
    }

    return {
      status: 'COMPATIBLE',
      allowed: true,
      code: 'M2_OK',
      title: 'SSD M.2 Instalado com Sucesso',
      message: `${storage.name} (${storage.protocol}) encaixado e parafusado no slot ${m2Spec.label}.`,
      educationalDetails: 'Comunicação e alimentação ocorrem diretamente pelo conector M.2, dispensando cabos SATA.',
    };
  }

  // 8. SATA DRIVE BAY INSTALLATION (3.5" HDD / 2.5" HDD & SSD)
  if (targetSlot === 'slot_drive_bay_1' || targetSlot === 'slot_drive_bay_2') {
    if (item.category !== 'storage') {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'WRONG_SLOT_CATEGORY',
        title: 'Baia Exclusiva para Unidades de Armazenamento SATA',
        message: `As baias do gabinete aceitam apenas HDDs de 3,5"/2,5" ou SSDs de 2,5", não "${item.name}".`,
        educationalDetails: 'Arraste um HDD ou SSD SATA de 2,5"/3,5" para esta gaveta.',
      };
    }
    if (state.driveBays[targetSlot] !== null) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'DRIVE_BAY_OCCUPIED',
        title: 'Baia de Disco Já Ocupada',
        message: 'Esta gaveta de armazenamento já contém um disco instalado.',
        educationalDetails: 'Utilize a outra baia disponível ou remova a unidade atual.',
      };
    }

    const storage = item as StorageSpec;
    if (storage.formFactor === 'M2_2280') {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'M2_IN_SATA_BAY',
        title: 'Formato Físico Incompatível (M.2 em Baia de 3,5"/2,5")',
        message: `Instalação recusada: ${storage.name} é um módulo M.2 2280 e deve ser instalado diretamente no conector M.2 da placa-mãe, não nas baias de disco do gabinete!`,
        educationalDetails: 'Unidades M.2 têm formato de pequeno cartão (22 x 80 mm) e não utilizam cabos SATA.',
        remediation: 'Arraste este SSD para o "Slot M.2_1 Principal" na placa-mãe.',
      };
    }

    return {
      status: 'COMPATIBLE',
      allowed: true,
      code: 'SATA_DRIVE_OK',
      title: 'Unidade SATA Instalada na Baia',
      message: `${storage.name} fixado na baia. Lembre-se de conectar o Cabo de Dados e Energia SATA para que seja reconhecido no boot!`,
      educationalDetails: storage.storageType === 'HDD'
        ? `Este HDD mecânico possui pratos magnéticos que giram a ${storage.rpm} RPM. Clique em "Animação Interna 3D" para ver os pratos e o braço atuador em ação!`
        : 'Este SSD SATA 2,5" utiliza memórias Flash NAND sem partes móveis, mas requer os mesmos cabos SATA de dados e energia.',
    };
  }

  // 9. GPU & PCIe EXPANSION INSTALLATION
  if (targetSlot === 'slot_gpu_pcie16' || targetSlot === 'slot_pcie_x1') {
    if (item.category !== 'gpu') {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'WRONG_SLOT_CATEGORY',
        title: 'Slot Exclusivo para Placas PCI Express',
        message: `Os slots PCI Express aceitam apenas placas de vídeo ou placas de expansão PCIe, não "${item.name}".`,
        educationalDetails: 'O barramento PCI Express conecta placas de vídeo e periféricos de alta velocidade.',
      };
    }
    if (!mb) {
      return {
        status: 'DEPENDENCY_MISSING',
        allowed: false,
        code: 'MISSING_MB_FOR_GPU',
        title: 'Placa-Mãe Necessária',
        message: 'Instale a placa-mãe antes de encaixar placas nos slots PCI Express.',
        educationalDetails: 'Os slots PCIe fazem parte da placa-mãe.',
      };
    }

    const gpu = item as GpuSpec;

    if (targetSlot === 'slot_pcie_x1') {
      if (mb.pcieX1Slots === 0) {
        return {
          status: 'INCOMPATIBLE',
          allowed: false,
          code: 'NO_PCIE_X1_ON_MB',
          title: 'Slot PCIe x1 Inexistente Nesta Placa-Mãe',
          message: `Instalação recusada: a placa-mãe ${mb.name} (${mb.formFactor}) possui apenas 1 slot PCIe x16 e nenhum slot PCIe x1 secundário.`,
          educationalDetails: 'Placas Mini-ITX compactas só possuem espaço físico para um único slot de expansão PCI Express x16.',
        };
      }
      if (gpu.interface === 'PCIe_x16') {
        return {
          status: 'INCOMPATIBLE',
          allowed: false,
          code: 'PCIE_X16_CARD_IN_X1_SLOT',
          title: 'Conector PCIe x16 Muito Longo para o Slot PCIe x1',
          message: `Instalação recusada: a placa de vídeo ${gpu.name} utiliza um conector longo de 16 linhas (PCIe x16, 89 mm) que não cabe fisicamente no slot curto PCIe x1 (25 mm)!`,
          educationalDetails: 'Uma placa x1 cabe em um slot x16, mas uma placa x16 não cabe em um slot x1 fechado.',
          remediation: 'Instale a placa de vídeo no "Slot PCI Express x16 Principal".',
        };
      }
      return {
        status: 'COMPATIBLE',
        allowed: true,
        code: 'PCIE_ADDON_OK',
        title: 'Placa de Expansão PCIe x1 Instalada',
        message: `${gpu.name} encaixada no slot PCI Express x1.`,
        educationalDetails: 'Não exige conector de energia adicional.',
      };
    }

    // targetSlot === 'slot_gpu_pcie16'
    if (state.gpuId) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'GPU_SLOT_OCCUPIED',
        title: 'Slot PCIe x16 Já Ocupado',
        message: 'Já existe uma placa instalada no slot PCIe x16 principal.',
        educationalDetails: 'Remova a placa atual antes de instalar outro modelo.',
      };
    }

    if (pcCase) {
      if (pcCase.maxGpuLengthMm === null) {
        return {
          status: 'INSUFFICIENT_DATA',
          allowed: false,
          code: 'CASE_GPU_LENGTH_UNKNOWN',
          title: 'Informações Insuficientes de Espaço no Gabinete',
          message: 'O gabinete selecionado não especifica o comprimento máximo suportado para placas de vídeo.',
          educationalDetails: 'Sem a medida interna do chassi, o sistema não pode confirmar se a placa caberá.',
        };
      }
      if (gpu.lengthMm > pcCase.maxGpuLengthMm) {
        return {
          status: 'INCOMPATIBLE',
          allowed: false,
          code: 'GPU_TOO_LONG_FOR_CASE',
          title: 'Placa de Vídeo Muito Longa para o Gabinete',
          message: `Instalação recusada: a placa ${gpu.name} mede ${gpu.lengthMm} mm de comprimento, mas o gabinete compacto ${pcCase.name} comporta placas de no máximo ${pcCase.maxGpuLengthMm} mm!`,
          educationalDetails: 'Placas de vídeo com 3 ventoinhas (triple-fan) frequentemente ultrapassam 300 mm e colidem com a estrutura frontal de gabinetes compactos.',
        };
      }
    }

    return {
      status: 'COMPATIBLE',
      allowed: true,
      code: 'GPU_OK',
      title: 'Placa de Vídeo Instalada no Slot PCIe x16',
      message: `${gpu.name} (${gpu.vramGb} GB ${gpu.vramType}) encaixada no slot PCIe x16.`,
      educationalDetails:
        gpu.requiredPowerConnector !== 'NONE'
          ? `Atenção: esta placa possui TDP de ${gpu.tdpWatts}W e EXIGE a conexão do cabo de alimentação PCIe (${gpu.requiredPowerConnector}) vindo da fonte!`
          : 'Alimentada integralmente pelo slot PCIe x16 (dispensa cabo extra da fonte).',
    };
  }

  // 10. PSU INSTALLATION
  if (targetSlot === 'slot_psu') {
    if (item.category !== 'psu') {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'WRONG_SLOT_CATEGORY',
        title: 'Compartimento Exclusivo para Fonte de Alimentação',
        message: `Este compartimento aceita apenas Fontes de Alimentação (PSU), não "${item.name}".`,
        educationalDetails: 'Selecione uma fonte ATX na categoria Fontes.',
      };
    }

    const candidatePsu = item as PsuSpec;

    if (pcCase && candidatePsu.lengthMm > pcCase.maxPsuLengthMm) {
      return {
        status: 'INCOMPATIBLE',
        allowed: false,
        code: 'PSU_TOO_LONG_FOR_CASE',
        title: 'Fonte Muito Longa para o Gabinete',
        message: `Instalação recusada: a fonte ${candidatePsu.name} possui ${candidatePsu.lengthMm} mm de comprimento, excedendo o limite de ${pcCase.maxPsuLengthMm} mm do gabinete ${pcCase.name}.`,
        educationalDetails: 'Gabinetes compactos têm espaço restrito para a fonte e para a passagem dos cabos.',
      };
    }

    if (candidatePsu.wattage === null || candidatePsu.incompleteSpecsWarning) {
      return {
        status: 'INSUFFICIENT_DATA',
        allowed: true,
        code: 'PSU_INSUFFICIENT_ELECTRICAL_DATA',
        title: 'Fonte Instalada — Informações Elétricas Insuficientes',
        message: `${candidatePsu.name} foi posicionada, mas NÃO possui dados técnicos verificados de potência contínua (Watts) e corrente na linha +12V!`,
        educationalDetails: 'O sistema de diagnóstico classificará a configuração elétrica como "Informações Insuficientes" pois nunca se deve declarar segura uma fonte sem especificações comprovadas.',
      };
    }

    const gpu = state.gpuId ? (getHardwareById(state.gpuId) as GpuSpec | undefined) : undefined;
    if (gpu) {
      if (gpu.requiredPowerConnector === '1x8-pin' && candidatePsu.pcie8PinCount < 1) {
        return {
          status: 'INCOMPATIBLE',
          allowed: false,
          code: 'PSU_LACKS_GPU_CONNECTOR',
          title: 'Fonte Sem Conectores para a Placa de Vídeo Instalada',
          message: `Instalação recusada: a placa de vídeo instalada (${gpu.name}) exige conector PCIe de 8 pinos, mas a fonte ${candidatePsu.name} não possui conectores PCIe!`,
          educationalDetails: 'A fonte precisa fornecer tanto a potência total em Watts quanto os conectores físicos exigidos pela placa de vídeo.',
        };
      }
      if (candidatePsu.wattage < gpu.recommendedPsuWatts) {
        return {
          status: ' INCOMPATIBLE'.trim() as 'INCOMPATIBLE',
          allowed: false,
          code: 'PSU_WATTAGE_TOO_LOW',
          title: 'Potência da Fonte Insuficiente para a Configuração',
          message: `Instalação recusada: a fonte ${candidatePsu.name} fornece apenas ${candidatePsu.wattage}W, mas a placa de vídeo ${gpu.name} requer uma fonte de pelo menos ${gpu.recommendedPsuWatts}W!`,
          educationalDetails: 'Operar uma fonte abaixo da potência exigida pela CPU e GPU aciona o circuito de proteção contra sobrecarga (OPP) ou causa desligamentos sob carga.',
        };
      }
    }

    return {
      status: 'COMPATIBLE',
      allowed: true,
      code: 'PSU_OK',
      title: 'Fonte de Alimentação Instalada',
      message: `${candidatePsu.name} (${candidatePsu.wattage}W · ${candidatePsu.efficiencyRating}) fixada no compartimento.`,
      educationalDetails: 'Lembre-se de conectar os cabos ATX 24 pinos, EPS 12V da CPU e cabos PCIe/SATA necessários.',
    };
  }

  return {
    status: 'INCOMPATIBLE',
    allowed: false,
    code: 'UNSUPPORTED_SLOT_COMBINATION',
    title: 'Encaixe Inválido',
    message: `Não é possível instalar "${item.name}" em "${targetSlot}".`,
    educationalDetails: 'Verifique a categoria do componente e os pontos de encaixe compatíveis na bancada.',
  };
}

export function validateRemoval(
  state: InstalledHardwareState,
  targetSlot: SnapSlotId
): CompatibilityValidationResult {
  if (targetSlot === 'slot_cpu') {
    if (state.coolerId) {
      return {
        status: 'DEPENDENCY_MISSING',
        allowed: false,
        code: 'CANNOT_REMOVE_CPU_WITH_COOLER',
        title: 'Procedimento Bloqueado: Remova o Cooler Primeiro!',
        message: 'Não é possível remover o processador enquanto o cooler estiver instalado sobre ele.',
        educationalDetails: 'Na desmontagem técnica correta, desconecta-se e desparafusa-se primeiro o sistema de refrigeração antes de abrir a alavanca do socket da CPU.',
      };
    }
  }

  if (targetSlot === 'slot_motherboard') {
    const hasAttachedParts =
      Boolean(state.cpuId) ||
      Boolean(state.coolerId) ||
      Boolean(state.gpuId) ||
      Boolean(state.pcieAddonId) ||
      Object.values(state.ramSlots).some(Boolean) ||
      Object.values(state.m2Slots).some(Boolean) ||
      state.cables.atx24Pin ||
      state.cables.cpuEps ||
      state.cables.frontPanel ||
      state.cables.sataData;

    if (hasAttachedParts) {
      return {
        status: 'DEPENDENCY_MISSING',
        allowed: false,
        code: 'CANNOT_REMOVE_MB_WITH_ATTACHED_PARTS',
        title: 'Desmontagem Bloqueada por Dependências',
        message: 'Desconecte todos os cabos e remova a placa de vídeo, cooler, CPU e memórias antes de retirar a placa-mãe do gabinete.',
        educationalDetails: 'Tentar retirar a placa-mãe ainda conectada a cabos da fonte ou placas de expansão danifica os slots e conectores.',
      };
    }
  }

  if (targetSlot === 'slot_standoffs') {
    if (state.motherboardId) {
      return {
        status: 'DEPENDENCY_MISSING',
        allowed: false,
        code: 'CANNOT_REMOVE_STANDOFFS_WITH_MB',
        title: 'Placa-Mãe Fixada nos Espaçadores',
        message: 'Remova a placa-mãe antes de desrosquear os espaçadores metálicos (standoffs) do gabinete.',
        educationalDetails: 'Os espaçadores ficam sob a placa-mãe.',
      };
    }
  }

  if (targetSlot === 'slot_psu') {
    if (state.cables.atx24Pin || state.cables.cpuEps || state.cables.pciePower) {
      return {
        status: 'DEPENDENCY_MISSING',
        allowed: false,
        code: 'CANNOT_REMOVE_PSU_WITH_CABLES',
        title: 'Desconecte os Cabos de Energia Primeiro!',
        message: 'Desconecte os cabos de alimentação (24 pinos, CPU EPS e PCIe) antes de remover a fonte do gabinete.',
        educationalDetails: 'Nunca puxe a fonte de alimentação enquanto seus cabos ainda estiverem travados na placa-mãe ou na placa de vídeo.',
      };
    }
  }

  return {
    status: 'COMPATIBLE',
    allowed: true,
    code: 'REMOVAL_OK',
    title: 'Componente Removido',
    message: 'Peça desconectada e retirada da bancada seguindo o procedimento técnico.',
    educationalDetails: 'O slot agora está livre.',
  };
}

export function simulatePostBoot(state: InstalledHardwareState): PostBootSimulationResult {
  const stages: PostStageResult[] = [];
  const detectedErrors: CompatibilityValidationResult[] = [];

  const mb = state.motherboardId ? (getHardwareById(state.motherboardId) as MotherboardSpec | undefined) : undefined;
  const cpu = state.cpuId ? (getHardwareById(state.cpuId) as CpuSpec | undefined) : undefined;
  const psu = state.psuId ? (getHardwareById(state.psuId) as PsuSpec | undefined) : undefined;
  const cooler = state.coolerId ? (getHardwareById(state.coolerId) as CoolerSpec | undefined) : undefined;
  const gpu = state.gpuId ? (getHardwareById(state.gpuId) as GpuSpec | undefined) : undefined;
  const installedRams = Object.values(state.ramSlots)
    .filter((id): id is string => Boolean(id))
    .map((id) => getHardwareById(id) as RamSpec)
    .filter(Boolean);
  const installedM2s = Object.values(state.m2Slots)
    .filter((id): id is string => Boolean(id))
    .map((id) => getHardwareById(id) as StorageSpec)
    .filter(Boolean);
  const installedSataDrives = Object.values(state.driveBays)
    .filter((id): id is string => Boolean(id))
    .map((id) => getHardwareById(id) as StorageSpec)
    .filter(Boolean);

  // Stage 1: Power & Front Panel Check
  if (!mb) {
    stages.push({
      stageOrder: 1,
      stageCode: '00',
      stageName: '1. Verificação da Placa-Mãe e Alimentação',
      status: 'FAIL',
      detail: 'Nenhuma placa-mãe instalada na bancada.',
    });
    detectedErrors.push({
      status: 'DEPENDENCY_MISSING',
      allowed: false,
      code: 'POST_NO_MB',
      title: 'Ausência de Placa-Mãe',
      message: 'O computador não pode ligar sem uma placa-mãe instalada.',
      educationalDetails: 'Instale uma placa-mãe compatível para iniciar a montagem.',
    });
    return {
      canPowerOn: false,
      postSuccess: false,
      bootToOsSuccess: false,
      beepCode: 'Sem sinal sonoro (Energia inativa)',
      postHexCode: '0x00',
      summaryTitle: 'Sistema Inativo — Sem Placa-Mãe',
      summaryMessage: 'Instale a placa-mãe e os componentes essenciais antes de acionar o botão Power.',
      stages,
      detectedErrors,
    };
  }

  if (!psu || !state.cables.atx24Pin || !state.cables.frontPanel) {
    const missingReason = !psu
      ? 'Fonte de alimentação (PSU) não instalada.'
      : !state.cables.atx24Pin
      ? 'Cabo principal ATX de 24 pinos desconectado da placa-mãe.'
      : 'Cabo do Painel Frontal (PWR_SW / F_PANEL) desconectado: o botão de ligar não envia o sinal de partida para a placa-mãe!';

    stages.push({
      stageOrder: 1,
      stageCode: '00',
      stageName: '1. Verificação Conceitual da Alimentação e Partida (PS_ON#)',
      status: 'FAIL',
      detail: missingReason,
    });
    detectedErrors.push({
      status: 'DEPENDENCY_MISSING',
      allowed: false,
      code: 'POST_NO_POWER_SIGNAL',
      title: 'O Computador Não Liga (Sem Sinais de Energia)',
      message: missingReason,
      educationalDetails: 'Para que a fonte ligue ao pressionar o botão do gabinete, o header F_PANEL (PWR_SW) deve fechar o contato na placa-mãe e o cabo ATX 24 pinos deve aterrar o pino PS_ON# da fonte.',
    });
    return {
      canPowerOn: false,
      postSuccess: false,
      bootToOsSuccess: false,
      beepCode: 'Silêncio absoluto (Ventoinhas paradas)',
      postHexCode: '0x00',
      summaryTitle: 'Falha de Partida — Computador Não Liga',
      summaryMessage: missingReason,
      stages,
      detectedErrors,
    };
  }

  if (psu.wattage === null) {
    stages.push({
      stageOrder: 1,
      stageCode: 'PWR_WARN',
      stageName: '1. Verificação Conceitual da Alimentação',
      status: 'WARN',
      detail: 'Fonte OEM sem etiqueta de potência verificada: impossível confirmar margem de segurança elétrica na linha +12V.',
    });
    detectedErrors.push({
      status: 'INSUFFICIENT_DATA',
      allowed: true,
      code: 'POST_PSU_UNKNOWN_WATTAGE',
      title: 'Informações Insuficientes na Fonte de Alimentação',
      message: 'A fonte instalada não possui especificação documentada de potência contínua.',
      educationalDetails: 'Nunca declare uma configuração elétrica como segura sem dados reais da fonte.',
    });
  } else {
    stages.push({
      stageOrder: 1,
      stageCode: '01',
      stageName: '1. Verificação da Alimentação Principal (+12V, +5V, +3.3V, PWR_OK)',
      status: 'PASS',
      detail: `Fonte ${psu.name} (${psu.wattage}W) acionada via PS_ON#. Sinal Power Good estabilizado.`,
    });
  }

  // Stage 2: Motherboard & CMOS / Standoffs Check
  if (state.caseId && !state.standoffsInstalled) {
    stages.push({
      stageOrder: 2,
      stageCode: 'SHORT',
      stageName: '2. Inicialização da Placa-Mãe e Isolamento do Chassi',
      status: 'FAIL',
      detail: 'Curto-circuito detectado! A placa-mãe foi instalada no gabinete sem os espaçadores metálicos (standoffs).',
    });
    detectedErrors.push({
      status: 'INCOMPATIBLE',
      allowed: false,
      code: 'POST_SHORT_CIRCUIT_NO_STANDOFFS',
      title: 'Proteção Contra Curto-Circuito Acionada (SCP)',
      message: 'A fonte desligou imediatamente (SCP) pois o verso da placa-mãe está em contato direto com a chapa do gabinete sem espaçadores.',
      educationalDetails: 'Os espaçadores de latão são obrigatórios para isolar as soldas traseiras da placa-mãe.',
    });
    return {
      canPowerOn: false,
      postSuccess: false,
      bootToOsSuccess: false,
      beepCode: 'Desarme imediato da fonte (Clique do relé SCP)',
      postHexCode: '0xFE',
      summaryTitle: 'Desarme por Curto-Circuito — Faltam Espaçadores',
      summaryMessage: 'A proteção da fonte desarmou o sistema para evitar danos à placa-mãe.',
      stages,
      detectedErrors,
    };
  }

  stages.push({
    stageOrder: 2,
    stageCode: '10',
    stageName: '2. Inicialização do Chipset e Relógio CMOS/RTC',
    status: state.cmosBatteryInstalled ? 'PASS' : 'WARN',
    detail: state.cmosBatteryInstalled
      ? `Chipset ${mb.chipset} energizado e parâmetros CMOS preservados pela bateria CR2032.`
      : 'Atenção: Bateria CMOS CR2032 ausente! Configurações de data/hora e BIOS serão resetadas a cada desligamento (CMOS Checksum Warning).',
  });

  // Stage 3: CPU, EPS 12V Power, BIOS Microcode & Thermal Check
  if (!cpu) {
    stages.push({
      stageOrder: 3,
      stageCode: '00_CPU',
      stageName: '3. Verificação da CPU, Alimentação EPS 12V e Refrigeração',
      status: 'FAIL',
      detail: `Socket ${mb.socket} está vazio! Nenhum processador detectado.`,
    });
    detectedErrors.push({
      status: 'DEPENDENCY_MISSING',
      allowed: false,
      code: 'POST_NO_CPU',
      title: 'Ausência de Processador (LED Debug CPU Aceso)',
      message: 'Não há processador instalado no socket da placa-mãe.',
      educationalDetails: 'O processador é o componente responsável por executar o próprio código do firmware BIOS/UEFI durante o POST.',
    });
    return {
      canPowerOn: true,
      postSuccess: false,
      bootToOsSuccess: false,
      beepCode: 'Sem bipes (CPU inoperante — LED CPU vermelho)',
      postHexCode: '0x00',
      summaryTitle: 'Falha no POST — Processador Ausente',
      summaryMessage: 'As ventoinhas giram, mas o LED CPU da placa-mãe permanece aceso.',
      stages,
      detectedErrors,
    };
  }

  if (!state.cables.cpuEps) {
    stages.push({
      stageOrder: 3,
      stageCode: 'CPU_PWR',
      stageName: '3. Verificação da CPU e Alimentação VRM (EPS 12V)',
      status: 'FAIL',
      detail: `O cabo de alimentação da CPU (${mb.cpuPowerConnector} EPS 12V) está desconectado! O VRM do processador não recebe energia.`,
    });
    detectedErrors.push({
      status: 'DEPENDENCY_MISSING',
      allowed: false,
      code: 'POST_MISSING_CPU_EPS_CABLE',
      title: 'Cabo de Alimentação da CPU (EPS 12V) Desconectado',
      message: 'As ventoinhas do gabinete giram, mas o processador não recebe alimentação +12V porque o cabo EPS superior está desconectado!',
      educationalDetails: 'Erro clássico de montagem: conectar apenas o cabo de 24 pinos e esquecer o conector de 4 ou 8 pinos da CPU.',
      remediation: 'Conecte o "Cabo de Alimentação da CPU EPS 12V (4+4 Pinos)" na placa-mãe.',
    });
    return {
      canPowerOn: true,
      postSuccess: false,
      bootToOsSuccess: false,
      beepCode: 'Sem bipes (VRM da CPU sem tensão +12V — LED CPU aceso)',
      postHexCode: '0x00',
      summaryTitle: 'Falha no POST — Cabo EPS 12V da CPU Desconectado',
      summaryMessage: 'O computador liga os LEDs e ventoinhas, mas não inicia o POST por falta de energia no processador.',
      stages,
      detectedErrors,
    };
  }

  const requiredBios = cpu.minBiosVersionByChipset?.[mb.chipset];
  if (requiredBios && !state.motherboardBiosUpdated && mb.shippedBiosVersion < requiredBios) {
    stages.push({
      stageOrder: 3,
      stageCode: 'BIOS_MICROCODE',
      stageName: '3. Verificação de Microcódigo da CPU na BIOS',
      status: 'FAIL',
      detail: `BIOS atual (${mb.shippedBiosVersion}) não reconhece o processador ${cpu.name}. Versão mínima exigida: ${requiredBios}.`,
    });
    detectedErrors.push({
      status: 'BIOS_UPDATE_REQUIRED',
      allowed: false,
      code: 'POST_BIOS_OUTDATED_FOR_CPU',
      title: 'BIOS Desatualizada para Este Processador',
      message: `A placa-mãe ${mb.name} está com a versão de BIOS ${mb.shippedBiosVersion}, anterior ao lançamento do ${cpu.name} (requer BIOS ${requiredBios}+).`,
      educationalDetails: 'Quando uma placa-mãe suporta uma nova geração de CPUs do mesmo socket, é necessário atualizar a memória Flash da BIOS para incluir o microcódigo AGESA/Intel ME do novo processador.',
      remediation: 'Clique em "Atualizar BIOS (USB Flashback)" na barra superior para gravar a versão mais recente.',
    });
    return {
      canPowerOn: true,
      postSuccess: false,
      bootToOsSuccess: false,
      beepCode: 'Sem bipes (Microcódigo CPU não reconhecido — LED CPU aceso)',
      postHexCode: '0x0D',
      summaryTitle: 'Falha no POST — Atualização de BIOS Necessária',
      summaryMessage: `Atualize a BIOS da ${mb.name} de ${mb.shippedBiosVersion} para ${mb.latestBiosVersion} para iniciar com o ${cpu.name}.`,
      stages,
      detectedErrors,
    };
  }

  if (!cooler || !state.thermalPasteApplied) {
    const reason = !cooler
      ? 'Nenhum cooler instalado sobre o processador! Desligamento térmico de emergência (PROCHOT# > 105°C) acionado em 4 segundos.'
      : 'Pasta térmica não aplicada entre a CPU e o cooler! Contato térmico insuficiente causando superaquecimento severo.';
    stages.push({
      stageOrder: 3,
      stageCode: 'THERM_TRIP',
      stageName: '3. Verificação Térmica da CPU e Cooler',
      status: 'FAIL',
      detail: reason,
    });
    detectedErrors.push({
      status: 'DEPENDENCY_MISSING',
      allowed: false,
      code: 'POST_THERMAL_SHUTDOWN',
      title: 'Desligamento por Proteção Térmica (CPU Over Temperature Error)',
      message: reason,
      educationalDetails: 'Sensores térmicos internos (DTS) nos núcleos da CPU cortam a energia automaticamente ao atingir a temperatura crítica (TjMax ~100–105°C) para evitar a fusão do silício.',
      remediation: 'Aplique pasta térmica e instale um cooler compatível sobre o processador.',
    });
    return {
      canPowerOn: true,
      postSuccess: false,
      bootToOsSuccess: false,
      beepCode: state.beepSpeakerInstalled ? 'Bipes alternados de sirene (Alerta de Temperatura Crítica)' : 'Sem speaker instalado (Desligamento térmico)',
      postHexCode: '0xC1',
      summaryTitle: 'Proteção Térmica Acionada — CPU Sem Refrigeração Adequada',
      summaryMessage: reason,
      stages,
      detectedErrors,
    };
  }

  stages.push({
    stageOrder: 3,
    stageCode: '32',
    stageName: '3. Inicialização da CPU, Microcódigo e Controle Térmico PWM',
    status: 'PASS',
    detail: `${cpu.name} (${cpu.cores}C/${cpu.threads}T @ ${cpu.baseClockGhz} GHz) inicializado a 36°C com ${cooler.name}.`,
  });

  // Stage 4: RAM Verification
  if (installedRams.length === 0) {
    stages.push({
      stageOrder: 4,
      stageCode: '53',
      stageName: '4. Treinamento e Verificação de Memória RAM (DRAM)',
      status: 'FAIL',
      detail: 'Nenhum módulo de memória RAM instalado nos slots DIMM!',
    });
    detectedErrors.push({
      status: 'DEPENDENCY_MISSING',
      allowed: false,
      code: 'POST_NO_RAM',
      title: 'Ausência de Memória RAM (Código POST 0x53 / 3 Bipes Longos)',
      message: 'O computador não pode inicializar sem pelo menos um módulo de memória RAM instalado.',
      educationalDetails: 'Durante o POST, a CPU precisa copiar e descomprimir o código principal do UEFI/BIOS da memória Flash para a memória RAM principal.',
    });
    return {
      canPowerOn: true,
      postSuccess: false,
      bootToOsSuccess: false,
      beepCode: state.beepSpeakerInstalled ? '1 bipe longo e 2 curtos / 3 bipes longos (Erro de Memória DRAM)' : 'Sem speaker (LED DRAM aceso na placa-mãe)',
      postHexCode: '0x53',
      summaryTitle: 'Falha no POST — Sem Memória RAM',
      summaryMessage: 'Instale pelo menos um módulo de memória RAM compatível nos slots DIMM.',
      stages,
      detectedErrors,
    };
  }

  const defectiveRam = installedRams.find((r) => r.isSimulatedDefective);
  if (defectiveRam) {
    stages.push({
      stageOrder: 4,
      stageCode: '55',
      stageName: '4. Treinamento e Teste de Endereçamento DRAM',
      status: 'FAIL',
      detail: `Falha de verificação de paridade/endereçamento detectada no módulo "${defectiveRam.name}"!`,
    });
    detectedErrors.push({
      status: 'INCOMPATIBLE',
      allowed: false,
      code: 'POST_DEFECTIVE_RAM',
      title: 'Módulo de Memória RAM Defeituoso Detectado no POST',
      message: `O teste de memória do POST encontrou células defeituosas no módulo "${defectiveRam.name}". O sistema interrompeu a inicialização.`,
      educationalDetails: 'Quando um pente de memória apresenta falha elétrica nas células DRAM, o treinamento de memória falha no código 0x55.',
      remediation: 'Remova o módulo de memória com falha simulada e instale um módulo DDR4 íntegro.',
    });
    return {
      canPowerOn: true,
      postSuccess: false,
      bootToOsSuccess: false,
      beepCode: state.beepSpeakerInstalled ? 'Bipes curtos contínuos (Falha de Memória RAM)' : 'Sem speaker (LED DRAM aceso)',
      postHexCode: '0x55',
      summaryTitle: 'Falha no POST — Módulo de RAM com Defeito',
      summaryMessage: `Substitua o módulo defeituoso (${defectiveRam.name}) por uma memória funcional.`,
      stages,
      detectedErrors,
    };
  }

  const totalRamGb = installedRams.reduce((sum, r) => sum + r.capacityGb, 0);
  stages.push({
    stageOrder: 4,
    stageCode: '60',
    stageName: '4. Verificação de Memória Principal (DRAM)',
    status: 'PASS',
    detail: `${totalRamGb} GB ${mb.ramGeneration} detectados (${installedRams.length} módulo(s) ativo(s) em modo ${installedRams.length >= 2 ? 'Dual-Channel' : 'Single-Channel'}).`,
  });

  // Stage 5: Video / VGA Output Check
  if (!gpu && !cpu.hasIntegratedGraphics) {
    stages.push({
      stageOrder: 5,
      stageCode: '97_VGA',
      stageName: '5. Inicialização do Subsistema de Vídeo (VGA / GOP)',
      status: 'FAIL',
      detail: `O processador ${cpu.name} NÃO possui gráficos integrados e nenhuma placa de vídeo dedicada foi instalada!`,
    });
    detectedErrors.push({
      status: 'DEPENDENCY_MISSING',
      allowed: false,
      code: 'POST_NO_VIDEO_SOLUTION',
      title: 'Sem Solução de Vídeo Disponível (LED VGA Aceso)',
      message: `O processador ${cpu.name} não possui vídeo integrado (iGPU) e não há placa de vídeo dedicada instalada no slot PCIe x16.`,
      educationalDetails: 'Processadores Intel com sufixo "F" (ex: i5-12400F, i3-10100F) e a maioria dos AMD Ryzen série 3000/5000 sem sufixo "G" (ex: Ryzen 5 5600X) exigem obrigatoriamente uma placa de vídeo dedicada para gerar imagem.',
      remediation: 'Instale uma placa de vídeo dedicada no slot PCI Express x16 ou utilize um processador com gráficos integrados.',
    });
    return {
      canPowerOn: true,
      postSuccess: false,
      bootToOsSuccess: false,
      beepCode: state.beepSpeakerInstalled ? '1 bipe longo e 3 bipes curtos (Ausência de Placa de Vídeo / VGA)' : 'Sem speaker (LED VGA aceso)',
      postHexCode: '0x97',
      summaryTitle: 'Falha no POST — Sem Saída de Vídeo (iGPU/GPU Ausente)',
      summaryMessage: `Instale uma placa de vídeo dedicada para utilizar o ${cpu.name}.`,
      stages,
      detectedErrors,
    };
  }

  if (gpu && gpu.requiredPowerConnector !== 'NONE' && !state.cables.pciePower) {
    stages.push({
      stageOrder: 5,
      stageCode: 'B2_GPU_PWR',
      stageName: '5. Inicialização do Subsistema de Vídeo (PCIe VGA)',
      status: 'FAIL',
      detail: `A placa de vídeo ${gpu.name} (${gpu.tdpWatts}W) está sem o cabo de alimentação suplementar (${gpu.requiredPowerConnector}) conectado!`,
    });
    detectedErrors.push({
      status: 'DEPENDENCY_MISSING',
      allowed: false,
      code: 'POST_MISSING_GPU_POWER_CABLE',
      title: 'Placa de Vídeo Sem Alimentação Auxiliar PCIe',
      message: `A ${gpu.name} detectou ausência de energia no conector ${gpu.requiredPowerConnector} e bloqueou a inicialização com a mensagem: "PLEASE POWER DOWN AND CONNECT THE PCIe POWER CABLE(S) FOR THIS GRAPHICS CARD".`,
      educationalDetails: 'O slot PCIe fornece apenas até 75W. Placas com consumo superior exigem o cabo PCIe da fonte conectado.',
      remediation: 'Conecte o "Cabo de Alimentação da Placa de Vídeo (PCIe 8-Pin / 12V-2x6)".',
    });
    return {
      canPowerOn: true,
      postSuccess: false,
      bootToOsSuccess: false,
      beepCode: state.beepSpeakerInstalled ? '1 bipe longo e 3 bipes curtos (Falha de Energia na GPU)' : 'Sem speaker (LED VGA aceso)',
      postHexCode: '0xB2',
      summaryTitle: 'Falha no POST — Cabo de Energia da GPU Desconectado',
      summaryMessage: `Conecte o cabo de energia PCIe na ${gpu.name}.`,
      stages,
      detectedErrors,
    };
  }

  stages.push({
    stageOrder: 5,
    stageCode: '99',
    stageName: '5. Inicialização de Vídeo (GOP / VGA) e Diagnóstico POST',
    status: 'PASS',
    detail: gpu
      ? `Sinal de vídeo ativo via GPU dedicada: ${gpu.name} (${gpu.vramGb} GB ${gpu.vramType}).`
      : `Sinal de vídeo ativo via gráficos integrados: ${cpu.integratedGraphicsName}.`,
  });

  // Stage 6: UEFI / BIOS Firmware Handoff
  stages.push({
    stageOrder: 6,
    stageCode: 'A0',
    stageName: '6. Acesso ao Firmware UEFI/BIOS e Barramentos',
    status: 'PASS',
    detail: `POST concluído com sucesso! Firmware UEFI (${mb.manufacturer} v${state.motherboardBiosUpdated ? mb.latestBiosVersion : mb.shippedBiosVersion}) pronto.`,
  });

  // Stage 7 & 8: Storage Enumeration & OS Boot
  const connectedSataDrives = state.cables.sataData ? installedSataDrives : [];
  const allActiveBootDrives = [...installedM2s, ...connectedSataDrives];

  if (installedSataDrives.length > 0 && !state.cables.sataData && installedM2s.length === 0) {
    stages.push({
      stageOrder: 7,
      stageCode: 'A2',
      stageName: '7. Identificação de Dispositivos de Armazenamento (AHCI / NVMe)',
      status: 'FAIL',
      detail: `Unidade SATA (${installedSataDrives[0].name}) está instalada na baia, mas o Cabo de Dados/Energia SATA não foi conectado!`,
    });
    stages.push({
      stageOrder: 8,
      stageCode: 'AE',
      stageName: '8. Tentativa de Inicialização do Sistema Operacional',
      status: 'FAIL',
      detail: 'NO BOOTABLE DEVICE FOUND — Conecte o cabo SATA à unidade instalada.',
    });
    detectedErrors.push({
      status: 'DEPENDENCY_MISSING',
      allowed: false,
      code: 'BOOT_UNCONNECTED_SATA_CABLE',
      title: 'POST OK, Mas Armazenamento SATA Desconectado',
      message: `O computador ligou e deu vídeo na tela da BIOS, mas o disco ${installedSataDrives[0].name} não foi detectado porque falta conectar o cabo SATA!`,
      educationalDetails: 'Diferente dos SSDs M.2 que encaixam direto na placa-mãe, discos SATA de 2,5" e 3,5" precisam do cabo de dados SATA e do cabo de energia SATA da fonte.',
      remediation: 'Conecte o "Kit Cabo de Dados SATA III + Alimentação SATA".',
    });
    return {
      canPowerOn: true,
      postSuccess: true,
      bootToOsSuccess: false,
      beepCode: state.beepSpeakerInstalled ? '1 bipe curto (POST OK — Sem disco de boot)' : 'Silencioso (POST OK)',
      postHexCode: '0xAE',
      summaryTitle: 'POST Concluído — Disco SATA Desconectado (Sem Boot)',
      summaryMessage: 'O computador entrou na tela da BIOS/UEFI, mas não encontrou dispositivo de armazenamento conectado para carregar o sistema operacional.',
      stages,
      detectedErrors,
    };
  }

  if (allActiveBootDrives.length === 0) {
    stages.push({
      stageOrder: 7,
      stageCode: 'A2',
      stageName: '7. Identificação de Dispositivos de Armazenamento (AHCI / NVMe)',
      status: 'WARN',
      detail: 'Nenhuma unidade de armazenamento (HDD ou SSD) instalada.',
    });
    stages.push({
      stageOrder: 8,
      stageCode: 'AE',
      stageName: '8. Tentativa de Inicialização do Sistema Operacional',
      status: 'FAIL',
      detail: 'Reboot and Select proper Boot device or Insert Boot Media in selected Boot device.',
    });
    detectedErrors.push({
      status: 'DEPENDENCY_MISSING',
      allowed: false,
      code: 'BOOT_NO_STORAGE',
      title: 'POST Concluído, Mas Sem Dispositivo de Armazenamento',
      message: 'O hardware básico (CPU, RAM e Vídeo) passou no POST e abriu o UEFI/BIOS, porém não há HDD ou SSD instalado para inicializar o sistema operacional.',
      educationalDetails: 'A memória RAM é volátil e está vazia ao ligar o PC; o sistema operacional precisa ser carregado a partir de um armazenamento permanente (SSD ou HDD).',
      remediation: 'Instale um SSD M.2 NVMe ou um HDD/SSD SATA com seu respectivo cabo SATA.',
    });
    return {
      canPowerOn: true,
      postSuccess: true,
      bootToOsSuccess: false,
      beepCode: state.beepSpeakerInstalled ? '1 bipe curto (POST OK — Aguardando Mídia de Boot)' : 'Silencioso (POST OK)',
      postHexCode: '0xAE',
      summaryTitle: 'POST Bem-Sucedido (UEFI Ativo) — Sem Unidade de Boot',
      summaryMessage: 'A montagem básica deu vídeo no BIOS/UEFI! Instale e conecte um SSD ou HDD para carregar o Sistema Operacional.',
      stages,
      detectedErrors,
    };
  }

  const primaryDrive = allActiveBootDrives[0];
  stages.push({
    stageOrder: 7,
    stageCode: 'A2',
    stageName: '7. Identificação de Dispositivos de Armazenamento (AHCI / NVMe)',
    status: 'PASS',
    detail: `Unidade detectada: ${primaryDrive.name} (${primaryDrive.capacityGb} GB · ${primaryDrive.protocol} · ${primaryDrive.readSpeedMBs} MB/s).`,
  });

  stages.push({
    stageOrder: 8,
    stageCode: 'AA',
    stageName: '8. Carregamento do Bootloader EFI e Sistema Operacional (Simulação Didática)',
    status: 'PASS',
    detail: `Partição EFI lida com sucesso de ${primaryDrive.name}. Kernel e ambiente gráfico educacional inicializados na RAM (${totalRamGb} GB).`,
  });

  return {
    canPowerOn: true,
    postSuccess: true,
    bootToOsSuccess: true,
    beepCode: state.beepSpeakerInstalled ? '1 bipe curto (POST e Boot 100% Operacionais!)' : 'Silencioso (Sem speaker — Boot 100% Operacional)',
    postHexCode: '0xAA (Sistema Ativo)',
    summaryTitle: 'Computador Virtual Inicializado com Sucesso!',
    summaryMessage: `Todas as verificações de alimentação, CPU (${cpu.name}), memória (${totalRamGb} GB ${mb.ramGeneration}), vídeo e armazenamento (${primaryDrive.name}) foram aprovadas.`,
    stages,
    detectedErrors,
  };
}
