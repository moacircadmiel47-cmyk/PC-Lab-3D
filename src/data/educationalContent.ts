import {
  GuidedStep,
  DiagnosticScenario,
  InstalledHardwareState,
  PostBootSimulationResult,
  ComponentCategory,
} from '../types/hardware';

export const GUIDED_STEPS: GuidedStep[] = [
  {
    stepNumber: 1,
    id: 'step-1-safety',
    title: '1. Precauções de Segurança e Eletricidade Estática (ESD)',
    instruction: 'Antes de tocar nos componentes, confirme o uso da pulseira antiestática (ou descarga de estática no chassi metálico) e o desligamento da rede elétrica.',
    pedagogicalWhy: 'O corpo humano pode acumular milhares de volts de eletricidade estática (ESD). Uma descarga invisível nos pinos de um processador ou memória RAM pode danificar trilhas microscópicas de silício.',
    targetSlot: 'SAFETY_CHECK',
    hint1: 'Clique no botão "Confirmar Segurança ESD" no painel do Guia Passo a Passo.',
    hint2: 'Segure sempre placas-mãe, CPUs e memórias pelas bordas laterais isolantes.',
    isCompleted: (_state, safetyAcknowledged) => safetyAcknowledged,
  },
  {
    stepNumber: 2,
    id: 'step-2-case',
    title: '2. Preparar o Gabinete na Bancada',
    instruction: 'Certifique-se de que um gabinete compatível (ex: Corsair 4000D Airflow) esteja posicionado na bancada com a lateral aberta.',
    pedagogicalWhy: 'O gabinete define os formatos de placa-mãe suportados (ATX, Micro-ATX, Mini-ITX), o limite de altura do cooler e o espaço para a placa de vídeo.',
    targetSlot: 'slot_case',
    hint1: 'No catálogo lateral, abra a categoria "Gabinetes" e instale um gabinete.',
    hint2: 'O gabinete Corsair 4000D suporta todos os formatos de placa-mãe.',
    isCompleted: (state) => Boolean(state.caseId),
  },
  {
    stepNumber: 3,
    id: 'step-3-standoffs',
    title: '3. Instalar os Espaçadores Metálicos (Standoffs)',
    instruction: 'Instale o Kit de Espaçadores Metálicos (Standoffs M3) na bandeja do gabinete.',
    pedagogicalWhy: 'Nunca parafuse a placa-mãe diretamente na chapa do gabinete! Os espaçadores mantêm a solda traseira afastada do metal, impedindo um curto-circuito geral.',
    targetSlot: 'slot_standoffs',
    hint1: 'Vá até a categoria "Cabos e Acessórios" e selecione "Kit de Espaçadores Metálicos".',
    hint2: 'Arraste ou clique em Instalar sobre os furos da bandeja do gabinete.',
    isCompleted: (state) => state.standoffsInstalled,
  },
  {
    stepNumber: 4,
    id: 'step-4-motherboard',
    title: '4. Identificar e Fixar a Placa-Mãe',
    instruction: 'Instale uma placa-mãe compatível com o gabinete sobre os espaçadores (ex: ASUS TUF Gaming B550M-Plus AM4).',
    pedagogicalWhy: 'A placa-mãe concentra o socket da CPU, slots de RAM, chipset e barramentos PCIe/SATA/M.2 que interligam todo o computador.',
    targetSlot: 'slot_motherboard',
    hint1: 'Na categoria "Placas-Mãe", escolha uma placa e posicione na bandeja central.',
    hint2: 'Observe o socket e a geração DDR da placa escolhida para selecionar a CPU e a RAM corretas a seguir.',
    isCompleted: (state) => Boolean(state.motherboardId),
  },
  {
    stepNumber: 5,
    id: 'step-5-cpu',
    title: '5. Instalar o Processador (CPU) no Socket com Orientação Correta',
    instruction: 'Escolha um processador compatível com o socket da placa-mãe (ex: AMD Ryzen 5 5600X para AM4), alinhe o Pino 1 (0°) e encaixe no socket.',
    pedagogicalWhy: 'Cada socket possui encaixe Zero Insertion Force (ZIF) ou Land Grid Array (LGA). O processador deve entrar sem força mecânica, alinhado pelo triângulo dourado.',
    targetSlot: 'slot_cpu',
    hint1: 'Abra a categoria "Processadores" e filtre pelo mesmo socket da sua placa-mãe.',
    hint2: 'Se o processador estiver girado, pressione "R" ou o botão "Girar (0°)" antes de encaixar no socket.',
    isCompleted: (state) => Boolean(state.cpuId),
  },
  {
    stepNumber: 6,
    id: 'step-6-thermal-paste',
    title: '6. Aplicar Pasta Térmica sobre o Processador',
    instruction: 'Selecione a Pasta Térmica Arctic MX-4 em "Cabos e Acessórios" e aplique uma gota central sobre o difusor metálico (IHS) da CPU.',
    pedagogicalWhy: 'Existem microimperfeições invisíveis entre o metal da CPU e a base do cooler. A pasta térmica elimina o ar isolante e garante a condução eficiente do calor.',
    targetSlot: 'slot_thermal_paste',
    hint1: 'Abra "Cabos e Acessórios" -> "Pasta Térmica Arctic MX-4".',
    hint2: 'Encaixe sobre o topo do processador instalado.',
    isCompleted: (state) => state.thermalPasteApplied,
  },
  {
    stepNumber: 7,
    id: 'step-7-cooler',
    title: '7. Instalar o Cooler do Processador',
    instruction: 'Escolha um sistema de refrigeração compatível com o socket e o TDP da CPU (ex: DeepCool AK400 Tower) e instale sobre o processador.',
    pedagogicalWhy: 'Sem dissipador e ventoinha, um processador moderno atinge mais de 100°C em poucos segundos e desliga por proteção térmica.',
    targetSlot: 'slot_cooler',
    hint1: 'Vá em "Refrigeração" e escolha um cooler compatível com a altura do gabinete e o socket.',
    hint2: 'Arraste ou instale no ponto de encaixe sobre a CPU.',
    isCompleted: (state) => Boolean(state.coolerId),
  },
  {
    stepNumber: 8,
    id: 'step-8-ram',
    title: '8. Instalar Módulo(s) de Memória RAM',
    instruction: 'Selecione um módulo de memória RAM da mesma geração DDR da placa-mãe (ex: DDR4 para B550) e instale em um slot DIMM.',
    pedagogicalWhy: 'A memória RAM armazena temporariamente o sistema operacional e programas em execução. Cada geração (DDR a DDR5) possui entalhe físico próprio.',
    targetSlot: 'slot_ram_2',
    hint1: 'Abra "Memórias RAM" e verifique se a geração (DDR2, DDR3, DDR4 ou DDR5) corresponde à placa-mãe.',
    hint2: 'Alinhe o entalhe em 0° e encaixe no Slot DIMM_A2 (ou qualquer slot DIMM disponível).',
    isCompleted: (state) => Object.values(state.ramSlots).some(Boolean),
  },
  {
    stepNumber: 9,
    id: 'step-9-cmos',
    title: '9. Verificar a Bateria CMOS CR2032 e o Speaker de POST',
    instruction: 'Certifique-se de que a Bateria CMOS CR2032 e o Alto-Falante Interno (Beep Speaker) estejam instalados na placa-mãe.',
    pedagogicalWhy: 'A bateria CR2032 mantém o relógio e as configurações da BIOS quando o PC é desligado da tomada, e o Speaker emite os bipes sonoros de diagnóstico do POST.',
    targetSlot: 'slot_cmos_battery',
    hint1: 'Verifique na aba "Cabos e Acessórios" a Bateria CMOS CR2032 e o Alto-Falante Interno.',
    hint2: 'Instale ambos nos seus conectores na placa-mãe.',
    isCompleted: (state) => state.cmosBatteryInstalled && state.beepSpeakerInstalled,
  },
  {
    stepNumber: 10,
    id: 'step-10-psu',
    title: '10. Instalar a Fonte de Alimentação (PSU)',
    instruction: 'Instale uma fonte de alimentação adequada à configuração (ex: XPG Core Reactor 750W ou Corsair CV550) no compartimento da fonte.',
    pedagogicalWhy: 'A fonte converte a corrente alternada da tomada (110V/220V AC) em tensões contínuas estabilizadas (+12V, +5V, +3.3V DC) para todos os componentes.',
    targetSlot: 'slot_psu',
    hint1: 'Abra a categoria "Fontes (PSU)" e escolha uma fonte com potência e conectores suficientes.',
    hint2: 'Encaixe no compartimento traseiro/inferior da fonte.',
    isCompleted: (state) => Boolean(state.psuId),
  },
  {
    stepNumber: 11,
    id: 'step-11-storage',
    title: '11. Instalar Dispositivo de Armazenamento (HDD ou SSD)',
    instruction: 'Instale um SSD M.2 no slot M.2 da placa-mãe OU um HDD 3,5" / SSD 2,5" na baia de discos SATA.',
    pedagogicalWhy: 'Diferente da RAM (volátil), o armazenamento secundário (HDD magnético ou SSD Flash) preserva o sistema operacional e os arquivos permanentemente.',
    targetSlot: 'slot_m2_1',
    hint1: 'Na categoria "Armazenamento", escolha um SSD M.2 NVMe (para o slot M.2) ou o HDD Seagate 2TB (para a Baia SATA 1).',
    hint2: 'Atenção: não tente colocar um SSD M.2 SATA em um slot exclusivo NVMe!',
    isCompleted: (state) =>
      Object.values(state.m2Slots).some(Boolean) || Object.values(state.driveBays).some(Boolean),
  },
  {
    stepNumber: 12,
    id: 'step-12-gpu',
    title: '12. Instalar a Placa de Vídeo (GPU) no Slot PCI Express x16',
    instruction: 'Instale uma placa de vídeo dedicada no slot PCI Express x16 principal (obrigatória caso sua CPU não possua gráficos integrados).',
    pedagogicalWhy: 'Processadores sem vídeo integrado (como Ryzen 5600X ou Core i5-12400F) dependem de uma GPU dedicada para processar e enviar imagem ao monitor.',
    targetSlot: 'slot_gpu_pcie16',
    hint1: 'Abra "Placas de Vídeo (GPU)" e instale uma GTX 1650, RX 6600 ou RTX 4070 Super no slot PCIe x16.',
    hint2: 'Verifique se o comprimento da placa cabe no gabinete.',
    isCompleted: (state) => Boolean(state.gpuId),
  },
  {
    stepNumber: 13,
    id: 'step-13-cable-24pin',
    title: '13. Conectar a Alimentação Principal da Placa-Mãe (ATX 24 Pinos)',
    instruction: 'Em "Cabos e Acessórios", conecte o Cabo de Alimentação Principal ATX 24 Pinos na lateral direita da placa-mãe.',
    pedagogicalWhy: 'Fornece alimentação ao chipset, barramentos PCIe, memória RAM e circuito de partida (PS_ON#).',
    targetSlot: 'slot_cable_24pin',
    hint1: 'Selecione "Cabo de Alimentação Principal ATX 24 Pinos" em Cabos e Acessórios.',
    hint2: 'Encaixe no conector de 24 pinos da placa-mãe.',
    isCompleted: (state) => state.cables.atx24Pin,
  },
  {
    stepNumber: 14,
    id: 'step-14-cable-cpu-eps',
    title: '14. Conectar a Alimentação do Processador (EPS 12V 4+4 Pinos)',
    instruction: 'Conecte o Cabo de Alimentação da CPU EPS 12V no canto superior esquerdo da placa-mãe.',
    pedagogicalWhy: 'Alimenta exclusivamente os reguladores de tensão (VRM) do processador. Sem este cabo, as ventoinhas giram mas o PC não faz o POST!',
    targetSlot: 'slot_cable_cpu_eps',
    hint1: 'Selecione "Cabo de Alimentação da CPU EPS 12V" em Cabos e Acessórios.',
    hint2: 'Conecte na entrada EPS da placa-mãe.',
    isCompleted: (state) => state.cables.cpuEps,
  },
  {
    stepNumber: 15,
    id: 'step-15-cable-gpu-sata',
    title: '15. Conectar Cabos de Energia da GPU e Cabos SATA (Se Necessários)',
    instruction: 'Se sua placa de vídeo exigir conector extra (ex: RX 6600 ou RTX 4070S), conecte o Cabo PCIe. Se instalou disco SATA (HDD/SSD 2,5"), conecte o Cabo SATA.',
    pedagogicalWhy: 'Placas de vídeo acima de 75W exigem energia suplementar da fonte, e discos SATA de 2,5"/3,5" não funcionam sem os cabos de dados e energia SATA.',
    targetSlot: 'slot_cable_pcie_power',
    hint1: 'Verifique em "Cabos e Acessórios" o Cabo PCIe (para GPU) e o Kit Cabo SATA (para HDD/SSD 2,5").',
    hint2: 'Se usou apenas GTX 1650 (75W) e SSD M.2, esta etapa já estará automaticamente satisfeita!',
    isCompleted: (state) => {
      const hasSataDrive = Boolean(state.driveBays.slot_drive_bay_1 || state.driveBays.slot_drive_bay_2);
      const sataOk = !hasSataDrive || state.cables.sataData;
      const needsGpuPower = state.gpuId === 'gpu-rx-6600-8gb' || state.gpuId === 'gpu-rtx-4070-super-12gb';
      const gpuPowerOk = !needsGpuPower || state.cables.pciePower;
      return sataOk && gpuPowerOk;
    },
  },
  {
    stepNumber: 16,
    id: 'step-16-front-panel',
    title: '16. Conectar os Cabos do Painel Frontal (F_PANEL)',
    instruction: 'Conecte os Conectores do Painel Frontal (PWR_SW, RESET_SW, LEDs) ao header F_PANEL no canto inferior direito da placa-mãe.',
    pedagogicalWhy: 'Liga o botão físico de ligar do gabinete aos pinos Power Switch da placa-mãe.',
    targetSlot: 'slot_cable_front_panel',
    hint1: 'Selecione "Conectores do Painel Frontal" em Cabos e Acessórios.',
    hint2: 'Encaixe no ponto F_PANEL da placa-mãe.',
    isCompleted: (state) => state.cables.frontPanel,
  },
  {
    stepNumber: 17,
    id: 'step-17-boot-test',
    title: '17. Revisar Diagnóstico e Ligar o Computador Virtual (POST & Boot)',
    instruction: 'Clique no botão "Ligar PC (Simular POST / Boot)" na barra superior para testar sua montagem e assistir à sequência de inicialização!',
    pedagogicalWhy: 'O Power-On Self-Test (POST) testa CPU, RAM, Vídeo e Armazenamento antes de entregar o controle ao Sistema Operacional.',
    targetSlot: 'POWER_BUTTON',
    hint1: 'Clique no botão verde "Ligar PC (POST)" no topo da tela.',
    hint2: 'Verifique se todas as 8 etapas do POST são aprovadas com código 0xAA.',
    isCompleted: (_state, _safety, postPassed) => postPassed,
  },
];

export const DIAGNOSTIC_SCENARIOS: DiagnosticScenario[] = [
  {
    id: 'diag-1-missing-cpu-eps',
    title: 'Cenário 1: Ventoinhas Giram, Mas Não Dá Vídeo (LED CPU Aceso)',
    difficulty: 'Iniciante',
    symptomDescription:
      'O cliente montou um PC com Ryzen 5 5600X, 16GB DDR4 e GTX 1650. Ao apertar o botão Power, os LEDs acendem e as ventoinhas giram, mas a tela fica preta, não há bipe de POST e o LED "CPU" da placa-mãe fica aceso.',
    simulatedFaultType: 'MISSING_CPU_POWER',
    initialState: {
      caseId: 'case-corsair-4000d-atx',
      standoffsInstalled: true,
      motherboardId: 'mb-asus-b550m-tuf',
      motherboardBiosUpdated: true,
      cpuId: 'cpu-amd-ryzen-5-5600x',
      cpuOrientationCorrect: true,
      thermalPasteApplied: true,
      coolerId: 'cooler-deepcool-ak400-tower',
      ramSlots: {
        slot_ram_1: null,
        slot_ram_2: 'ram-ddr4-16gb-3200',
        slot_ram_3: null,
        slot_ram_4: null,
      },
      m2Slots: {
        slot_m2_1: 'storage-ssd-samsung-980-pro-1tb-nvme4',
        slot_m2_2: null,
      },
      gpuId: 'gpu-gtx-1650-4gb',
      pcieAddonId: null,
      driveBays: {
        slot_drive_bay_1: null,
        slot_drive_bay_2: null,
      },
      psuId: 'psu-corsair-cv550-bronze',
      cmosBatteryInstalled: true,
      beepSpeakerInstalled: true,
      cables: {
        atx24Pin: true,
        cpuEps: false, // FALHA AQUI!
        pciePower: false,
        sataData: false,
        frontPanel: true,
      },
    },
    clues: [
      'A placa-mãe recebe energia de 5V/12V pelo conector de 24 pinos (por isso as ventoinhas giram).',
      'Inspecione o canto superior esquerdo da placa-mãe próximo ao dissipador do VRM.',
      'O processador possui uma entrada de energia exclusiva de 8 pinos (EPS 12V).'
    ],
    diagnosticProcedure: [
      'Acione o botão "Ligar PC (POST)" para observar em qual etapa o diagnóstico para.',
      'Verifique a lista de cabos conectados na bancada.',
      'Localize o conector EPS 12V da CPU desconectado.'
    ],
    expectedSolutionDescription: 'Conectar o "Cabo de Alimentação da CPU EPS 12V (4+4 Pinos)" na placa-mãe e ligar o computador.',
    causeExplanation:
      'Sem o cabo EPS 12V de 4 ou 8 pinos conectado, o circuito regulador de tensão (VRM) do processador fica sem alimentação de +12V. O processador permanece inativo e o POST não pode começar.',
    verifyResolved: (state: InstalledHardwareState, postResult: PostBootSimulationResult) => ({
      resolved: state.cables.cpuEps && postResult.bootToOsSuccess,
      feedback:
        state.cables.cpuEps && postResult.bootToOsSuccess
          ? 'Diagnóstico Perfeito! Você identificou a ausência do cabo EPS 12V da CPU, conectou-o e o sistema inicializou normalmente.'
          : 'O problema persiste: conecte o cabo EPS 12V da CPU e execute o teste de inicialização (Ligar PC).',
    }),
  },
  {
    id: 'diag-2-defective-ram',
    title: 'Cenário 2: Bipes Curtos Contínuos no POST e Tela Preta (LED DRAM)',
    difficulty: 'Iniciante',
    symptomDescription:
      'Ao ligar o computador do laboratório, o alto-falante interno emite bipes curtos contínuos e o código POST trava em 0x55 (LED DRAM aceso). O computador não chega à tela da BIOS.',
    simulatedFaultType: 'DEFECTIVE_RAM',
    initialState: {
      caseId: 'case-corsair-4000d-atx',
      standoffsInstalled: true,
      motherboardId: 'mb-asus-b550m-tuf',
      motherboardBiosUpdated: true,
      cpuId: 'cpu-amd-ryzen-5-5600x',
      cpuOrientationCorrect: true,
      thermalPasteApplied: true,
      coolerId: 'cooler-deepcool-ak400-tower',
      ramSlots: {
        slot_ram_1: 'ram-ddr4-defective-sim', // MÓDULO DEFEITUOSO!
        slot_ram_2: null,
        slot_ram_3: null,
        slot_ram_4: null,
      },
      m2Slots: {
        slot_m2_1: 'storage-ssd-samsung-980-pro-1tb-nvme4',
        slot_m2_2: null,
      },
      gpuId: 'gpu-gtx-1650-4gb',
      pcieAddonId: null,
      driveBays: {
        slot_drive_bay_1: null,
        slot_drive_bay_2: null,
      },
      psuId: 'psu-corsair-cv550-bronze',
      cmosBatteryInstalled: true,
      beepSpeakerInstalled: true,
      cables: {
        atx24Pin: true,
        cpuEps: true,
        pciePower: false,
        sataData: false,
        frontPanel: true,
      },
    },
    clues: [
      'O código sonoro de bipes contínuos e o código hexadecimal 0x55 apontam diretamente para o subsistema de memória.',
      'Inspecione o módulo instalado no Slot DIMM_A1 (Slot 1).',
      'Substitua o módulo com falha por um módulo Corsair Vengeance LPX 16GB DDR4-3200 saudável.'
    ],
    diagnosticProcedure: [
      'Execute o POST para confirmar o erro 0x55 no estágio 4 (DRAM).',
      'Remova o módulo de memória defeituoso do Slot DIMM 1.',
      'Instale um módulo DDR4 íntegro do catálogo e ligue o PC novamente.'
    ],
    expectedSolutionDescription: 'Remover o módulo DDR4 com falha simulada e instalar um módulo DDR4 funcional.',
    causeExplanation:
      'Módulos de RAM com células danificadas ou falha de paridade reprovam no treinamento de memória (Memory Training) executado pelo controlador IMC antes da inicialização do vídeo.',
    verifyResolved: (_state: InstalledHardwareState, postResult: PostBootSimulationResult) => ({
      resolved: postResult.bootToOsSuccess,
      feedback: postResult.bootToOsSuccess
        ? 'Excelente! Você removeu o pente de RAM defeituoso, instalou um módulo DDR4 saudável e o POST concluiu com sucesso.'
        : 'Ainda há falha no treinamento de memória: remova o módulo defeituoso do Slot 1, instale uma RAM DDR4 funcional e ligue o PC.',
    }),
  },
  {
    id: 'diag-3-outdated-bios-b450',
    title: 'Cenário 3: Upgrade de CPU Ryzen 5000 em Placa B450 Antiga Não Inicia',
    difficulty: 'Intermediário',
    symptomDescription:
      'Um estudante atualizou seu computador trocando um Ryzen antigo por um Ryzen 7 5800X3D em uma placa-mãe Gigabyte B450M DS3H (BIOS de fábrica F40). Todas as peças são AM4, mas o PC não passa do estágio da CPU no POST (Código 0x0D).',
    simulatedFaultType: 'OUTDATED_BIOS',
    initialState: {
      caseId: 'case-corsair-4000d-atx',
      standoffsInstalled: true,
      motherboardId: 'mb-gigabyte-b450m-ds3h',
      motherboardBiosUpdated: false, // BIOS F40 < F62 exigida pelo 5800X3D!
      cpuId: 'cpu-amd-ryzen-7-5800x3d',
      cpuOrientationCorrect: true,
      thermalPasteApplied: true,
      coolerId: 'cooler-deepcool-ak400-tower',
      ramSlots: {
        slot_ram_1: null,
        slot_ram_2: 'ram-ddr4-16gb-3200',
        slot_ram_3: null,
        slot_ram_4: null,
      },
      m2Slots: {
        slot_m2_1: 'storage-ssd-wd-green-m2-sata-500gb',
        slot_m2_2: null,
      },
      gpuId: 'gpu-gtx-1650-4gb',
      pcieAddonId: null,
      driveBays: {
        slot_drive_bay_1: null,
        slot_drive_bay_2: null,
      },
      psuId: 'psu-corsair-cv550-bronze',
      cmosBatteryInstalled: true,
      beepSpeakerInstalled: true,
      cables: {
        atx24Pin: true,
        cpuEps: true,
        pciePower: false,
        sataData: false,
        frontPanel: true,
      },
    },
    clues: [
      'O socket AM4 é fisicamente o mesmo, mas a placa B450 foi fabricada antes do lançamento da arquitetura Zen 3 (Ryzen 5000).',
      'Consulte a versão da BIOS instalada na placa-mãe (F40) versus a versão mínima exigida pelo Ryzen 7 5800X3D (F62).',
      'Utilize a ferramenta de atualização de firmware (Atualizar BIOS) na barra de ferramentas da bancada.'
    ],
    diagnosticProcedure: [
      'Tente ligar o PC e leia o relatório do estágio 3 do POST.',
      'Clique no botão "Atualizar BIOS" na barra superior da bancada para gravar a versão F64.',
      'Ligue o computador novamente para validar o boot.'
    ],
    expectedSolutionDescription: 'Atualizar o firmware BIOS da placa-mãe B450 para suportar o microcódigo do Ryzen 7 5800X3D.',
    causeExplanation:
      'Mesmo quando o socket físico e o chipset são compatíveis, a memória Flash da BIOS precisa conter o microcódigo AGESA específico para inicializar processadores lançados posteriormente.',
    verifyResolved: (state: InstalledHardwareState, postResult: PostBootSimulationResult) => ({
      resolved: state.motherboardBiosUpdated && postResult.bootToOsSuccess,
      feedback:
        state.motherboardBiosUpdated && postResult.bootToOsSuccess
          ? 'Problema Resolvido! Com a BIOS atualizada para a versão F64, o chipset B450 reconheceu o Ryzen 7 5800X3D perfeitamente.'
          : 'Atualize a BIOS da placa-mãe (ou instale um Ryzen 3600 compatível com a BIOS F40) e ligue o PC.',
    }),
  },
  {
    id: 'diag-4-no-video-igpu-f',
    title: 'Cenário 4: Core i5-12400F Sem Sinal de Vídeo no Monitor (1 Bipe Longo, 3 Curtos)',
    difficulty: 'Iniciante',
    symptomDescription:
      'O aluno montou um PC com Intel Core i5-12400F e conectou o monitor na saída HDMI da placa-mãe MSI B660M. Ao ligar, o speaker emite 1 bipe longo e 3 bipes curtos (erro 0x97 VGA) e o monitor exibe "Sem Sinal".',
    simulatedFaultType: 'NO_VIDEO_OUTPUT',
    initialState: {
      caseId: 'case-corsair-4000d-atx',
      standoffsInstalled: true,
      motherboardId: 'mb-msi-b660m-mortar-ddr4',
      motherboardBiosUpdated: true,
      cpuId: 'cpu-intel-i5-12400f',
      cpuOrientationCorrect: true,
      thermalPasteApplied: true,
      coolerId: 'cooler-deepcool-ak400-tower',
      ramSlots: {
        slot_ram_1: null,
        slot_ram_2: 'ram-ddr4-16gb-3200',
        slot_ram_3: null,
        slot_ram_4: null,
      },
      m2Slots: {
        slot_m2_1: 'storage-ssd-samsung-980-pro-1tb-nvme4',
        slot_m2_2: null,
      },
      gpuId: null, // SEM PLACA DE VÍDEO!
      pcieAddonId: null,
      driveBays: {
        slot_drive_bay_1: null,
        slot_drive_bay_2: null,
      },
      psuId: 'psu-corsair-cv550-bronze',
      cmosBatteryInstalled: true,
      beepSpeakerInstalled: true,
      cables: {
        atx24Pin: true,
        cpuEps: true,
        pciePower: false,
        sataData: false,
        frontPanel: true,
      },
    },
    clues: [
      'Observe a letra "F" no final do modelo Intel Core i5-12400F.',
      'As portas HDMI/DisplayPort da placa-mãe só funcionam quando o processador possui gráficos integrados (iGPU).',
      'Instale uma placa de vídeo dedicada no slot PCI Express x16.'
    ],
    diagnosticProcedure: [
      'Inspecione as especificações técnicas do processador Core i5-12400F.',
      'Instale uma placa de vídeo dedicada (ex: GTX 1650 ou RX 6600 com cabo PCIe) no slot PCIe x16.',
      'Ligue o computador para confirmar a saída de vídeo.'
    ],
    expectedSolutionDescription: 'Instalar uma placa de vídeo dedicada no slot PCIe x16 (ou trocar a CPU por um modelo com vídeo integrado, como i5-14600K).',
    causeExplanation:
      'Na linha Intel Core, o sufixo "F" indica que o processador não possui gráficos integrados ativos. Sem uma placa de vídeo dedicada PCIe, o sistema não possui hardware gerador de vídeo.',
    verifyResolved: (_state: InstalledHardwareState, postResult: PostBootSimulationResult) => ({
      resolved: postResult.bootToOsSuccess,
      feedback: postResult.bootToOsSuccess
        ? 'Diagnóstico Correto! Com uma solução gráfica ativa, o POST passou pelo estágio VGA e inicializou o sistema.'
        : 'Instale uma placa de vídeo dedicada (e seu cabo de energia, se necessário) e ligue o PC.',
    }),
  },
  {
    id: 'diag-5-unconnected-hdd-sata',
    title: 'Cenário 5: PC Entra na BIOS, Mas Exibe "No Bootable Device Found"',
    difficulty: 'Iniciante',
    symptomDescription:
      'O computador possui um HDD Seagate BarraCuda de 2TB instalado na baia do gabinete, passa no POST com 1 bipe curto, mas não carrega o sistema operacional e informa que nenhum disco foi detectado nas portas SATA.',
    simulatedFaultType: 'UNCONNECTED_STORAGE',
    initialState: {
      caseId: 'case-corsair-4000d-atx',
      standoffsInstalled: true,
      motherboardId: 'mb-asus-b550m-tuf',
      motherboardBiosUpdated: true,
      cpuId: 'cpu-amd-ryzen-5-5600x',
      cpuOrientationCorrect: true,
      thermalPasteApplied: true,
      coolerId: 'cooler-deepcool-ak400-tower',
      ramSlots: {
        slot_ram_1: null,
        slot_ram_2: 'ram-ddr4-16gb-3200',
        slot_ram_3: null,
        slot_ram_4: null,
      },
      m2Slots: {
        slot_m2_1: null,
        slot_m2_2: null,
      },
      gpuId: 'gpu-gtx-1650-4gb',
      pcieAddonId: null,
      driveBays: {
        slot_drive_bay_1: 'storage-hdd-seagate-2tb-35',
        slot_drive_bay_2: null,
      },
      psuId: 'psu-corsair-cv550-bronze',
      cmosBatteryInstalled: true,
      beepSpeakerInstalled: true,
      cables: {
        atx24Pin: true,
        cpuEps: true,
        pciePower: false,
        sataData: false, // CABO SATA DESCONECTADO!
        frontPanel: true,
      },
    },
    clues: [
      'Apenas encaixar um HDD de 3,5" na gaveta mecânica do gabinete não o conecta eletricamente à placa-mãe.',
      'Verifique a seção "Cabos e Acessórios" no catálogo.',
      'Conecte o Kit Cabo de Dados SATA III + Alimentação SATA.'
    ],
    diagnosticProcedure: [
      'Acione o POST e observe o alerta no Estágio 7 (Armazenamento).',
      'Vá até "Cabos e Acessórios" e conecte o "Kit Cabo de Dados SATA III + Alimentação SATA".',
      'Ligue o computador novamente.'
    ],
    expectedSolutionDescription: 'Conectar os cabos de dados e alimentação SATA ao HDD de 3,5 polegadas.',
    causeExplanation:
      'Unidades SATA de 2,5" e 3,5" dependem do cabo de energia SATA (15 pinos, vindo da fonte) para girar o motor do disco e alimentar a placa lógica, e do cabo de dados SATA (7 pinos) para transmitir dados à placa-mãe.',
    verifyResolved: (state: InstalledHardwareState, postResult: PostBootSimulationResult) => ({
      resolved: state.cables.sataData && postResult.bootToOsSuccess,
      feedback:
        state.cables.sataData && postResult.bootToOsSuccess
          ? 'Excelente! O cabo SATA foi conectado, os pratos do HDD aceleraram até 7200 RPM e o sistema operacional iniciou.'
          : 'Conecte o Kit Cabo de Dados SATA III + Alimentação SATA e ligue o PC.',
    }),
  },
  {
    id: 'diag-6-insufficient-psu-gpu-power',
    title: 'Cenário 6: Upgrade para Radeon RX 6600 com Fonte Genérica 300W Sem Cabo PCIe',
    difficulty: 'Avançado',
    symptomDescription:
      'O usuário comprou uma placa de vídeo dedicada AMD Radeon RX 6600 (132W), encaixou no slot PCIe x16, mas não conseguiu ligá-la porque sua Fonte Básica de 300W não possui conector PCIe de 8 pinos.',
    simulatedFaultType: 'INSUFFICIENT_PSU',
    initialState: {
      caseId: 'case-corsair-4000d-atx',
      standoffsInstalled: true,
      motherboardId: 'mb-asus-b550m-tuf',
      motherboardBiosUpdated: true,
      cpuId: 'cpu-amd-ryzen-5-5600x',
      cpuOrientationCorrect: true,
      thermalPasteApplied: true,
      coolerId: 'cooler-deepcool-ak400-tower',
      ramSlots: {
        slot_ram_1: null,
        slot_ram_2: 'ram-ddr4-16gb-3200',
        slot_ram_3: null,
        slot_ram_4: null,
      },
      m2Slots: {
        slot_m2_1: 'storage-ssd-samsung-980-pro-1tb-nvme4',
        slot_m2_2: null,
      },
      gpuId: 'gpu-rx-6600-8gb',
      pcieAddonId: null,
      driveBays: {
        slot_drive_bay_1: null,
        slot_drive_bay_2: null,
      },
      psuId: 'psu-generic-300w', // FONTE SEM CONECTOR PCIE!
      cmosBatteryInstalled: true,
      beepSpeakerInstalled: true,
      cables: {
        atx24Pin: true,
        cpuEps: true,
        pciePower: false,
        sataData: false,
        frontPanel: true,
      },
    },
    clues: [
      'A RX 6600 exige 1 conector PCIe de 8 pinos e uma fonte de pelo menos 500W.',
      'Para substituir a fonte, lembre-se da regra de desmontagem: desconecte os cabos ATX 24 pinos e EPS da CPU antes de remover a fonte antiga!',
      'Após instalar uma fonte de 550W ou 750W, reconecte os cabos 24 pinos, EPS da CPU e o cabo PCIe de 8 pinos da GPU.'
    ],
    diagnosticProcedure: [
      'Desconecte os cabos ATX 24 pinos e EPS 12V na lista de peças instaladas.',
      'Remova a Fonte Genérica de 300W e instale a Corsair CV550 (550W) ou XPG Core Reactor (750W).',
      'Conecte novamente os cabos ATX 24 pinos, EPS da CPU e o Cabo de Alimentação PCIe da placa de vídeo, e ligue o PC.'
    ],
    expectedSolutionDescription: 'Substituir a fonte genérica de 300W por uma fonte de 550W/750W e conectar todos os cabos de energia (incluindo o PCIe 8-pin na GPU).',
    causeExplanation:
      'Fontes básicas de escritório não possuem cabeamento PCIe de 8 pinos nem corrente suficiente na linha +12V para placas de vídeo dedicadas acima de 75W.',
    verifyResolved: (state: InstalledHardwareState, postResult: PostBootSimulationResult) => ({
      resolved: state.cables.pciePower && postResult.bootToOsSuccess,
      feedback:
        state.cables.pciePower && postResult.bootToOsSuccess
          ? 'Manutenção Completa! Você seguiu a ordem correta de desmontagem dos cabos, trocou a fonte e alimentou a RX 6600 com segurança.'
          : 'Substitua a fonte por um modelo de 550W ou 750W, reconecte os cabos 24-pin, CPU EPS e PCIe da GPU e ligue o PC.',
    }),
  },
];

export interface MotherboardRegionInfo {
  id: string;
  name: string;
  position: [number, number, number];
  role: string;
  importance: string;
  relatedComponents: string[];
}

export const MOTHERBOARD_REGIONS: MotherboardRegionInfo[] = [
  {
    id: 'region-socket',
    name: 'Socket da CPU (ZIF PGA / LGA)',
    position: [-0.55, 0.56, -0.55],
    role: 'Interface eletromecânica que conecta o processador às trilhas de dados, memória, PCIe e energia da placa-mãe.',
    importance: 'Define a família e geração de processadores compatíveis. Possui chaveamento físico (Pino 1) para impedir encaixe invertido.',
    relatedComponents: ['Processador (CPU)', 'Cooler / Dissipador', 'Circuito VRM'],
  },
  {
    id: 'region-vrm',
    name: 'Circuito VRM (Módulo Regulador de Tensão)',
    position: [-1.15, 0.58, -0.55],
    role: 'Converte a tensão de +12V recebida do cabo EPS da fonte para a tensão precisa exigida pelos núcleos da CPU (~0.8V a 1.4V) em alta corrente.',
    importance: 'Composto por MOSFETs, indutores (chokes) e capacitores sob dissipadores metálicos. Um VRM fraco superaquece com CPUs de alto TDP.',
    relatedComponents: ['Conector EPS 12V (4/8 pinos)', 'Processador (CPU)', 'Fonte de Alimentação'],
  },
  {
    id: 'region-dimm',
    name: 'Slots de Memória RAM (DIMM)',
    position: [0.42, 0.58, -0.55],
    role: 'Conectam os módulos de memória volátil ao controlador de memória integrado (IMC) da CPU através de canais de 64 bits (Dual-Channel).',
    importance: 'Cada geração (DDR, DDR2, DDR3, DDR4, DDR5) possui contagem de pinos e posição do entalhe exclusivas.',
    relatedComponents: ['Módulos de Memória RAM', 'Processador (Controlador IMC)'],
  },
  {
    id: 'region-pcie16',
    name: 'Slot PCI Express x16 Principal',
    position: [-0.55, 0.54, 0.36],
    role: 'Barramento serial de alta velocidade (16 lanes ligadas diretamente à CPU) para placas de vídeo dedicadas.',
    importance: 'Fornece até 75W de energia elétrica e largura de banda de até 32 GB/s (PCIe 4.0 x16) ou 64 GB/s (PCIe 5.0 x16).',
    relatedComponents: ['Placa de Vídeo (GPU)', 'Processador (Lanes PCIe)'],
  },
  {
    id: 'region-m2',
    name: 'Conectores M.2 (NVMe PCIe / SATA)',
    position: [-0.45, 0.50, 0.08],
    role: 'Permitem instalar SSDs compactos diretamente na placa-mãe sem necessidade de cabos.',
    importance: 'Atenção didática: o formato físico é M.2, mas cada slot pode aceitar protocolo PCIe NVMe, SATA ou ambos conforme o projeto da placa-mãe!',
    relatedComponents: ['SSD M.2 NVMe', 'SSD M.2 SATA', 'Chipset / CPU'],
  },
  {
    id: 'region-chipset',
    name: 'Chipset (PCH / FCH sob Dissipador)',
    position: [0.35, 0.52, 0.65],
    role: 'Gerencia a comunicação com portas SATA, portas USB, rede, áudio, slots PCIe secundários e armazenamento conectado ao chipset.',
    importance: 'Trabalha em conjunto com a CPU (ligado via barramento DMI na Intel ou Infinity Fabric/PCIe na AMD) e define recursos como overclock e número de conexões.',
    relatedComponents: ['Portas SATA', 'Slots PCIe x1', 'Portas Traseiras I/O'],
  },
  {
    id: 'region-sata',
    name: 'Portas SATA III (6 Gbps)',
    position: [0.82, 0.50, 0.55],
    role: 'Conectores em formato "L" de 7 pinos para comunicação com discos rígidos (HDD) e SSDs de 2,5 polegadas.',
    importance: 'Operam com protocolo AHCI até 600 MB/s teóricos e exigem cabo de dados SATA individual por unidade.',
    relatedComponents: ['HDD 3,5" / 2,5"', 'SSD 2,5" SATA', 'Cabo de Dados SATA'],
  },
  {
    id: 'region-atx24',
    name: 'Conector Principal ATX 24 Pinos',
    position: [0.82, 0.56, -0.25],
    role: 'Recebe as linhas +12V, +5V, +3.3V, +5VSB (Standby) e o pino PS_ON# da fonte de alimentação.',
    importance: 'Sem este conector travado, a placa-mãe não recebe energia de standby nem consegue acionar a partida da fonte.',
    relatedComponents: ['Fonte de Alimentação (PSU)', 'Cabo ATX 24 Pinos'],
  },
  {
    id: 'region-fpanel',
    name: 'Conectores do Painel Frontal (F_PANEL) e Bateria CMOS',
    position: [0.65, 0.50, 1.0],
    role: 'Interligam o botão Power, Reset, LEDs do gabinete e o alto-falante de bipes do POST, próximo à bateria CR2032.',
    importance: 'O fechamento momentâneo dos dois pinos PWR_SW é o que dá a partida em todo o computador.',
    relatedComponents: ['Botão Power do Gabinete', 'Bateria CMOS CR2032', 'Speaker de Diagnóstico'],
  },
  {
    id: 'region-rear-io',
    name: 'Espelho e Portas Traseiras (Rear I/O)',
    position: [-1.35, 0.68, -0.35],
    role: 'Concentra conexões externas: USB, RJ-45 Ethernet, conectores de áudio e saídas de vídeo da placa-mãe (HDMI/DisplayPort).',
    importance: 'Lembrete fundamental: as saídas de vídeo traseiras da placa-mãe só funcionam se a CPU possuir gráficos integrados! Quando há uma GPU dedicada instalada, o monitor deve ser ligado na placa de vídeo.',
    relatedComponents: ['Periféricos Externos', 'Gráficos Integrados da CPU (iGPU)'],
  }
];

export interface DidacticConceptTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  keyPoints: string[];
  practicalRule: string;
}

export const EDUCATIONAL_TOPICS: DidacticConceptTopic[] = [
  {
    id: 'topic-architecture',
    title: 'Arquitetura de Von Neumann: CPU, RAM e Armazenamento',
    category: 'Arquitetura',
    summary: 'Como o processador busca instruções na memória volátil (RAM) e como os dados permanentes residem no HDD ou SSD.',
    keyPoints: [
      'Armazenamento Secundário (HDD/SSD): Não-volátil. Guarda arquivos e o sistema operacional mesmo com o PC desligado, mas tem latência maior.',
      'Memória Principal (RAM): Volátil e muito mais rápida. Tudo o que está aberto precisa ser copiado do SSD/HDD para a RAM.',
      'Processador (CPU): Possui Registradores e Cache (L1, L2, L3) ultrarrápidos e executa o ciclo Busca -> Decodificação -> Execução (Fetch-Decode-Execute).'
    ],
    practicalRule: 'Mais armazenamento (SSD/HDD) permite guardar mais arquivos; mais memória RAM permite manter mais programas abertos simultaneamente sem lentidão (swap).',
  },
  {
    id: 'topic-hdd-vs-ssd',
    title: 'Funcionamento Interno do HDD Mecânico vs SSD Eletrônico',
    category: 'Armazenamento',
    summary: 'Por que um disco rígido mecânico (HDD) possui latência de milissegundos enquanto um SSD acessa dados em microssegundos.',
    keyPoints: [
      'No HDD: Pratos metálicos revestidos por material ferromagnético giram a 5400 ou 7200 RPM acionados pelo motor de eixo (spindle).',
      'Braço Atuador e Cabeça de Leitura/Escrita: Uma bobina de voz (voice coil) move o braço fisicamente até a trilha concêntrica correta (Tempo de Busca / Seek Time ~8,5 ms) e aguarda o setor passar sob a cabeça (Latência Rotacional ~4,1 ms).',
      'No SSD: Não existem partes móveis! O controlador acessa matrizes de memória Flash NAND eletronicamente por canais paralelos (tempo de acesso < 0,05 ms).'
    ],
    practicalRule: 'Nunca movimente brusca ou fisicamente um HDD enquanto estiver ligado: o impacto da cabeça de leitura sobre o prato em rotação (Head Crash) destrói a superfície magnética e causa perda de dados.',
  },
  {
    id: 'topic-m2-sata-nvme',
    title: 'M.2 Não É Sinônimo de NVMe: Formato Físico vs Protocolo',
    category: 'Barramentos',
    summary: 'Distinção fundamental entre o conector físico (M.2 ou 2,5"), o barramento elétrico (SATA ou PCI Express) e o protocolo lógico (AHCI ou NVMe).',
    keyPoints: [
      'Formato Físico (Form Factor): 3,5 polegadas, 2,5 polegadas ou cartão M.2 (ex: M.2 2280 = 22 mm de largura por 80 mm de comprimento).',
      'M.2 SATA (Chave B+M): Usa o conector M.2 na placa-mãe, mas comunica-se pelo barramento SATA III antigo (limitado a ~550 MB/s). Não funciona em slots M.2 exclusivos para PCIe!',
      'M.2 NVMe (Chave M): Comunica-se diretamente por 4 linhas (lanes) do barramento PCI Express usando o protocolo NVMe, atingindo de 3.500 MB/s (PCIe 3.0) a mais de 12.000 MB/s (PCIe 5.0).'
    ],
    practicalRule: 'Antes de comprar ou instalar um SSD M.2, verifique nas especificações da placa-mãe se o slot M.2 suporta PCIe NVMe, SATA ou ambos.',
  },
  {
    id: 'topic-ddr-generations',
    title: 'Evolução e Incompatibilidade Física entre DDR, DDR2, DDR3, DDR4 e DDR5',
    category: 'Memória',
    summary: 'Como evoluíram as cinco gerações de memória SDRAM DDR e por que elas possuem entalhes físicos incompatíveis.',
    keyPoints: [
      'DDR (184 pinos, 2.5V) -> DDR2 (240 pinos, 1.8V) -> DDR3 (240 pinos, 1.5V) -> DDR4 (288 pinos, 1.2V) -> DDR5 (288 pinos, 1.1V com PMIC no módulo).',
      'Mesmo quando duas gerações têm o mesmo número de pinos (DDR2 vs DDR3 com 240 pinos; DDR4 vs DDR5 com 288 pinos), a posição do entalhe (key notch) é deslocada.',
      'DIMM (Desktop, 133,35 mm) vs SO-DIMM (Notebook, 67,6 mm): formatos físicos distintos que não se encaixam entre si.'
    ],
    practicalRule: 'Se o pente de memória não encaixar suavemente com o entalhe alinhado ao centro do slot, NUNCA force: verifique a geração DDR e a orientação de 180°.',
  },
  {
    id: 'topic-bios-post-boot',
    title: 'BIOS/UEFI, Sequência de POST e Processo de Boot',
    category: 'Inicialização',
    summary: 'O que acontece desde o instante em que você pressiona o botão Power até o carregamento do sistema operacional.',
    keyPoints: [
      '1. Partida Elétrica: O botão Power fecha os pinos PWR_SW no F_PANEL; a placa-mãe aterra o fio PS_ON# da fonte, que estabiliza +12V/+5V/+3.3V e envia o sinal Power Good.',
      '2. POST (Power-On Self-Test): O firmware UEFI/BIOS armazenado no chip Flash da placa-mãe verifica CPU, treina a memória DRAM, inicializa a placa de vídeo e emite bipes ou códigos hexadecimais de diagnóstico.',
      '3. Bootloader e Sistema Operacional: Após aprovar o POST, o UEFI lê a partição EFI do SSD/HDD e carrega o kernel do Sistema Operacional para a memória RAM.'
    ],
    practicalRule: 'Se o computador liga as ventoinhas mas não dá vídeo, observe os LEDs de diagnóstico (CPU, DRAM, VGA, BOOT) ou ouça os bipes do speaker para isolar a peça responsável.',
  }
];

export interface QuizQuestion {
  id: string;
  category: ComponentCategory | 'general';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const REVIEW_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-cpu-socket',
    category: 'cpu',
    question: 'Um técnico tenta instalar um processador Intel Core i5-12400F (Socket LGA 1700) em uma placa-mãe ASUS B550M (Socket AM4). O que acontecerá?',
    options: [
      'Funcionará com velocidade reduzida caso atualize a BIOS.',
      'A instalação é fisicamente e eletricamente incompatível: LGA 1700 possui 1700 contatos na placa-mãe, enquanto AM4 é PGA de 1331 pinos da AMD.',
      'Encaixará apenas se usar memória DDR4.',
      'Funcionará desde que o cooler seja compatível.'
    ],
    correctIndex: 1,
    explanation: 'Sockets diferentes (especialmente de arquiteturas e fabricantes distintos como Intel LGA 1700 e AMD AM4) possuem dimensões, pinagem e protocolos elétricos totalmente incompatíveis.',
  },
  {
    id: 'q-ram-ddr4-ddr5',
    category: 'ram',
    question: 'Tanto a memória DDR4 quanto a DDR5 para desktop (DIMM) possuem 288 contatos metálicos. Por que não é possível usar um pente DDR4 em uma placa-mãe DDR5?',
    options: [
      'Porque o entalhe físico (key notch), a tensão de operação (1.2V vs 1.1V) e a arquitetura de regulação de energia (PMIC) são diferentes e incompatíveis.',
      'Porque a DDR4 só existe em formato SO-DIMM de notebook.',
      'É possível usar normalmente se ativar o XMP na BIOS.',
      'Porque a DDR5 exige cabo SATA conectado.'
    ],
    correctIndex: 0,
    explanation: 'Apesar de ambas terem 288 pinos, o entalhe físico (chaveamento) está em posição diferente justamente para evitar a inserção cruzada entre DDR4 e DDR5.',
  },
  {
    id: 'q-hdd-internal',
    category: 'storage',
    question: 'No funcionamento interno de um HDD mecânico de 3,5 polegadas, qual é a função do conjunto formado pelo Braço Atuador (Bobina de Voz) e pela Cabeça de Leitura/Escrita?',
    options: [
      'Girar os pratos magnéticos a 7200 RPM.',
      'Converter corrente alternada da tomada em 12V.',
      'Movimentar-se radialmente sobre os pratos em rotação (movimento de busca / seek) para posicionar a cabeça sobre a trilha correta e ler/gravar dados magneticamente sem tocar no prato.',
      'Armazenar dados temporariamente em células Flash NAND.'
    ],
    correctIndex: 2,
    explanation: 'O motor central (spindle) gira os pratos, enquanto o braço atuador move as cabeças radialmente entre as trilhas concêntricas, flutuando sobre um colchão microscópico de ar.',
  },
  {
    id: 'q-m2-protocol',
    category: 'storage',
    question: 'Um aluno comprou um SSD M.2 2280 SATA (Chave B+M) e tentou instalá-lo em um slot M.2 que suporta exclusivamente PCIe NVMe. Qual é o resultado técnico correto?',
    options: [
      'O SSD funcionará na velocidade máxima do NVMe (7000 MB/s).',
      'O sistema rejeitará / não reconhecerá o disco, pois M.2 é apenas o formato físico e o slot não possui ligação com o controlador SATA.',
      'Funcionará se conectar um cabo SATA na lateral do SSD M.2.',
      'Queimará o processador.'
    ],
    correctIndex: 1,
    explanation: 'M.2 não é sinônimo de NVMe! Um SSD M.2 SATA utiliza protocolo AHCI/SATA e exige que o slot M.2 da placa-mãe ofereça suporte elétrico ao barramento SATA.',
  },
  {
    id: 'q-motherboard-standoffs',
    category: 'motherboard',
    question: 'Qual é o risco real de parafusar a placa-mãe diretamente na chapa metálica do gabinete esquecendo de instalar os espaçadores (standoffs)?',
    options: [
      'Apenas estética, não afeta o funcionamento.',
      'As trilhas e pontos de solda no verso da placa-mãe encostarão na chapa metálica do gabinete, provocando curto-circuito e acionando o desarme da fonte (ou danificando a placa).',
      'O disco rígido girará mais devagar.',
      'A memória RAM perderá metade da capacidade.'
    ],
    correctIndex: 1,
    explanation: 'Os espaçadores de latão criam um vão livre seguro de ~6,5 mm sob a placa-mãe e aterram apenas os anéis metalizados dos furos de parafusação.',
  },
  {
    id: 'q-psu-safety',
    category: 'psu',
    question: 'Ao inspecionar uma fonte de alimentação sem etiqueta de especificações técnicas ou ao realizar manutenção em fontes, qual princípio técnico deve ser seguido?',
    options: [
      'Qualquer fonte com cabo de 24 pinos suporta qualquer placa de vídeo.',
      'Deve-se abrir a fonte com uma chave de fenda para medir os capacitores com a mão.',
      'Nunca se deve abrir uma fonte real devido ao risco de choque elétrico letal nos capacitores primários, e nunca se deve declarar compatibilidade elétrica sem dados verificados de potência e conectores.',
      'A fonte só alimenta o cooler do processador.'
    ],
    correctIndex: 2,
    explanation: 'Os capacitores do estágio primário de uma fonte armazenam alta tensão perigosa mesmo desligada da tomada, e fontes sem especificação verificada não podem ter sua compatibilidade garantida.',
  },
  {
    id: 'q-cooler-paste',
    category: 'cooler',
    question: 'Por que é obrigatório aplicar pasta térmica entre o difusor metálico da CPU (IHS) e a base do cooler?',
    options: [
      'Para colar o cooler permanentemente no processador sem precisar de parafusos.',
      'Para preencher as microimperfeições microscópicas das superfícies metálicas, expulsando o ar (que é um péssimo condutor térmico) e maximizando a transferência de calor.',
      'Para aumentar a frequência da memória RAM.',
      'Para substituir a ventoinha do cooler.'
    ],
    correctIndex: 1,
    explanation: 'Sem pasta térmica, o ar preso nas microrranhuras entre o IHS e a base do dissipador impede a passagem eficiente do calor, causando superaquecimento (Thermal Throttling ou desligamento).',
  },
  {
    id: 'q-gpu-video',
    category: 'gpu',
    question: 'Em um computador equipado com processador AMD Ryzen 5 5600X ou Intel Core i5-12400F e uma placa de vídeo dedicada GeForce RTX 4070 Super, onde o cabo do monitor deve ser conectado?',
    options: [
      'Na saída HDMI da placa-mãe, pois ela é mais próxima da CPU.',
      'Diretamente nas saídas HDMI/DisplayPort da própria placa de vídeo dedicada (no slot PCIe), pois esses processadores não possuem gráficos integrados.',
      'Na fonte de alimentação.',
      'Em qualquer porta USB.'
    ],
    correctIndex: 1,
    explanation: 'Quando há placa de vídeo dedicada (e especialmente quando a CPU não tem iGPU), o sinal de vídeo é gerado exclusivamente pelas portas traseiras da placa de vídeo.',
  }
];
