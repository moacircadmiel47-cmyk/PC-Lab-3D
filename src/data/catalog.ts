import {
  MotherboardSpec,
  CpuSpec,
  RamSpec,
  StorageSpec,
  GpuSpec,
  CoolerSpec,
  PsuSpec,
  CaseSpec,
  CableOrAccessorySpec,
  HardwareItem,
  SnapPointDefinition,
} from '../types/hardware';

export const MOTHERBOARDS: MotherboardSpec[] = [
  {
    id: 'mb-asus-b550m-tuf',
    name: 'ASUS TUF Gaming B550M-Plus',
    category: 'motherboard',
    manufacturer: 'ASUS',
    model: 'TUF Gaming B550M-Plus',
    summary: 'Placa-mãe Micro-ATX intermediária para plataforma AMD AM4 com suporte a PCIe 4.0 e DDR4.',
    functionInPc: 'Interconecta processador, memória RAM, armazenamento, placa de vídeo e fonte de alimentação através de trilhas e barramentos controlados pelo chipset AMD B550.',
    handlingPrecautions: [
      'Segure sempre pelas bordas da placa para evitar descarga eletrostática (ESD).',
      'Instale os espaçadores (standoffs) no gabinete antes de parafusar.',
      'Verifique o alinhamento do triângulo dourado no socket AM4 (PGA).'
    ],
    curiosities: [
      'O chipset B550 introduziu suporte a 20 linhas PCIe 4.0 diretamente ligadas aos processadores Ryzen 3000 e 5000 (exceto série G).'
    ],
    colorAccent: '#f59e0b',
    socket: 'AM4',
    platform: 'AMD',
    chipset: 'B550',
    formFactor: 'Micro-ATX',
    supportedCpuGenerations: ['Ryzen 3000', 'Ryzen 5000'],
    shippedBiosVersion: '2423',
    latestBiosVersion: '3405',
    ramGeneration: 'DDR4',
    ramFormFactor: 'DIMM',
    ramSlots: 4,
    maxRamCapacityGb: 128,
    maxRamSpeedMhz: 4600,
    pcieX16Slots: 2,
    pcieGeneration: 4,
    pcieX1Slots: 1,
    sataPorts: 4,
    m2Slots: [
      { id: 'slot_m2_1', label: 'M.2_1 (CPU PCIe 4.0 / SATA)', key: 'M', supportedProtocols: ['NVMe_PCIe4', 'NVMe_PCIe3', 'SATA'] },
      { id: 'slot_m2_2', label: 'M.2_2 (Chipset PCIe 3.0)', key: 'M', supportedProtocols: ['NVMe_PCIe3'] }
    ],
    cpuPowerConnector: '8-pin',
    mainPowerConnector: '24-pin',
    pcbColor: '#18181b',
    heatsinkColor: '#3f3f46',
  },
  {
    id: 'mb-gigabyte-b450m-ds3h',
    name: 'Gigabyte B450M DS3H (BIOS Inicial F1)',
    category: 'motherboard',
    manufacturer: 'Gigabyte',
    model: 'B450M DS3H',
    summary: 'Placa-mãe Micro-ATX AM4 popular; requer atualização de BIOS para processadores Ryzen série 5000.',
    functionInPc: 'Fornece base AM4 econômica com 4 slots DDR4 e 1 slot M.2 híbrido.',
    handlingPrecautions: [
      'Verifique a versão da BIOS gravada antes de instalar CPUs Ryzen 5000.',
      'Não force memórias de outras gerações nos slots DDR4.'
    ],
    curiosities: [
      'Placas B450 lançadas em 2018 receberam suporte estendido para CPUs Zen 3 (Ryzen 5000) mediante atualização de firmware AGESA.'
    ],
    colorAccent: '#0284c7',
    socket: 'AM4',
    platform: 'AMD',
    chipset: 'B450',
    formFactor: 'Micro-ATX',
    supportedCpuGenerations: ['Ryzen 1000', 'Ryzen 2000', 'Ryzen 3000', 'Ryzen 5000'],
    shippedBiosVersion: 'F40',
    latestBiosVersion: 'F64',
    ramGeneration: 'DDR4',
    ramFormFactor: 'DIMM',
    ramSlots: 4,
    maxRamCapacityGb: 128,
    maxRamSpeedMhz: 3600,
    pcieX16Slots: 1,
    pcieGeneration: 3,
    pcieX1Slots: 2,
    sataPorts: 4,
    m2Slots: [
      { id: 'slot_m2_1', label: 'M2A_SOCKET (PCIe 3.0 x4 / SATA)', key: 'M', supportedProtocols: ['NVMe_PCIe3', 'SATA'] }
    ],
    cpuPowerConnector: '8-pin',
    mainPowerConnector: '24-pin',
    pcbColor: '#1e1b18',
    heatsinkColor: '#52525b',
  },
  {
    id: 'mb-msi-b660m-mortar-ddr4',
    name: 'MSI MAG B660M Mortar DDR4',
    category: 'motherboard',
    manufacturer: 'MSI',
    model: 'MAG B660M Mortar DDR4',
    summary: 'Placa-mãe Intel LGA 1700 Micro-ATX com suporte a memórias DDR4 e processadores Core de 12ª a 14ª geração.',
    functionInPc: 'Conecta processadores Intel Alder Lake / Raptor Lake mantendo compatibilidade com módulos DDR4.',
    handlingPrecautions: [
      'Atenção redobrada aos 1700 pinos elásticos no próprio socket da placa-mãe (LGA). Nunca toque nos pinos do socket!',
      'Para CPUs de 14ª geração, verifique se a BIOS foi atualizada.'
    ],
    curiosities: [
      'A plataforma LGA 1700 permite placas-mãe com slots DDR4 ou DDR5, mas nunca os dois tipos simultaneamente na mesma placa comercial padrão.'
    ],
    colorAccent: '#38bdf8',
    socket: 'LGA1700',
    platform: 'Intel',
    chipset: 'B660',
    formFactor: 'Micro-ATX',
    supportedCpuGenerations: ['Intel Core 12ª Geração', 'Intel Core 13ª Geração', 'Intel Core 14ª Geração'],
    shippedBiosVersion: '1.00',
    latestBiosVersion: '1.G0',
    ramGeneration: 'DDR4',
    ramFormFactor: 'DIMM',
    ramSlots: 4,
    maxRamCapacityGb: 128,
    maxRamSpeedMhz: 4800,
    pcieX16Slots: 2,
    pcieGeneration: 4,
    pcieX1Slots: 1,
    sataPorts: 6,
    m2Slots: [
      { id: 'slot_m2_1', label: 'M2_1 (PCIe 4.0 x4 apenas NVMe)', key: 'M', supportedProtocols: ['NVMe_PCIe4', 'NVMe_PCIe3'] },
      { id: 'slot_m2_2', label: 'M2_2 (PCIe 4.0 x4 / SATA)', key: 'M', supportedProtocols: ['NVMe_PCIe4', 'NVMe_PCIe3', 'SATA'], sharesBandwidthWithSataPort: 8 }
    ],
    cpuPowerConnector: '8-pin',
    mainPowerConnector: '24-pin',
    pcbColor: '#0f172a',
    heatsinkColor: '#cbd5e1',
  },
  {
    id: 'mb-asus-rog-z790-hero-ddr5',
    name: 'ASUS ROG Maximus Z790 Hero (DDR5)',
    category: 'motherboard',
    manufacturer: 'ASUS',
    model: 'ROG Maximus Z790 Hero',
    summary: 'Placa-mãe ATX de alto desempenho com socket Intel LGA 1700, suporte exclusivo a DDR5 e PCIe 5.0.',
    functionInPc: 'Base ATX entusiasta para 12ª, 13ª e 14ª geração Intel Core com VRM robusto e suporte a módulos DDR5.',
    handlingPrecautions: [
      'Exige gabinete compatível com o formato ATX completo (305 x 244 mm).',
      'Aceita exclusivamente módulos DDR5 de 288 pinos (incompatível com DDR4).'
    ],
    curiosities: [
      'Embora DDR4 e DDR5 possuam 288 pinos, a posição do entalhe (chave física) e o gerenciamento de energia (PMIC no módulo DDR5) são diferentes.'
    ],
    colorAccent: '#ef4444',
    socket: 'LGA1700',
    platform: 'Intel',
    chipset: 'Z790',
    formFactor: 'ATX',
    supportedCpuGenerations: ['Intel Core 12ª Geração', 'Intel Core 13ª Geração', 'Intel Core 14ª Geração'],
    shippedBiosVersion: '1801',
    latestBiosVersion: '2202',
    ramGeneration: 'DDR5',
    ramFormFactor: 'DIMM',
    ramSlots: 4,
    maxRamCapacityGb: 192,
    maxRamSpeedMhz: 7800,
    pcieX16Slots: 2,
    pcieGeneration: 5,
    pcieX1Slots: 1,
    sataPorts: 6,
    m2Slots: [
      { id: 'slot_m2_1', label: 'M.2_1 (PCIe 4.0 NVMe Exclusivo)', key: 'M', supportedProtocols: ['NVMe_PCIe4', 'NVMe_PCIe3'] },
      { id: 'slot_m2_2', label: 'M.2_2 (PCIe 4.0 NVMe Exclusivo)', key: 'M', supportedProtocols: ['NVMe_PCIe4', 'NVMe_PCIe3'] }
    ],
    cpuPowerConnector: '8+4-pin',
    mainPowerConnector: '24-pin',
    pcbColor: '#09090b',
    heatsinkColor: '#1e293b',
  },
  {
    id: 'mb-asrock-b650m-pg-riptide',
    name: 'ASRock B650M PG Riptide (AM5 DDR5)',
    category: 'motherboard',
    manufacturer: 'ASRock',
    model: 'B650M PG Riptide',
    summary: 'Placa-mãe AMD Socket AM5 (LGA 1718) em formato Micro-ATX com suporte exclusivo a memórias DDR5.',
    functionInPc: 'Suporta processadores AMD Ryzen séries 7000 e 9000 utilizando o novo socket LGA AM5 e DDR5.',
    handlingPrecautions: [
      'Ao contrário do AM4 (PGA), o socket AM5 é LGA: os pinos ficam na placa-mãe. Manuseie a tampa protetora com cuidado.'
    ],
    curiosities: [
      'A plataforma AM5 abandonou completamente o suporte a DDR4 e a SSDs M.2 SATA na maioria das placas modernas.'
    ],
    colorAccent: '#10b981',
    socket: 'AM5',
    platform: 'AMD',
    chipset: 'B650',
    formFactor: 'Micro-ATX',
    supportedCpuGenerations: ['Ryzen 7000', 'Ryzen 9000'],
    shippedBiosVersion: '2.02',
    latestBiosVersion: '3.06',
    ramGeneration: 'DDR5',
    ramFormFactor: 'DIMM',
    ramSlots: 4,
    maxRamCapacityGb: 192,
    maxRamSpeedMhz: 7200,
    pcieX16Slots: 2,
    pcieGeneration: 4,
    pcieX1Slots: 2,
    sataPorts: 4,
    m2Slots: [
      { id: 'slot_m2_1', label: 'Blazing M.2 (PCIe 5.0 x4 NVMe)', key: 'M', supportedProtocols: ['NVMe_PCIe5', 'NVMe_PCIe4', 'NVMe_PCIe3'] },
      { id: 'slot_m2_2', label: 'Hyper M.2 (PCIe 4.0 x4 NVMe)', key: 'M', supportedProtocols: ['NVMe_PCIe4', 'NVMe_PCIe3'] }
    ],
    cpuPowerConnector: '8-pin',
    mainPowerConnector: '24-pin',
    pcbColor: '#0f172a',
    heatsinkColor: '#334155',
  },
  {
    id: 'mb-asus-rog-strix-x670e-i',
    name: 'ASUS ROG Strix X670E-I Gaming WiFi (Mini-ITX)',
    category: 'motherboard',
    manufacturer: 'ASUS',
    model: 'ROG Strix X670E-I Gaming WiFi',
    summary: 'Placa-mãe ultracompacta Mini-ITX (170 x 170 mm) para AMD AM5 com 2 slots DDR5 e PCIe 5.0.',
    functionInPc: 'Permite montar computadores compactos (SFF) de alto desempenho com 2 slots de RAM DDR5 e 1 slot PCIe 5.0 x16.',
    handlingPrecautions: [
      'Possui apenas 2 slots de memória RAM devido ao espaço reduzido do formato Mini-ITX.',
      'Requer atenção especial à altura do cooler e ao fluxo de ar.'
    ],
    curiosities: [
      'O formato Mini-ITX utiliza apenas 4 parafusos de fixação e cabe em praticamente qualquer gabinete ATX, Micro-ATX ou Mini-ITX.'
    ],
    colorAccent: '#ec4899',
    socket: 'AM5',
    platform: 'AMD',
    chipset: 'X670E',
    formFactor: 'Mini-ITX',
    supportedCpuGenerations: ['Ryzen 7000', 'Ryzen 9000'],
    shippedBiosVersion: '1616',
    latestBiosVersion: '3014',
    ramGeneration: 'DDR5',
    ramFormFactor: 'DIMM',
    ramSlots: 2,
    maxRamCapacityGb: 96,
    maxRamSpeedMhz: 8000,
    pcieX16Slots: 1,
    pcieGeneration: 5,
    pcieX1Slots: 0,
    sataPorts: 2,
    m2Slots: [
      { id: 'slot_m2_1', label: 'M.2_1 (PCIe 5.0 NVMe)', key: 'M', supportedProtocols: ['NVMe_PCIe5', 'NVMe_PCIe4', 'NVMe_PCIe3'] },
      { id: 'slot_m2_2', label: 'M.2_2 (PCIe 4.0 NVMe)', key: 'M', supportedProtocols: ['NVMe_PCIe4', 'NVMe_PCIe3'] }
    ],
    cpuPowerConnector: '8-pin',
    mainPowerConnector: '24-pin',
    pcbColor: '#18181b',
    heatsinkColor: '#27272a',
  },
  {
    id: 'mb-gigabyte-z890-aorus-elite',
    name: 'Gigabyte Z890 Aorus Elite WiFi7 (LGA 1851)',
    category: 'motherboard',
    manufacturer: 'Gigabyte',
    model: 'Z890 Aorus Elite WiFi7',
    summary: 'Placa-mãe ATX de nova geração com socket Intel LGA 1851 para processadores Intel Core Ultra (Série 2).',
    functionInPc: 'Suporta a arquitetura Arrow Lake (LGA 1851), memórias DDR5 de alta velocidade e armazenamento PCIe 5.0.',
    handlingPrecautions: [
      'Embora tenha as mesmas dimensões externas do cooler LGA 1700, o socket LGA 1851 possui 1851 pinos e só aceita CPUs Core Ultra 200S.'
    ],
    curiosities: [
      'A geração LGA 1851 marca a transição completa da Intel em desktops para arquiteturas desagregadas em chiplets (tiles).'
    ],
    colorAccent: '#6366f1',
    socket: 'LGA1851',
    platform: 'Intel',
    chipset: 'Z890',
    formFactor: 'ATX',
    supportedCpuGenerations: ['Intel Core Ultra Série 200S'],
    shippedBiosVersion: 'F1',
    latestBiosVersion: 'F4',
    ramGeneration: 'DDR5',
    ramFormFactor: 'DIMM',
    ramSlots: 4,
    maxRamCapacityGb: 256,
    maxRamSpeedMhz: 8800,
    pcieX16Slots: 2,
    pcieGeneration: 5,
    pcieX1Slots: 1,
    sataPorts: 4,
    m2Slots: [
      { id: 'slot_m2_1', label: 'M2A_CPU (PCIe 5.0 x4 NVMe)', key: 'M', supportedProtocols: ['NVMe_PCIe5', 'NVMe_PCIe4', 'NVMe_PCIe3'] },
      { id: 'slot_m2_2', label: 'M2B_CPU (PCIe 4.0 x4 NVMe)', key: 'M', supportedProtocols: ['NVMe_PCIe4', 'NVMe_PCIe3'] }
    ],
    cpuPowerConnector: '8+4-pin',
    mainPowerConnector: '24-pin',
    pcbColor: '#090d16',
    heatsinkColor: '#475569',
  },
  {
    id: 'mb-asus-prime-h410m-e-lga1200',
    name: 'ASUS Prime H410M-E (LGA 1200)',
    category: 'motherboard',
    manufacturer: 'ASUS',
    model: 'Prime H410M-E',
    summary: 'Placa-mãe Micro-ATX de entrada para processadores Intel Core de 10ª geração (Comet Lake, Socket LGA 1200).',
    functionInPc: 'Conecta CPUs LGA 1200 de 10ª geração com 2 slots de memória DDR4 e 1 slot M.2.',
    handlingPrecautions: [
      'O chipset H410 suporta 10ª geração Intel Core, mas não suporta processadores de 11ª geração (Rocket Lake) mesmo sendo ambos LGA 1200!'
    ],
    curiosities: [
      'Excelente exemplo didático de como o mesmo socket físico (LGA 1200) pode ter restrição de compatibilidade por chipset (H410 vs B560).'
    ],
    colorAccent: '#0ea5e9',
    socket: 'LGA1200',
    platform: 'Intel',
    chipset: 'H410',
    formFactor: 'Micro-ATX',
    supportedCpuGenerations: ['Intel Core 10ª Geração'],
    shippedBiosVersion: '1401',
    latestBiosVersion: '1620',
    ramGeneration: 'DDR4',
    ramFormFactor: 'DIMM',
    ramSlots: 2,
    maxRamCapacityGb: 64,
    maxRamSpeedMhz: 2933,
    pcieX16Slots: 1,
    pcieGeneration: 3,
    pcieX1Slots: 2,
    sataPorts: 4,
    m2Slots: [
      { id: 'slot_m2_1', label: 'M.2_1 (PCIe 3.0 x2 / SATA)', key: 'B+M', supportedProtocols: ['NVMe_PCIe3', 'SATA'], sharesBandwidthWithSataPort: 2 }
    ],
    cpuPowerConnector: '8-pin',
    mainPowerConnector: '24-pin',
    pcbColor: '#1e293b',
    heatsinkColor: '#94a3b8',
  },
  {
    id: 'mb-msi-z390-a-pro-lga1151',
    name: 'MSI Z390-A PRO (LGA 1151 v2)',
    category: 'motherboard',
    manufacturer: 'MSI',
    model: 'Z390-A PRO',
    summary: 'Placa-mãe ATX para Intel Core de 8ª e 9ª geração (Coffee Lake, Socket LGA 1151 v2).',
    functionInPc: 'Opera exclusivamente com processadores Intel de 8ª e 9ª geração em socket LGA 1151 revisado.',
    handlingPrecautions: [
      'Apesar de ter 1151 pinos, o chipset Z390 (LGA 1151 v2) é eletricamente incompatível com CPUs de 6ª e 7ª geração (Skylake/Kaby Lake).'
    ],
    curiosities: [
      'A revisão elétrica do LGA 1151 para a 8ª geração adicionou pinos de alimentação para suportar CPUs de 6 e 8 núcleos.'
    ],
    colorAccent: '#a855f7',
    socket: 'LGA1151',
    platform: 'Intel',
    chipset: 'Z390',
    formFactor: 'ATX',
    supportedCpuGenerations: ['Intel Core 8ª Geração', 'Intel Core 9ª Geração'],
    shippedBiosVersion: '1.80',
    latestBiosVersion: '1.E0',
    ramGeneration: 'DDR4',
    ramFormFactor: 'DIMM',
    ramSlots: 4,
    maxRamCapacityGb: 128,
    maxRamSpeedMhz: 4400,
    pcieX16Slots: 2,
    pcieGeneration: 3,
    pcieX1Slots: 4,
    sataPorts: 6,
    m2Slots: [
      { id: 'slot_m2_1', label: 'M2_1 (PCIe 3.0 x4 / SATA)', key: 'M', supportedProtocols: ['NVMe_PCIe3', 'SATA'] }
    ],
    cpuPowerConnector: '8-pin',
    mainPowerConnector: '24-pin',
    pcbColor: '#27201c',
    heatsinkColor: '#71717a',
  },
  {
    id: 'mb-gigabyte-970a-ds3p-am3plus',
    name: 'Gigabyte GA-970A-DS3P (AMD AM3+ DDR3)',
    category: 'motherboard',
    manufacturer: 'Gigabyte',
    model: 'GA-970A-DS3P',
    summary: 'Placa-mãe ATX clássica para processadores AMD FX (Socket AM3+) e memórias DDR3.',
    functionInPc: 'Exemplo histórico de arquitetura com Ponte Norte (Chipset AMD 970) e Ponte Sul (SB950) separadas, sem slot M.2 nativo.',
    handlingPrecautions: [
      'Não possui slots M.2; todo o armazenamento deve ser conectado via portas SATA 3.',
      'Os processadores AMD FX não possuem vídeo integrado: uma placa de vídeo dedicada PCIe é obrigatória!'
    ],
    curiosities: [
      'Diferente das placas modernas onde o controlador PCIe principal fica na CPU, aqui a Ponte Norte gerencia as linhas PCIe.'
    ],
    colorAccent: '#f97316',
    socket: 'AM3+',
    platform: 'AMD',
    chipset: 'AMD 970',
    formFactor: 'ATX',
    supportedCpuGenerations: ['AMD FX Vishera', 'AMD FX Zambezi', 'Phenom II'],
    shippedBiosVersion: 'FD',
    latestBiosVersion: 'FD',
    ramGeneration: 'DDR3',
    ramFormFactor: 'DIMM',
    ramSlots: 4,
    maxRamCapacityGb: 32,
    maxRamSpeedMhz: 2000,
    pcieX16Slots: 2,
    pcieGeneration: 2,
    pcieX1Slots: 3,
    sataPorts: 6,
    m2Slots: [],
    cpuPowerConnector: '4-pin',
    mainPowerConnector: '24-pin',
    pcbColor: '#0c2d48',
    heatsinkColor: '#38bdf8',
  },
  {
    id: 'mb-intel-dg41rq-lga775-ddr2',
    name: 'Intel Classic DG41RQ (LGA 775 DDR2)',
    category: 'motherboard',
    manufacturer: 'Intel',
    model: 'DG41RQ',
    summary: 'Placa-mãe legada Micro-ATX com socket LGA 775, chipset Intel G41 e slots de memória DDR2.',
    functionInPc: 'Demonstra a arquitetura clássica com Front Side Bus (FSB), controlador de memória na Ponte Norte (MCH) e memórias DDR2.',
    handlingPrecautions: [
      'Suporta apenas memórias DDR2 (240 pinos, 1.8V). Módulos DDR ou DDR3 possuem entalhes em posições diferentes.'
    ],
    curiosities: [
      'No socket LGA 775, o controlador de memória ainda não ficava dentro do processador, mas sim no chipset G41 (Northbridge).'
    ],
    colorAccent: '#14b8a6',
    socket: 'LGA775',
    platform: 'Intel',
    chipset: 'G41',
    formFactor: 'Micro-ATX',
    supportedCpuGenerations: ['Core 2 Quad', 'Core 2 Duo', 'Pentium Dual-Core'],
    shippedBiosVersion: 'RQG4110H',
    latestBiosVersion: 'RQG4110H',
    ramGeneration: 'DDR2',
    ramFormFactor: 'DIMM',
    ramSlots: 2,
    maxRamCapacityGb: 8,
    maxRamSpeedMhz: 800,
    pcieX16Slots: 1,
    pcieGeneration: 2,
    pcieX1Slots: 1,
    sataPorts: 4,
    m2Slots: [],
    cpuPowerConnector: '4-pin',
    mainPowerConnector: '24-pin',
    pcbColor: '#064e3b',
    heatsinkColor: '#9ca3af',
  },
  {
    id: 'mb-didactic-oem-unverified-lga775',
    name: 'Placa OEM Industrial Rev.0 (Dados Incompletos / DDR)',
    category: 'motherboard',
    manufacturer: 'Genérica / OEM Didática',
    model: 'OEM-775-DDR1-REV0',
    isDidacticGeneric: true,
    summary: 'Modelo didático de placa OEM sem documentação completa do fabricante sobre limite de TDP e tabela de microcódigo BIOS.',
    functionInPc: 'Utilizada no laboratório para demonstrar memórias DDR de 1ª geração (184 pinos) e o comportamento do sistema de diagnóstico quando faltam dados técnicos verificáveis.',
    handlingPrecautions: [
      'Nunca assuma compatibilidade em placas OEM sem consultar a lista oficial de CPUs suportadas (QVL) e limites térmicos do VRM.'
    ],
    curiosities: [
      'Muitas placas de computadores corporativos antigos utilizavam BIOS restritas sem documentação pública de suporte a processadores Quad-Core.'
    ],
    colorAccent: '#eab308',
    incompleteSpecsWarning: 'A tabela oficial de suporte de microcódigo BIOS e limite máximo de potência (TDP) do VRM desta placa OEM não está disponível na documentação técnica.',
    socket: 'LGA775',
    platform: 'Intel',
    chipset: '865G-OEM',
    formFactor: 'Micro-ATX',
    supportedCpuGenerations: [], // Vazio para acionar verificação de dados insuficientes
    shippedBiosVersion: 'OEM-UNVERIFIED',
    latestBiosVersion: 'OEM-UNVERIFIED',
    ramGeneration: 'DDR',
    ramFormFactor: 'DIMM',
    ramSlots: 2,
    maxRamCapacityGb: null,
    maxRamSpeedMhz: 400,
    pcieX16Slots: 1,
    pcieGeneration: 3,
    pcieX1Slots: 1,
    sataPorts: 2,
    m2Slots: [],
    cpuPowerConnector: '4-pin',
    mainPowerConnector: '24-pin',
    pcbColor: '#166534',
    heatsinkColor: '#ca8a04',
  }
];

export const CPUS: CpuSpec[] = [
  {
    id: 'cpu-amd-ryzen-5-5600x',
    name: 'AMD Ryzen 5 5600X',
    category: 'cpu',
    manufacturer: 'AMD',
    model: 'Ryzen 5 5600X',
    summary: 'Processador de 6 núcleos e 12 threads baseado na arquitetura Zen 3 (Socket AM4). Não possui vídeo integrado.',
    functionInPc: 'Executa instruções de programas, cálculos lógicos/aritméticos (ULA) e gerencia 24 linhas PCIe 4.0 e o controlador de memória DDR4.',
    handlingPrecautions: [
      'Possui 1331 pinos metálicos na base (PGA). Nunca toque ou entorte os pinos.',
      'Alinhe o triângulo dourado do processador com a marcação do socket AM4 antes de baixar a alavanca.',
      'Exige placa de vídeo dedicada pois não possui gráficos integrados.'
    ],
    curiosities: [
      'A arquitetura Zen 3 unificou o cache L3 de 32 MB em um único complexo (CCX) acessível pelos 6 núcleos, reduzindo drasticamente a latência.'
    ],
    colorAccent: '#f97316',
    socket: 'AM4',
    generation: 'Ryzen 5000',
    architecture: 'Zen 3 (Vermeer, 7nm)',
    cores: 6,
    threads: 12,
    baseClockGhz: 3.7,
    boostClockGhz: 4.6,
    cacheMb: 35,
    tdpWatts: 65,
    supportedRamTypes: ['DDR4'],
    hasIntegratedGraphics: false,
    compatibleChipsets: ['B450', 'X470', 'B550', 'X570', 'A520'],
    minBiosVersionByChipset: {
      B450: 'F60',
      B550: '1004'
    }
  },
  {
    id: 'cpu-amd-ryzen-5-3600',
    name: 'AMD Ryzen 5 3600',
    category: 'cpu',
    manufacturer: 'AMD',
    model: 'Ryzen 5 3600',
    summary: 'Processador de 6 núcleos e 12 threads Zen 2 (Socket AM4), compatível nativamente com B450 (BIOS F40+) e B550.',
    functionInPc: 'Unidade central de processamento AM4 de 65W; exige GPU dedicada para exibição de vídeo.',
    handlingPrecautions: [
      'Aplique pasta térmica sobre o difusor térmico integrado (IHS) antes de instalar o cooler.'
    ],
    curiosities: [
      'Foi o primeiro processador mainstream a trazer suporte a PCIe 4.0 em desktops.'
    ],
    colorAccent: '#f97316',
    socket: 'AM4',
    generation: 'Ryzen 3000',
    architecture: 'Zen 2 (Matisse, 7nm)',
    cores: 6,
    threads: 12,
    baseClockGhz: 3.6,
    boostClockGhz: 4.2,
    cacheMb: 35,
    tdpWatts: 65,
    supportedRamTypes: ['DDR4'],
    hasIntegratedGraphics: false,
    compatibleChipsets: ['B350', 'B450', 'X470', 'B550', 'X570'],
    minBiosVersionByChipset: {
      B450: 'F40',
      B550: '0301'
    }
  },
  {
    id: 'cpu-amd-ryzen-7-5800x3d',
    name: 'AMD Ryzen 7 5800X3D (3D V-Cache)',
    category: 'cpu',
    manufacturer: 'AMD',
    model: 'Ryzen 7 5800X3D',
    summary: 'Processador AM4 de 8 núcleos e 16 threads com 96 MB de cache L3 empilhado verticalmente (3D V-Cache).',
    functionInPc: 'Acelera cargas sensíveis a latência de memória mantendo um grande volume de dados no cache L3 dentro do pacote da CPU.',
    handlingPrecautions: [
      'TDP de 105W: requer um cooler de torre eficiente ou refrigeração líquida (não acompanha cooler box).',
      'Requer BIOS atualizada em placas B450 e B550.'
    ],
    curiosities: [
      'Empilha 64 MB extras de SRAM diretamente no topo do CCD Zen 3 usando ligações diretas cobre-a-cobre (TSV).'
    ],
    colorAccent: '#ea580c',
    socket: 'AM4',
    generation: 'Ryzen 5000',
    architecture: 'Zen 3 com 3D V-Cache (7nm)',
    cores: 8,
    threads: 16,
    baseClockGhz: 3.4,
    boostClockGhz: 4.5,
    cacheMb: 100,
    tdpWatts: 105,
    supportedRamTypes: ['DDR4'],
    hasIntegratedGraphics: false,
    compatibleChipsets: ['B450', 'X470', 'B550', 'X570'],
    minBiosVersionByChipset: {
      B450: 'F62',
      B550: '2423'
    }
  },
  {
    id: 'cpu-intel-i5-12400f',
    name: 'Intel Core i5-12400F (LGA 1700)',
    category: 'cpu',
    manufacturer: 'Intel',
    model: 'Core i5-12400F',
    summary: 'Processador Intel de 12ª geração com 6 núcleos de performance (12 threads) para socket LGA 1700. Suporta DDR4 e DDR5.',
    functionInPc: 'Processador versátil cujo controlador de memória integrado (IMC) suporta tanto placas-mãe LGA 1700 DDR4 quanto DDR5.',
    handlingPrecautions: [
      'O sufixo "F" indica ausência de gráficos integrados: é obrigatório instalar uma placa de vídeo dedicada!',
      'Posicione os 4 entalhes laterais do substrato alinhados às guias do socket LGA 1700.'
    ],
    curiosities: [
      'Possui controlador híbrido capaz de operar com DDR4-3200 ou DDR5-4800 dependendo da placa-mãe escolhida.'
    ],
    colorAccent: '#0284c7',
    socket: 'LGA1700',
    generation: 'Intel Core 12ª Geração',
    architecture: 'Alder Lake (Intel 7)',
    cores: 6,
    threads: 12,
    baseClockGhz: 2.5,
    boostClockGhz: 4.4,
    cacheMb: 18,
    tdpWatts: 65,
    supportedRamTypes: ['DDR4', 'DDR5'],
    hasIntegratedGraphics: false,
    compatibleChipsets: ['H610', 'B660', 'H670', 'Z690', 'B760', 'Z790'],
    minBiosVersionByChipset: {
      B660: '1.00',
      Z790: '0101'
    }
  },
  {
    id: 'cpu-intel-i5-14600k',
    name: 'Intel Core i5-14600K (LGA 1700)',
    category: 'cpu',
    manufacturer: 'Intel',
    model: 'Core i5-14600K',
    summary: 'Processador híbrido de 14 núcleos (6 P-Cores + 8 E-Cores) e 20 threads com vídeo integrado Intel UHD 770.',
    functionInPc: 'Combina núcleos de alto desempenho para tarefas críticas e núcleos eficientes para multitarefa em segundo plano.',
    handlingPrecautions: [
      'Exige atualização de BIOS em placas-mãe da série 600 (como B660) lançadas antes da 14ª geração.',
      'TDP base de 125W (podendo atingir 181W em Turbo): utilize cooler de torre robusto ou Water Cooler.'
    ],
    curiosities: [
      'O Intel Thread Director orienta o escalonador do sistema operacional sobre qual thread alocar nos P-Cores ou E-Cores.'
    ],
    colorAccent: '#2563eb',
    socket: 'LGA1700',
    generation: 'Intel Core 14ª Geração',
    architecture: 'Raptor Lake Refresh (Intel 7)',
    cores: 14,
    threads: 20,
    baseClockGhz: 3.5,
    boostClockGhz: 5.3,
    cacheMb: 24,
    tdpWatts: 125,
    supportedRamTypes: ['DDR4', 'DDR5'],
    hasIntegratedGraphics: true,
    integratedGraphicsName: 'Intel UHD Graphics 770',
    compatibleChipsets: ['B660', 'Z690', 'B760', 'Z790'],
    minBiosVersionByChipset: {
      B660: '1.D0',
      Z790: '1402'
    }
  },
  {
    id: 'cpu-amd-ryzen-5-7600x',
    name: 'AMD Ryzen 5 7600X (AM5)',
    category: 'cpu',
    manufacturer: 'AMD',
    model: 'Ryzen 5 7600X',
    summary: 'Processador de 6 núcleos e 12 threads Zen 4 para o socket LGA AM5, com gráficos RDNA 2 integrados e suporte exclusivo a DDR5.',
    functionInPc: 'Processador moderno de 5nm que opera exclusivamente com memórias DDR5 e barramentos PCIe 5.0.',
    handlingPrecautions: [
      'Utiliza pacote LGA 1718 (sem pinos no processador). Alinhe o triângulo superior esquerdo com o socket AM5.',
      'Incompatível com placas-mãe AM4 ou memórias DDR4.'
    ],
    curiosities: [
      'A partir da série Ryzen 7000, quase todos os processadores desktop padrão trazem uma GPU RDNA 2 integrada no I/O Die para diagnóstico e vídeo básico.'
    ],
    colorAccent: '#10b981',
    socket: 'AM5',
    generation: 'Ryzen 7000',
    architecture: 'Zen 4 (Raphael, 5nm)',
    cores: 6,
    threads: 12,
    baseClockGhz: 4.7,
    boostClockGhz: 5.3,
    cacheMb: 38,
    tdpWatts: 105,
    supportedRamTypes: ['DDR5'],
    hasIntegratedGraphics: true,
    integratedGraphicsName: 'AMD Radeon Graphics (2 CUs RDNA 2)',
    compatibleChipsets: ['A620', 'B650', 'B650E', 'X670', 'X670E', 'X870']
  },
  {
    id: 'cpu-amd-ryzen-7-7800x3d',
    name: 'AMD Ryzen 7 7800X3D (AM5)',
    category: 'cpu',
    manufacturer: 'AMD',
    model: 'Ryzen 7 7800X3D',
    summary: 'Processador entusiasta AM5 de 8 núcleos, 16 threads e 96 MB de cache L3 com gráficos integrados.',
    functionInPc: 'Maximiza a taxa de acerto de cache (cache hit) reduzindo acessos à memória RAM principal DDR5.',
    handlingPrecautions: [
      'TDP de 120W: requer cooler de alto desempenho compatível com a furação AM5.'
    ],
    curiosities: [
      'Consome menos energia em jogos do que modelos sem 3D V-Cache porque acessos à SRAM interna gastam muito menos energia que transferências pelo barramento DDR5.'
    ],
    colorAccent: '#059669',
    socket: 'AM5',
    generation: 'Ryzen 7000',
    architecture: 'Zen 4 3D V-Cache (5nm)',
    cores: 8,
    threads: 16,
    baseClockGhz: 4.2,
    boostClockGhz: 5.0,
    cacheMb: 104,
    tdpWatts: 120,
    supportedRamTypes: ['DDR5'],
    hasIntegratedGraphics: true,
    integratedGraphicsName: 'AMD Radeon Graphics',
    compatibleChipsets: ['A620', 'B650', 'B650E', 'X670', 'X670E', 'X870']
  },
  {
    id: 'cpu-intel-ultra-7-265k',
    name: 'Intel Core Ultra 7 265K (LGA 1851)',
    category: 'cpu',
    manufacturer: 'Intel',
    model: 'Core Ultra 7 265K',
    summary: 'Processador de 20 núcleos (8 P-Cores + 12 E-Cores) para o novo socket LGA 1851 com NPU integrada e gráficos Intel.',
    functionInPc: 'Processador de arquitetura em tiles para placas-mãe série 800 (Z890) com suporte exclusivo a DDR5.',
    handlingPrecautions: [
      'Fisicamente do mesmo tamanho que o LGA 1700, mas possui 1851 contatos e entalhes deslocados: nunca tente instalar em uma placa Z790/B660!'
    ],
    curiosities: [
      'Removeu o Hyper-Threading nos P-Cores em favor de núcleos E-Core Skymont muito mais potentes e eficientes.'
    ],
    colorAccent: '#6366f1',
    socket: 'LGA1851',
    generation: 'Intel Core Ultra Série 200S',
    architecture: 'Arrow Lake (TSMC N3B)',
    cores: 20,
    threads: 20,
    baseClockGhz: 3.9,
    boostClockGhz: 5.5,
    cacheMb: 30,
    tdpWatts: 125,
    supportedRamTypes: ['DDR5'],
    hasIntegratedGraphics: true,
    integratedGraphicsName: 'Intel Graphics (Xe-LPG)',
    compatibleChipsets: ['Z890', 'B860']
  },
  {
    id: 'cpu-intel-i3-10100f',
    name: 'Intel Core i3-10100F (LGA 1200)',
    category: 'cpu',
    manufacturer: 'Intel',
    model: 'Core i3-10100F',
    summary: 'Processador quad-core (4 núcleos / 8 threads) de 10ª geração para socket LGA 1200, sem vídeo integrado.',
    functionInPc: 'Processador de entrada eficiente de 65W para plataformas H410/B460 com memória DDR4.',
    handlingPrecautions: [
      'Sufixo F: não possui vídeo integrado. Instale uma placa de vídeo dedicada PCIe.'
    ],
    curiosities: [
      'Trouxe a configuração de 4 núcleos e 8 threads (que na 7ª geração pertencia ao Core i7-7700) para a linha Core i3.'
    ],
    colorAccent: '#0ea5e9',
    socket: 'LGA1200',
    generation: 'Intel Core 10ª Geração',
    architecture: 'Comet Lake (14nm)',
    cores: 4,
    threads: 8,
    baseClockGhz: 3.6,
    boostClockGhz: 4.3,
    cacheMb: 6,
    tdpWatts: 65,
    supportedRamTypes: ['DDR4'],
    hasIntegratedGraphics: false,
    compatibleChipsets: ['H410', 'B460', 'Z490', 'H510', 'B560', 'Z590']
  },
  {
    id: 'cpu-intel-i7-9700k',
    name: 'Intel Core i7-9700K (LGA 1151 v2)',
    category: 'cpu',
    manufacturer: 'Intel',
    model: 'Core i7-9700K',
    summary: 'Processador de 8 núcleos e 8 threads de 9ª geração para socket LGA 1151 v2 (Chipsets série 300).',
    functionInPc: 'Opera em placas Z390/B360 com gráficos integrados Intel UHD 630 e memória DDR4.',
    handlingPrecautions: [
      'Compatível apenas com chipsets série 300 (H310, B360, Z370, Z390). Não funciona em placas série 100/200.'
    ],
    curiosities: [
      'Voltou a utilizar solda de índio (STIM) entre o die de silício e a tampa metálica (IHS) para melhorar a transferência térmica.'
    ],
    colorAccent: '#a855f7',
    socket: 'LGA1151',
    generation: 'Intel Core 9ª Geração',
    architecture: 'Coffee Lake Refresh (14nm)',
    cores: 8,
    threads: 8,
    baseClockGhz: 3.6,
    boostClockGhz: 4.9,
    cacheMb: 12,
    tdpWatts: 95,
    supportedRamTypes: ['DDR4'],
    hasIntegratedGraphics: true,
    integratedGraphicsName: 'Intel UHD Graphics 630',
    compatibleChipsets: ['H310', 'B360', 'H370', 'Z370', 'Z390']
  },
  {
    id: 'cpu-amd-fx-8350',
    name: 'AMD FX-8350 Black Edition (AM3+)',
    category: 'cpu',
    manufacturer: 'AMD',
    model: 'FX-8350',
    summary: 'Processador histórico de 8 núcleos (4 módulos Piledriver) para socket AM3+ e memória DDR3.',
    functionInPc: 'Opera em placas AM3+ (como chipset AMD 970) com TDP elevado de 125W.',
    handlingPrecautions: [
      'TDP de 125W: requer um cooler compatível com 125W ou mais (coolers básicos de 65W causarão superaquecimento!).',
      'Não possui gráficos integrados.'
    ],
    curiosities: [
      'Utilizava a microarquitetura modular Piledriver, onde cada módulo compartilhava uma unidade de ponto flutuante (FPU) entre dois núcleos inteiros.'
    ],
    colorAccent: '#ef4444',
    socket: 'AM3+',
    generation: 'AMD FX Vishera',
    architecture: 'Piledriver (32nm)',
    cores: 8,
    threads: 8,
    baseClockGhz: 4.0,
    boostClockGhz: 4.2,
    cacheMb: 16,
    tdpWatts: 125,
    supportedRamTypes: ['DDR3'],
    hasIntegratedGraphics: false,
    compatibleChipsets: ['AMD 970', 'AMD 990FX', 'AMD 760G']
  },
  {
    id: 'cpu-intel-q6600-lga775',
    name: 'Intel Core 2 Quad Q6600 (LGA 775)',
    category: 'cpu',
    manufacturer: 'Intel',
    model: 'Core 2 Quad Q6600',
    summary: 'Lendário processador de 4 núcleos para o socket LGA 775 (arquitetura Kentsfield, FSB 1066 MHz).',
    functionInPc: 'Comunica-se com a Ponte Norte via Front Side Bus (FSB), permitindo que o chipset controle memórias DDR, DDR2 ou DDR3 conforme a placa-mãe.',
    handlingPrecautions: [
      'Em placas OEM sem lista de suporte documentada, o consumo de 105W e o FSB de 1066 MHz podem não ser suportados.'
    ],
    curiosities: [
      'O Q6600 unia dois dies de Core 2 Duo (Conroe) no mesmo encapsulamento LGA 775 (Multi-Chip Module).'
    ],
    colorAccent: '#14b8a6',
    socket: 'LGA775',
    generation: 'Core 2 Quad',
    architecture: 'Kentsfield (65nm)',
    cores: 4,
    threads: 4,
    baseClockGhz: 2.4,
    boostClockGhz: 2.4,
    cacheMb: 8,
    tdpWatts: 105,
    supportedRamTypes: ['DDR', 'DDR2', 'DDR3'],
    hasIntegratedGraphics: true, // Nota didática: no LGA775 o vídeo integrado GMA X4500 fica no chipset G41 da placa-mãe!
    integratedGraphicsName: 'Vídeo via Chipset Northbridge (Intel GMA na Placa-Mãe)',
    compatibleChipsets: ['G41', 'P35', 'P45', 'G31']
  }
];

export const RAM_MODULES: RamSpec[] = [
  {
    id: 'ram-ddr1-1gb-400',
    name: 'Kingston ValueRAM 1GB DDR-400 (PC-3200)',
    category: 'ram',
    manufacturer: 'Kingston',
    model: 'KVR400X64C3A/1G',
    summary: 'Módulo de memória DDR de 1ª geração (184 pinos, 2.5V) para sistemas legados.',
    functionInPc: 'Armazena dados voláteis transferindo dois pulsos de dados por ciclo de clock (Double Data Rate original).',
    handlingPrecautions: [
      'Opera a 2.5V e possui 184 contatos com entalhe físico deslocado: jamais encaixa em slots DDR2, DDR3, DDR4 ou DDR5.'
    ],
    curiosities: [
      'A primeira geração DDR operava a 2.5V ou 2.6V, mais que o dobro da tensão da DDR5 atual (1.1V).'
    ],
    colorAccent: '#16a34a',
    generation: 'DDR',
    capacityGb: 1,
    speedMTs: 400,
    formFactor: 'DIMM',
    voltageV: 2.5,
    casLatency: 'CL3',
    pins: 184,
    notchPositionRatio: 0.12,
    hasHeatspreader: false,
    heatspreaderColor: '#15803d',
  },
  {
    id: 'ram-ddr2-2gb-800',
    name: 'Corsair XMS2 2GB DDR2-800 (PC2-6400)',
    category: 'ram',
    manufacturer: 'Corsair',
    model: 'CM2X2048-6400C5',
    summary: 'Módulo de memória DDR2 de 240 pinos e 1.8V, compatível com plataformas como LGA 775 (Chipset G41).',
    functionInPc: 'Memória principal volátil para plataformas de meados dos anos 2000.',
    handlingPrecautions: [
      'Embora DDR2 e DDR3 tenham ambas 240 pinos, o entalhe (key notch) fica em posições diferentes para impedir danos elétricos.'
    ],
    curiosities: [
      'A DDR2 dobrou o buffer de pré-busca (prefetch) interno de 2 bits para 4 bits e reduziu a tensão para 1.8V.'
    ],
    colorAccent: '#ca8a04',
    generation: 'DDR2',
    capacityGb: 2,
    speedMTs: 800,
    formFactor: 'DIMM',
    voltageV: 1.8,
    casLatency: 'CL5',
    pins: 240,
    notchPositionRatio: 0.02,
    hasHeatspreader: true,
    heatspreaderColor: '#3f3f46',
  },
  {
    id: 'ram-ddr3-8gb-1600',
    name: 'HyperX Fury 8GB DDR3-1600 (PC3-12800)',
    category: 'ram',
    manufacturer: 'Kingston HyperX',
    model: 'HX316C10FB/8',
    summary: 'Módulo DIMM DDR3 de 240 pinos e 1.5V para plataformas como AMD AM3+ e Intel antigas.',
    functionInPc: 'Fornece 8 GB de memória volátil de acesso rápido operando a 1600 MT/s.',
    handlingPrecautions: [
      'O entalhe da DDR3 fica mais à esquerda que na DDR2 e é totalmente incompatível com slots DDR4 (288 pinos).'
    ],
    curiosities: [
      'Introduziu o prefetch de 8 bits e reduziu a tensão padrão para 1.5V (ou 1.35V na variante DDR3L).'
    ],
    colorAccent: '#2563eb',
    generation: 'DDR3',
    capacityGb: 8,
    speedMTs: 1600,
    formFactor: 'DIMM',
    voltageV: 1.5,
    casLatency: 'CL10',
    pins: 240,
    notchPositionRatio: -0.16,
    hasHeatspreader: true,
    heatspreaderColor: '#1d4ed8',
  },
  {
    id: 'ram-ddr4-16gb-3200',
    name: 'Corsair Vengeance LPX 16GB DDR4-3200',
    category: 'ram',
    manufacturer: 'Corsair',
    model: 'CMK16GX4M1E3200C16',
    summary: 'Módulo DIMM DDR4 de 288 pinos, 16 GB, 3200 MT/s (1.2V/1.35V XMP), padrão amplamente utilizado em AM4 e LGA 1700 DDR4.',
    functionInPc: 'Armazena o sistema operacional ativo, aplicativos abertos e dados em uso imediato pelo processador.',
    handlingPrecautions: [
      'Abra as travas laterais do slot DIMM, alinhe o entalhe central-direito de 288 pinos e pressione até ouvir o clique.'
    ],
    curiosities: [
      'Os contatos inferiores da DDR4 possuem uma leve curvatura (borda escalonada) para reduzir a força mecânica necessária na inserção.'
    ],
    colorAccent: '#f59e0b',
    generation: 'DDR4',
    capacityGb: 16,
    speedMTs: 3200,
    formFactor: 'DIMM',
    voltageV: 1.2,
    casLatency: 'CL16',
    pins: 288,
    notchPositionRatio: 0.08,
    hasHeatspreader: true,
    heatspreaderColor: '#18181b',
  },
  {
    id: 'ram-ddr5-16gb-6000',
    name: 'G.Skill Trident Z5 16GB DDR5-6000',
    category: 'ram',
    manufacturer: 'G.Skill',
    model: 'F5-6000J3038F16G',
    summary: 'Módulo DIMM DDR5 de 288 pinos, 6000 MT/s e 1.1V nominal com circuito PMIC integrado no próprio pente.',
    functionInPc: 'Opera com dois subcanais independentes de 32 bits (mais ECC on-die) em plataformas AM5, LGA 1700 DDR5 e LGA 1851.',
    handlingPrecautions: [
      'Embora possua 288 pinos como a DDR4, o entalhe físico da DDR5 está em posição diferente e não encaixa em placas DDR4.'
    ],
    curiosities: [
      'Diferente das gerações anteriores onde a placa-mãe regulava a tensão da RAM, cada pente DDR5 possui seu próprio chip regulador de tensão (PMIC).'
    ],
    colorAccent: '#10b981',
    generation: 'DDR5',
    capacityGb: 16,
    speedMTs: 6000,
    formFactor: 'DIMM',
    voltageV: 1.1,
    casLatency: 'CL30',
    pins: 288,
    notchPositionRatio: -0.05,
    hasHeatspreader: true,
    heatspreaderColor: '#e2e8f0',
  },
  {
    id: 'ram-ddr4-sodimm-8gb-notebook',
    name: 'Crucial 8GB DDR4-3200 SO-DIMM (Formato Notebook)',
    category: 'ram',
    manufacturer: 'Crucial',
    model: 'CT8G4SFRA32A',
    summary: 'Módulo compacto SO-DIMM de 260 pinos projetado para notebooks e mini-PCs (incompatível com slots DIMM de desktop).',
    functionInPc: 'Incluído no catálogo para ensinar a diferença física entre o formato SO-DIMM (67,6 mm) e o DIMM de desktop (133,35 mm).',
    handlingPrecautions: [
      'Não pode ser instalado em slots DIMM convencionais de placas-mãe de desktop devido ao comprimento reduzido e 260 contatos.'
    ],
    curiosities: [
      'Módulos SO-DIMM têm cerca da metade do comprimento de um módulo DIMM padrão.'
    ],
    colorAccent: '#ec4899',
    generation: 'DDR4',
    capacityGb: 8,
    speedMTs: 3200,
    formFactor: 'SO-DIMM',
    voltageV: 1.2,
    casLatency: 'CL22',
    pins: 260,
    notchPositionRatio: 0.1,
    hasHeatspreader: false,
    heatspreaderColor: '#065f46',
  },
  {
    id: 'ram-ddr4-defective-sim',
    name: 'Módulo DDR4 8GB (Com Falha Simulada de Célula / Diagnóstico)',
    category: 'ram',
    manufacturer: 'Laboratório ITIC',
    model: 'DIAG-DDR4-ERR',
    isDidacticGeneric: true,
    summary: 'Módulo DDR4 utilizado nos cenários de manutenção para simular falha de paridade/endereçamento durante o POST.',
    functionInPc: 'Quando instalado, provoca erro de verificação de memória no POST (bipes contínuos / LED DRAM aceso).',
    handlingPrecautions: [
      'Identifique e substitua este módulo defeituoso durante o Modo de Diagnóstico.'
    ],
    curiosities: [
      'Erros severos nas primeiras posições de memória impedem o BIOS/UEFI de concluir o POST e inicializar o vídeo.'
    ],
    colorAccent: '#ef4444',
    generation: 'DDR4',
    capacityGb: 8,
    speedMTs: 2666,
    formFactor: 'DIMM',
    voltageV: 1.2,
    casLatency: 'CL19',
    pins: 288,
    notchPositionRatio: 0.08,
    hasHeatspreader: false,
    heatspreaderColor: '#7f1d1d',
    isSimulatedDefective: true,
  }
];

export const STORAGE_DEVICES: StorageSpec[] = [
  {
    id: 'storage-hdd-seagate-2tb-35',
    name: 'Seagate BarraCuda 2TB (HDD 3,5" 7200 RPM SATA)',
    category: 'storage',
    manufacturer: 'Seagate',
    model: 'ST2000DM008',
    summary: 'Disco rígido magnético tradicional de 3,5 polegadas com pratos girando a 7200 RPM, braço atuador e cabeças de leitura/escrita.',
    functionInPc: 'Armazenamento não-volátil de alta capacidade que grava dados magneticamente em trilhas e setores circulares.',
    handlingPrecautions: [
      'Extremamente sensível a impactos físicos, especialmente quando ligado (a cabeça flutua a nanômetros do prato!).',
      'Exige dois cabos: cabo de dados SATA ligado à placa-mãe e cabo de alimentação SATA vindo da fonte.'
    ],
    curiosities: [
      'A 7200 rotações por minuto, os pratos completam 120 voltas a cada segundo. O tempo médio de busca mecânica (seek) fica entre 8 e 12 milissegundos.'
    ],
    colorAccent: '#10b981',
    storageType: 'HDD',
    capacityGb: 2000,
    formFactor: '3.5_INCH',
    interface: 'SATA_3',
    protocol: 'AHCI/SATA',
    m2Key: 'NONE',
    rpm: 7200,
    readSpeedMBs: 215,
    writeSpeedMBs: 210,
    requiresSataPowerAndDataCable: true,
    powerConsumptionWatts: 6.8,
  },
  {
    id: 'storage-hdd-wd-blue-1tb-25',
    name: 'WD Blue 1TB (HDD 2,5" 5400 RPM SATA)',
    category: 'storage',
    manufacturer: 'Western Digital',
    model: 'WD10SPZX',
    summary: 'Disco rígido mecânico compacto de 2,5 polegadas operando a 5400 RPM via interface SATA III.',
    functionInPc: 'Armazenamento magnético compacto com menor consumo energético, utilizando a mesma interface SATA de 3,5".',
    handlingPrecautions: [
      'Embora menor, ainda possui partes móveis mecânicas (pratos e cabeças) sujeitas a danos por choque.'
    ],
    curiosities: [
      'Os conectores SATA de dados (7 pinos) e energia (15 pinos) são idênticos nos discos de 2,5" e 3,5".'
    ],
    colorAccent: '#38bdf8',
    storageType: 'HDD',
    capacityGb: 1000,
    formFactor: '2.5_INCH',
    interface: 'SATA_3',
    protocol: 'AHCI/SATA',
    m2Key: 'NONE',
    rpm: 5400,
    readSpeedMBs: 140,
    writeSpeedMBs: 135,
    requiresSataPowerAndDataCable: true,
    powerConsumptionWatts: 1.7,
  },
  {
    id: 'storage-ssd-kingston-a400-480gb-sata',
    name: 'Kingston A400 480GB (SSD 2,5" SATA III)',
    category: 'storage',
    manufacturer: 'Kingston',
    model: 'SA400S37/480G',
    summary: 'Unidade de estado sólido (SSD) em formato de 2,5 polegadas utilizando memória Flash NAND e interface SATA III.',
    functionInPc: 'Substitui o HDD mecânico mantendo compatibilidade com cabos SATA, eliminando o tempo de busca mecânico.',
    handlingPrecautions: [
      'Necessita do cabo de dados SATA e do cabo de energia SATA da fonte.'
    ],
    curiosities: [
      'Por usar a interface SATA III (6 Gbps), sua velocidade máxima fica limitada a cerca de 500–550 MB/s pela própria interface.'
    ],
    colorAccent: '#ef4444',
    storageType: 'SSD_SATA',
    capacityGb: 480,
    formFactor: '2.5_INCH',
    interface: 'SATA_3',
    protocol: 'AHCI/SATA',
    m2Key: 'NONE',
    readSpeedMBs: 500,
    writeSpeedMBs: 450,
    requiresSataPowerAndDataCable: true,
    powerConsumptionWatts: 1.5,
  },
  {
    id: 'storage-ssd-wd-green-m2-sata-500gb',
    name: 'WD Green 500GB (SSD M.2 2280 SATA B+M Key)',
    category: 'storage',
    manufacturer: 'Western Digital',
    model: 'WDS500G2B0B',
    summary: 'SSD em formato físico M.2 2280, mas que utiliza protocolo SATA (AHCI) e não NVMe! Possui dois entalhes (Chave B+M).',
    functionInPc: 'Excelente peça didática: demonstra que nem todo SSD M.2 é NVMe! Só funciona em slots M.2 que suportem o protocolo SATA.',
    handlingPrecautions: [
      'Atenção! Se instalado em um slot M.2 que suporta apenas PCIe/NVMe (como na maioria das placas AM5 ou Z790), ele NÃO será reconhecido!'
    ],
    curiosities: [
      'Apesar de encaixar diretamente na placa-mãe sem cabos, tem a mesma velocidade de um SSD SATA de 2,5" (~545 MB/s).'
    ],
    colorAccent: '#22c55e',
    storageType: 'SSD_M2_SATA',
    capacityGb: 500,
    formFactor: 'M2_2280',
    interface: 'M2_SATA',
    protocol: 'AHCI/SATA',
    m2Key: 'B+M',
    readSpeedMBs: 545,
    writeSpeedMBs: 465,
    requiresSataPowerAndDataCable: false,
    powerConsumptionWatts: 2.2,
  },
  {
    id: 'storage-ssd-samsung-980-pro-1tb-nvme4',
    name: 'Samsung 980 PRO 1TB (M.2 2280 PCIe 4.0 NVMe)',
    category: 'storage',
    manufacturer: 'Samsung',
    model: 'MZ-V8P1T0BW',
    summary: 'SSD M.2 2280 de altíssima velocidade utilizando protocolo NVMe sobre 4 linhas PCI Express 4.0 (Chave M).',
    functionInPc: 'Comunica-se diretamente com a CPU/Chipset pelo barramento PCIe usando filas paralelas NVMe, atingindo até 7000 MB/s.',
    handlingPrecautions: [
      'Insira em ângulo de 30 graus no slot M.2 Chave M e fixe na extremidade com o parafuso M.2.'
    ],
    curiosities: [
      'É mais de 30 vezes mais rápido em leitura sequencial que um HDD mecânico e mais de 12 vezes mais rápido que um SSD SATA.'
    ],
    colorAccent: '#a855f7',
    storageType: 'SSD_M2_NVME',
    capacityGb: 1000,
    formFactor: 'M2_2280',
    interface: 'M2_NVME_PCIE4',
    protocol: 'NVMe/PCIe',
    m2Key: 'M',
    readSpeedMBs: 7000,
    writeSpeedMBs: 5000,
    requiresSataPowerAndDataCable: false,
    powerConsumptionWatts: 6.2,
  },
  {
    id: 'storage-ssd-crucial-t700-2tb-nvme5',
    name: 'Crucial T700 2TB (M.2 2280 PCIe 5.0 NVMe)',
    category: 'storage',
    manufacturer: 'Crucial',
    model: 'CT2000T700SSD3',
    summary: 'SSD M.2 PCIe 5.0 x4 NVMe de última geração capaz de atingir até 12.400 MB/s (retrocompatível com PCIe 4.0/3.0).',
    functionInPc: 'Explora a largura de banda dobrada do barramento PCIe Gen 5 em plataformas AM5 e LGA 1851.',
    handlingPrecautions: [
      'Em slots PCIe 4.0 ou 3.0 funcionará normalmente, porém com a velocidade limitada à geração do slot da placa-mãe.'
    ],
    curiosities: [
      'Controladores PCIe 5.0 operam em frequências tão altas que exigem dissipador térmico dedicado sobre o slot M.2.'
    ],
    colorAccent: '#ec4899',
    storageType: 'SSD_M2_NVME',
    capacityGb: 2000,
    formFactor: 'M2_2280',
    interface: 'M2_NVME_PCIE5',
    protocol: 'NVMe/PCIe',
    m2Key: 'M',
    readSpeedMBs: 12400,
    writeSpeedMBs: 11800,
    requiresSataPowerAndDataCable: false,
    powerConsumptionWatts: 8.5,
  }
];

export const GPUS: GpuSpec[] = [
  {
    id: 'gpu-gtx-1650-4gb',
    name: 'NVIDIA GeForce GTX 1650 4GB (Sem conector extra)',
    category: 'gpu',
    manufacturer: 'ASUS',
    model: 'Dual GeForce GTX 1650 4GB GDDR6',
    chipsetManufacturer: 'NVIDIA',
    summary: 'Placa de vídeo compacta (200 mm) de baixo consumo (75W) alimentada integralmente pelo próprio slot PCIe x16.',
    functionInPc: 'Processa gráficos 2D/3D e envia o sinal de vídeo para o monitor; dispensa cabo de energia auxiliar da fonte.',
    handlingPrecautions: [
      'Alinhe no slot PCIe x16 principal e abra a trava plástica na extremidade do slot antes de remover.'
    ],
    curiosities: [
      'O slot PCI Express x16 da placa-mãe pode fornecer até 75 Watts de energia diretamente pelos seus pinos.'
    ],
    colorAccent: '#22c55e',
    vramGb: 4,
    vramType: 'GDDR6',
    interface: 'PCIe_x16',
    pcieGeneration: 3,
    lengthMm: 200,
    tdpWatts: 75,
    requiredPowerConnector: 'NONE',
    recommendedPsuWatts: 300,
    fanCount: 2,
  },
  {
    id: 'gpu-rx-6600-8gb',
    name: 'AMD Radeon RX 6600 8GB (Requer 1x 8-pin PCIe)',
    category: 'gpu',
    manufacturer: 'Sapphire',
    model: 'Pulse Radeon RX 6600 8GB',
    chipsetManufacturer: 'AMD',
    summary: 'Placa de vídeo intermediária RDNA 2 de 132W que exige 1 conector de alimentação PCIe de 8 pinos da fonte.',
    functionInPc: 'Renderiza gráficos complexos e possui 8 GB de memória dedicada GDDR6.',
    handlingPrecautions: [
      'Obrigatório conectar o cabo de alimentação PCIe de 8 pinos da fonte! Sem ele o computador não iniciará o vídeo.'
    ],
    curiosities: [
      'Conta com 32 MB de Infinity Cache no die para reduzir a necessidade de barramentos de memória largos.'
    ],
    colorAccent: '#ef4444',
    vramGb: 8,
    vramType: 'GDDR6',
    interface: 'PCIe_x16',
    pcieGeneration: 4,
    lengthMm: 240,
    tdpWatts: 132,
    requiredPowerConnector: '1x8-pin',
    recommendedPsuWatts: 500,
    fanCount: 2,
  },
  {
    id: 'gpu-rtx-4070-super-12gb',
    name: 'NVIDIA GeForce RTX 4070 Super 12GB (305 mm / 12V-2x6)',
    category: 'gpu',
    manufacturer: 'MSI',
    model: 'Gaming X Slim RTX 4070 Super 12GB',
    chipsetManufacturer: 'NVIDIA',
    summary: 'Placa de vídeo de alto desempenho com 3 ventoinhas (305 mm de comprimento) e conector moderno 12V-2x6 (220W).',
    functionInPc: 'Processamento massivamente paralelo para gráficos 3D, Ray Tracing e aceleração matricial.',
    handlingPrecautions: [
      'Verifique o comprimento máximo suportado pelo gabinete (305 mm não cabe em gabinetes compactos SFF!).',
      'Exige fonte com conector 12V-2x6 (ou 2x8-pin via adaptador) e potência adequada.'
    ],
    curiosities: [
      'O conector 12V-2x6 possui 12 pinos de energia e 4 pinos sensores (sense pins) que comunicam à GPU a potência máxima suportada pelo cabo.'
    ],
    colorAccent: '#10b981',
    vramGb: 12,
    vramType: 'GDDR6X',
    interface: 'PCIe_x16',
    pcieGeneration: 4,
    lengthMm: 305,
    tdpWatts: 220,
    requiredPowerConnector: '12V-2x6',
    recommendedPsuWatts: 650,
    fanCount: 3,
  },
  {
    id: 'gpu-pcie-wifi6e-card',
    name: 'Placa de Expansão TP-Link Archer TXE75E (PCIe x1 Wi-Fi 6E)',
    category: 'gpu',
    manufacturer: 'TP-Link',
    model: 'Archer TXE75E PCIe x1',
    chipsetManufacturer: 'PCIe_Addon',
    summary: 'Placa de expansão PCI Express x1 para conectividade sem fio Wi-Fi 6E e Bluetooth 5.3.',
    functionInPc: 'Demonstra o uso dos slots curtos PCI Express x1 para adicionar placas de rede, som ou captura à placa-mãe.',
    handlingPrecautions: [
      'Instale no slot PCIe x1 secundário da placa-mãe (não ocupa o slot da placa de vídeo).'
    ],
    curiosities: [
      'Uma placa PCIe x1 funciona tanto em um slot x1 quanto em slots maiores (x4, x8 ou x16), pois o barramento negocia automaticamente 1 linha (lane).'
    ],
    colorAccent: '#0ea5e9',
    vramGb: 0,
    vramType: 'N/A',
    interface: 'PCIe_x1',
    pcieGeneration: 3,
    lengthMm: 120,
    tdpWatts: 8,
    requiredPowerConnector: 'NONE',
    recommendedPsuWatts: 200,
    fanCount: 1,
  }
];

export const COOLERS: CoolerSpec[] = [
  {
    id: 'cooler-stock-air-65w',
    name: 'Cooler Box Padrão Alumínio (Até 65W TDP)',
    category: 'cooler',
    manufacturer: 'OEM / Padrão',
    model: 'Stock Radial 65W',
    summary: 'Dissipador radial compacto de alumínio (60 mm de altura) adequado para processadores de até 65W de TDP.',
    functionInPc: 'Transfere o calor do processador para as aletas de alumínio e o dissipa com uma ventoinha axial de 92 mm.',
    handlingPrecautions: [
      'Obrigatório aplicar pasta térmica na CPU antes de fixar o cooler!',
      'Insuficiente para processadores de 95W, 105W ou 125W sob carga.'
    ],
    curiosities: [
      'Sem um dissipador instalado, um processador moderno atinge 100°C em poucos segundos e aciona o desligamento térmico de emergência.'
    ],
    colorAccent: '#38bdf8',
    coolerType: 'AIR_STOCK',
    supportedSockets: ['LGA775', 'LGA1151', 'LGA1200', 'LGA1700', 'AM3+', 'AM4', 'AM5'],
    maxTdpWatts: 65,
    heightMm: 60,
  },
  {
    id: 'cooler-deepcool-ak400-tower',
    name: 'DeepCool AK400 Tower (4 Heatpipes / Até 220W / 155 mm)',
    category: 'cooler',
    manufacturer: 'DeepCool',
    model: 'AK400',
    summary: 'Cooler a ar em formato torre com 4 heatpipes de cobre e ventoinha PWM de 120 mm (altura: 155 mm).',
    functionInPc: 'Utiliza mudança de fase do fluido dentro dos tubos de cobre (heatpipes) para levar o calor rapidamente até a torre de aletas.',
    handlingPrecautions: [
      'Possui 155 mm de altura: verifique se o gabinete suporta coolers dessa altura (não cabe em gabinetes Mini-ITX ultra-baixos).'
    ],
    curiosities: [
      'Dentro de cada heatpipe há um líquido sob baixa pressão que evapora na base quente e condensa no topo frio das aletas.'
    ],
    colorAccent: '#0ea5e9',
    coolerType: 'AIR_TOWER',
    supportedSockets: ['LGA1151', 'LGA1200', 'LGA1700', 'LGA1851', 'AM4', 'AM5'],
    maxTdpWatts: 220,
    heightMm: 155,
  },
  {
    id: 'cooler-corsair-h100i-aio-240',
    name: 'Corsair iCUE H100i RGB Elite (Water Cooler AIO 240 mm)',
    category: 'cooler',
    manufacturer: 'Corsair',
    model: 'H100i 240mm AIO',
    summary: 'Sistema selado de refrigeração líquida (All-in-One) com bloco/bomba na CPU e radiador duplo de 240 mm.',
    functionInPc: 'Bombeia líquido refrigerante aquecido pela CPU através de mangueiras até um radiador de 240 mm resfriado por duas ventoinhas.',
    handlingPrecautions: [
      'Exige que o gabinete possua suporte físico para fixação de radiador de 240 mm.'
    ],
    curiosities: [
      'A água possui capacidade térmica muito superior ao ar, permitindo transportar o calor para a borda do gabinete antes de dissipá-lo.'
    ],
    colorAccent: '#06b6d4',
    coolerType: 'AIO_LIQUID_240',
    supportedSockets: ['LGA1151', 'LGA1200', 'LGA1700', 'LGA1851', 'AM4', 'AM5'],
    maxTdpWatts: 250,
    heightMm: 55,
    radiatorSizeMm: 240,
  },
  {
    id: 'cooler-noctua-nh-l9i-lowprofile',
    name: 'Noctua NH-L9a/i Low-Profile (37 mm / Até 95W)',
    category: 'cooler',
    manufacturer: 'Noctua',
    model: 'NH-L9 Low Profile',
    summary: 'Cooler horizontal ultracompacto de apenas 37 mm de altura, ideal para gabinetes Mini-ITX.',
    functionInPc: 'Permite resfriar processadores de até 95W em gabinetes compactos onde coolers em torre não cabem.',
    handlingPrecautions: [
      'Ideal para CPUs de 65W a 95W; não recomendado para CPUs de 125W em carga contínua.'
    ],
    curiosities: [
      'Com apenas 37 mm de altura total, fica na mesma altura que módulos de memória RAM comuns.'
    ],
    colorAccent: '#d97706',
    coolerType: 'AIR_LOW_PROFILE',
    supportedSockets: ['LGA1151', 'LGA1200', 'LGA1700', 'AM4', 'AM5'],
    maxTdpWatts: 95,
    heightMm: 37,
  }
];

export const PSUS: PsuSpec[] = [
  {
    id: 'psu-generic-300w',
    name: 'Fonte Básica Escritório 300W (Sem Conector PCIe 8-pin)',
    category: 'psu',
    manufacturer: 'Genérica',
    model: 'ATX-300W-OFFICE',
    isDidacticGeneric: true,
    summary: 'Fonte básica de 300W voltada apenas para computadores de escritório sem placa de vídeo de alto consumo.',
    functionInPc: 'Converte a corrente alternada (110V/220V AC) da tomada em tensões contínuas reguladas (+12V, +5V, +3.3V DC).',
    handlingPrecautions: [
      'PERIGO ELÉTRICO: Nunca abra a carcaça metálica de uma fonte real! Os capacitores primários armazenam alta tensão letal mesmo após desligada da tomada.',
      'Não possui cabos PCIe de 8 pinos nem 12V-2x6 para placas de vídeo dedicadas intermediárias/fortes.'
    ],
    curiosities: [
      'Mais de 80% do consumo de um computador moderno (CPU e GPU) é extraído da linha de +12 Volts.'
    ],
    colorAccent: '#94a3b8',
    wattage: 300,
    efficiencyRating: 'Padrão (Sem selo 80 Plus)',
    formFactor: 'ATX',
    lengthMm: 140,
    has24PinAtx: true,
    cpu8PinCount: 1,
    pcie8PinCount: 0,
    has12V2x6Connector: false,
    sataPowerCount: 2,
    modular: false,
  },
  {
    id: 'psu-corsair-cv550-bronze',
    name: 'Corsair CV550 550W (80 Plus Bronze)',
    category: 'psu',
    manufacturer: 'Corsair',
    model: 'CV550',
    summary: 'Fonte ATX de 550W com PFC Ativo, certificação 80 Plus Bronze e 2 conectores PCIe de 8 pinos.',
    functionInPc: 'Fornece alimentação estável para configurações intermediárias com GPUs que utilizam conector PCIe de 8 pinos.',
    handlingPrecautions: [
      'Atenção: não possui conector nativo 12V-2x6 (PCIe 5.0) e pode ser insuficiente para GPUs de alto consumo.'
    ],
    curiosities: [
      'A certificação 80 Plus Bronze garante eficiência energética mínima de 82% a 85%, reduzindo o desperdício de energia em forma de calor.'
    ],
    colorAccent: '#f59e0b',
    wattage: 550,
    efficiencyRating: '80 Plus Bronze',
    formFactor: 'ATX',
    lengthMm: 125,
    has24PinAtx: true,
    cpu8PinCount: 1,
    pcie8PinCount: 2,
    has12V2x6Connector: false,
    sataPowerCount: 6,
    modular: false,
  },
  {
    id: 'psu-xpg-core-reactor-750w-atx3',
    name: 'XPG Core Reactor II 750W (80 Plus Gold / ATX 3.0 / 12V-2x6)',
    category: 'psu',
    manufacturer: 'ADATA XPG',
    model: 'Core Reactor II 750G',
    summary: 'Fonte modular de 750W padrão ATX 3.0 com conector nativo 12V-2x6 e dois conectores EPS 8-pin para CPU.',
    functionInPc: 'Alimenta qualquer configuração moderna do laboratório, incluindo placas Z790/Z890 (8+4 pinos CPU) e GPUs RTX 4070 Super.',
    handlingPrecautions: [
      'Utilize apenas os cabos modulares originais da própria fonte.'
    ],
    curiosities: [
      'Fontes padrão ATX 3.0 são projetadas para suportar picos transitórios de potência (power excursions) de até 200% da sua potência nominal por microssegundos.'
    ],
    colorAccent: '#10b981',
    wattage: 750,
    efficiencyRating: '80 Plus Gold',
    formFactor: 'ATX',
    lengthMm: 140,
    has24PinAtx: true,
    cpu8PinCount: 2,
    pcie8PinCount: 3,
    has12V2x6Connector: true,
    sataPowerCount: 8,
    modular: true,
  },
  {
    id: 'psu-oem-unlabeled-unknown',
    name: 'Fonte OEM Sem Etiqueta de Especificação (Dados Insuficientes)',
    category: 'psu',
    manufacturer: 'Desconhecido / Sem Etiqueta',
    model: 'OEM-PSU-UNLABELED',
    isDidacticGeneric: true,
    summary: 'Fonte cujo rótulo de corrente na linha +12V e potência contínua real foi removido ou não possui documentação verificável.',
    functionInPc: 'Permite demonstrar por que um técnico nunca deve aprovar como segura uma fonte sem especificações elétricas comprovadas.',
    handlingPrecautions: [
      'Quando não há dados suficientes sobre a potência real da linha +12V, o sistema deve alertar "Informações Insuficientes" em vez de assumir segurança.'
    ],
    curiosities: [
      'Em manutenção real, fontes sem identificação de potência contínua na linha +12V representam risco de desligamento súbito e danos aos componentes.'
    ],
    colorAccent: '#eab308',
    incompleteSpecsWarning: 'Potência nominal contínua (Watts) e amperagem da linha +12V não informadas na etiqueta técnica.',
    wattage: null,
    efficiencyRating: 'Não especificada',
    formFactor: 'ATX',
    lengthMm: 140,
    has24PinAtx: true,
    cpu8PinCount: 1,
    pcie8PinCount: 1,
    has12V2x6Connector: false,
    sataPowerCount: 3,
    modular: false,
  }
];

export const CASES: CaseSpec[] = [
  {
    id: 'case-corsair-4000d-atx',
    name: 'Corsair 4000D Airflow (Mid-Tower ATX / Micro-ATX / Mini-ITX)',
    category: 'case',
    manufacturer: 'Corsair',
    model: '4000D Airflow',
    summary: 'Gabinete Mid-Tower amplo que suporta placas-mãe ATX, Micro-ATX e Mini-ITX, GPUs de até 360 mm, coolers de 170 mm e radiador 240 mm.',
    functionInPc: 'Estrutura mecânica que acomoda e protege os componentes, organiza o fluxo de ar e fornece os botões/portas do painel frontal.',
    handlingPrecautions: [
      'Verifique a posição dos espaçadores metálicos (standoffs) conforme o formato da placa-mãe antes de parafusar.'
    ],
    curiosities: [
      'A frente perfurada (mesh) reduz a resistência à entrada de ar frio, diminuindo a temperatura da CPU e da GPU em até 8°C.'
    ],
    colorAccent: '#38bdf8',
    supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'],
    maxGpuLengthMm: 360,
    maxCoolerHeightMm: 170,
    maxPsuLengthMm: 220,
    supports240mmRadiator: true,
    driveBays35: 2,
    driveBays25: 2,
    chassisColor: '#1e293b',
  },
  {
    id: 'case-cooler-master-q300l-matx',
    name: 'Cooler Master MasterBox Q300L (Micro-ATX / Mini-ITX)',
    category: 'case',
    manufacturer: 'Cooler Master',
    model: 'MasterBox Q300L',
    summary: 'Gabinete compacto para placas Micro-ATX e Mini-ITX. NÃO comporta placas-mãe formato ATX completo!',
    functionInPc: 'Demonstra a restrição geométrica entre formatos de gabinete (Micro-ATX) e placas-mãe maiores (ATX).',
    handlingPrecautions: [
      'Placas-mãe ATX (305 mm de altura) são fisicamente maiores que o compartimento deste gabinete Micro-ATX (244 mm).'
    ],
    curiosities: [
      'Embora não aceite placas ATX, ainda comporta fontes ATX padrão e placas de vídeo de até 360 mm.'
    ],
    colorAccent: '#a855f7',
    supportedFormFactors: ['Micro-ATX', 'Mini-ITX'],
    maxGpuLengthMm: 360,
    maxCoolerHeightMm: 159,
    maxPsuLengthMm: 160,
    supports240mmRadiator: true,
    driveBays35: 1,
    driveBays25: 2,
    chassisColor: '#27272a',
  },
  {
    id: 'case-silverstone-sg13-mini-itx',
    name: 'SilverStone Sugo SG13 (Ultra-Compacto Mini-ITX)',
    category: 'case',
    manufacturer: 'SilverStone',
    model: 'Sugo SG13',
    summary: 'Gabinete cubo SFF exclusivo para placas Mini-ITX (170x170 mm), com limite estrito de altura de cooler (61 mm) e GPU (267 mm).',
    functionInPc: 'Excelente para testar limites físicos: rejeita placas ATX/Micro-ATX, rejeita coolers em torre altos (155 mm) e rejeita GPUs triplo-fan longas (305 mm)!',
    handlingPrecautions: [
      'Exige placa-mãe Mini-ITX, cooler de perfil baixo (até 61 mm) e placa de vídeo com menos de 267 mm.'
    ],
    curiosities: [
      'Tem apenas 11,5 litros de volume interno, cabendo em uma mochila, mas exige planejamento milimétrico das peças.'
    ],
    colorAccent: '#ec4899',
    supportedFormFactors: ['Mini-ITX'],
    maxGpuLengthMm: 267,
    maxCoolerHeightMm: 61,
    maxPsuLengthMm: 150,
    supports240mmRadiator: false,
    driveBays35: 1,
    driveBays25: 2,
    chassisColor: '#0f172a',
  }
];

export const CABLES_AND_ACCESSORIES: CableOrAccessorySpec[] = [
  {
    id: 'acc-standoffs-kit',
    name: 'Kit de Espaçadores Metálicos (Standoffs M3)',
    category: 'cable',
    manufacturer: 'Padrão ATX',
    model: 'Brass Standoffs 6.5mm',
    accessoryType: 'CASE_STANDOFFS',
    summary: 'Pequenos pilares sextavados de latão rosqueados na bandeja do gabinete antes de instalar a placa-mãe.',
    functionInPc: 'Mantém a parte traseira da placa-mãe afastada da chapa metálica do gabinete, evitando curto-circuito fatal e aterrando os furos de montagem.',
    handlingPrecautions: [
      'Nunca parafuse a placa-mãe diretamente na chapa do gabinete sem os espaçadores!'
    ],
    curiosities: [
      'Esquecer os espaçadores ou deixar um espaçador extra sob uma região sem furo da placa-mãe é uma das maiores causas de curto-circuito em montagens iniciantes.'
    ],
    colorAccent: '#eab308',
  },
  {
    id: 'acc-thermal-paste-mx4',
    name: 'Pasta Térmica Arctic MX-4 (Composto de Carbono)',
    category: 'cable',
    manufacturer: 'Arctic',
    model: 'MX-4 4g',
    accessoryType: 'THERMAL_PASTE',
    summary: 'Composto térmico de alta condutividade aplicado entre o processador (IHS) e a base do cooler.',
    functionInPc: 'Preenche as microimperfeições microscópicas de ar entre o metal da CPU e o dissipador, garantindo a transferência eficiente de calor.',
    handlingPrecautions: [
      'Aplique uma gota central do tamanho de uma ervilha (~4 mm) sobre o processador antes de instalar o cooler.'
    ],
    curiosities: [
      'O ar parado é um péssimo condutor térmico (~0,026 W/mK); a pasta térmica substitui esse ar preso nas microrranhuras por um composto de ~8,5 W/mK.'
    ],
    colorAccent: '#38bdf8',
  },
  {
    id: 'acc-cmos-battery-cr2032',
    name: 'Bateria de Lítio CMOS CR2032 (3 Volts)',
    category: 'cable',
    manufacturer: 'Panasonic',
    model: 'CR2032 3V',
    accessoryType: 'CMOS_BATTERY',
    summary: 'Bateria tipo moeda de 3V instalada na placa-mãe para alimentar o relógio de tempo real (RTC) e a memória de configuração CMOS.',
    functionInPc: 'Mantém a data, hora e configurações personalizadas da BIOS/UEFI salvas quando o computador é desligado da tomada.',
    handlingPrecautions: [
      'Instale com o polo positivo (+) voltado para cima no soquete da placa-mãe.'
    ],
    curiosities: [
      'Quando a bateria CR2032 se esgota após 4 a 7 anos, o PC exibe erro de "CMOS Checksum Bad / Date & Time Not Set" toda vez que é desconectado da tomada.'
    ],
    colorAccent: '#cbd5e1',
  },
  {
    id: 'acc-beep-speaker',
    name: 'Alto-Falante Interno de Diagnóstico (PC Beep Speaker)',
    category: 'cable',
    manufacturer: 'Laboratório ITIC',
    model: 'Piezo Speaker 4-Pin',
    accessoryType: 'BEEP_SPEAKER',
    summary: 'Pequeno transdutor piezoelétrico conectado ao header SPEAKER da placa-mãe para emitir códigos sonoros de POST.',
    functionInPc: 'Emite bipes curtos ou longos durante o POST (Power-On Self-Test), permitindo diagnosticar falhas de RAM, vídeo ou placa-mãe mesmo sem monitor.',
    handlingPrecautions: [
      'Conecte nos 4 pinos do conector SPEAKER do painel frontal.'
    ],
    curiosities: [
      '1 bipe curto indica POST concluído com sucesso; 3 bipes longos ou bipes contínuos geralmente indicam ausência ou falha na memória RAM.'
    ],
    colorAccent: '#f59e0b',
  },
  {
    id: 'cable-atx-24pin',
    name: 'Cabo de Alimentação Principal ATX 24 Pinos (20+4)',
    category: 'cable',
    manufacturer: 'Padrão ATX',
    model: 'ATX 24-Pin Main Power',
    accessoryType: 'CABLE_ATX_24PIN',
    summary: 'Conector principal de alimentação que leva +12V, +5V, +3.3V, +5VSB e o sinal PS_ON da fonte para a placa-mãe.',
    functionInPc: 'Alimenta o chipset, slots PCIe, slots de memória, portas USB e circuitos lógicos da placa-mãe.',
    handlingPrecautions: [
      'Pressione até que a trava lateral se encaixe completamente na borda do conector de 24 pinos.'
    ],
    curiosities: [
      'O pino 16 (fio verde nas fontes clássicas, sinal PS_ON#) é aterrado pela placa-mãe quando você aperta o botão Power do gabinete para ligar a fonte!'
    ],
    colorAccent: '#10b981',
  },
  {
    id: 'cable-cpu-eps-8pin',
    name: 'Cabo de Alimentação da CPU EPS 12V (4+4 Pinos)',
    category: 'cable',
    manufacturer: 'Padrão ATX',
    model: 'EPS12V 4+4 Pin CPU',
    accessoryType: 'CABLE_CPU_EPS',
    summary: 'Cabo dedicado de +12V conectado na parte superior esquerda da placa-mãe para alimentar exclusivamente o VRM do processador.',
    functionInPc: 'Fornece corrente de +12V para os reguladores de tensão (VRM) que alimentam os núcleos do processador.',
    handlingPrecautions: [
      'NUNCA confunda o cabo EPS 4+4 da CPU com o cabo PCIe 6+2 da placa de vídeo (a polaridade é invertida!).',
      'Esquecer este cabo faz as ventoinhas girarem, mas o PC não dá vídeo nem conclui o POST.'
    ],
    curiosities: [
      'O conector 4+4 pode se dividir ao meio para alimentar placas antigas de 4 pinos (como LGA 775 / AM3+) ou unir-se em 8 pinos nas placas modernas.'
    ],
    colorAccent: '#38bdf8',
  },
  {
    id: 'cable-pcie-power',
    name: 'Cabo de Alimentação da Placa de Vídeo (PCIe 8-Pin / 12V-2x6)',
    category: 'cable',
    manufacturer: 'Padrão PCIe',
    model: 'PCIe GPU Power Cable',
    accessoryType: 'CABLE_PCIE_POWER',
    summary: 'Cabo de energia dedicado que liga a fonte de alimentação às placas de vídeo com TDP superior a 75W.',
    functionInPc: 'Suplementa a energia do slot PCIe fornecendo +12V diretamente aos reguladores da GPU.',
    handlingPrecautions: [
      'Certifique-se de inserir o conector até o fim sem deixar folgas.'
    ],
    curiosities: [
      'Um conector PCIe de 8 pinos fornece até 150W extras, enquanto o novo padrão 12V-2x6 pode fornecer até 600W.'
    ],
    colorAccent: '#a855f7',
  },
  {
    id: 'cable-sata-data-and-power',
    name: 'Kit Cabo de Dados SATA III (6 Gbps) + Alimentação SATA',
    category: 'cable',
    manufacturer: 'Padrão SATA-IO',
    model: 'SATA III L-Connector',
    accessoryType: 'CABLE_SATA_DATA',
    summary: 'Conjunto com cabo de dados SATA de 7 pinos (placa-mãe ao disco) e conector de energia SATA de 15 pinos (fonte ao disco).',
    functionInPc: 'Conecta HDDs de 3,5"/2,5" e SSDs SATA de 2,5" à placa-mãe e à fonte de alimentação.',
    handlingPrecautions: [
      'O conector possui formato em "L" para impedir a inserção invertida.'
    ],
    curiosities: [
      'Ao contrário dos antigos cabos flat IDE/PATA de 40/80 vias, o cabo SATA usa transmissão serial diferencial em apenas 2 pares de fios.'
    ],
    colorAccent: '#ef4444',
  },
  {
    id: 'cable-front-panel-fpanel',
    name: 'Conectores do Painel Frontal (PWR_SW, RESET_SW, PWR_LED, HDD_LED)',
    category: 'cable',
    manufacturer: 'Gabinete Padrão',
    model: 'F_PANEL Header Kit',
    accessoryType: 'CABLE_FRONT_PANEL',
    summary: 'Cabos que ligam o botão de Ligar (Power Switch), botão Reset e LEDs frontais do gabinete aos pinos F_PANEL da placa-mãe.',
    functionInPc: 'Permite que o botão físico do gabinete envie o pulso momentâneo de partida para a placa-mãe ligar o computador.',
    handlingPrecautions: [
      'Os LEDs (PWR_LED e HDD_LED) possuem polaridade (+ e -), enquanto os botões (PWR_SW e RESET_SW) apenas fecham contato momentâneo sem polaridade.'
    ],
    curiosities: [
      'Se o cabo PWR_SW não estiver conectado aos dois pinos corretos do F_PANEL, apertar o botão de ligar do gabinete não terá efeito algum!'
    ],
    colorAccent: '#14b8a6',
  }
];

export const ALL_HARDWARE_ITEMS: HardwareItem[] = [
  ...MOTHERBOARDS,
  ...CPUS,
  ...RAM_MODULES,
  ...STORAGE_DEVICES,
  ...GPUS,
  ...COOLERS,
  ...PSUS,
  ...CASES,
  ...CABLES_AND_ACCESSORIES,
];

export function getHardwareById(id: string | null | undefined): HardwareItem | undefined {
  if (!id) return undefined;
  return ALL_HARDWARE_ITEMS.find((item) => item.id === id);
}

export const SNAP_POINTS: SnapPointDefinition[] = [
  {
    id: 'slot_case',
    label: 'Chassi do Gabinete',
    acceptedCategory: 'case',
    position: [0, 0.2, 0],
    rotation: [0, 0, 0],
    description: 'Posição central da bancada para acomodar o gabinete.'
  },
  {
    id: 'slot_standoffs',
    label: 'Furos dos Espaçadores (Standoffs)',
    acceptedCategory: 'cable',
    acceptedAccessoryType: 'CASE_STANDOFFS',
    position: [-0.35, 0.32, -0.2],
    rotation: [0, 0, 0],
    description: 'Rosqueia os espaçadores de latão na bandeja do gabinete antes da placa-mãe.'
  },
  {
    id: 'slot_motherboard',
    label: 'Bandeja da Placa-Mãe',
    acceptedCategory: 'motherboard',
    position: [-0.35, 0.42, -0.2],
    rotation: [0, 0, 0],
    description: 'Área de fixação da placa-mãe sobre os espaçadores.'
  },
  {
    id: 'slot_cpu',
    label: 'Socket do Processador (CPU)',
    acceptedCategory: 'cpu',
    position: [-0.55, 0.58, -0.55],
    rotation: [0, 0, 0],
    description: 'ZIF/LGA Socket central para encaixe do processador.'
  },
  {
    id: 'slot_thermal_paste',
    label: 'Topo da CPU (Pasta Térmica)',
    acceptedCategory: 'cable',
    acceptedAccessoryType: 'THERMAL_PASTE',
    position: [-0.55, 0.68, -0.55],
    rotation: [0, 0, 0],
    description: 'Aplicação da gota de pasta térmica sobre o IHS do processador.'
  },
  {
    id: 'slot_cooler',
    label: 'Suporte de Refrigeração (Cooler CPU)',
    acceptedCategory: 'cooler',
    position: [-0.55, 0.95, -0.55],
    rotation: [0, 0, 0],
    description: 'Fixação do dissipador/cooler sobre o processador com pasta térmica.'
  },
  {
    id: 'slot_ram_1',
    label: 'Slot DIMM_A1 (Memória RAM 1)',
    acceptedCategory: 'ram',
    position: [0.18, 0.62, -0.55],
    rotation: [0, 0, 0],
    description: 'Primeiro slot de memória RAM na placa-mãe.'
  },
  {
    id: 'slot_ram_2',
    label: 'Slot DIMM_A2 (Memória RAM 2)',
    acceptedCategory: 'ram',
    position: [0.34, 0.62, -0.55],
    rotation: [0, 0, 0],
    description: 'Segundo slot de memória RAM na placa-mãe (Canal prioritário).'
  },
  {
    id: 'slot_ram_3',
    label: 'Slot DIMM_B1 (Memória RAM 3)',
    acceptedCategory: 'ram',
    position: [0.50, 0.62, -0.55],
    rotation: [0, 0, 0],
    description: 'Terceiro slot de memória RAM (Disponível em placas com 4 slots).'
  },
  {
    id: 'slot_ram_4',
    label: 'Slot DIMM_B2 (Memória RAM 4)',
    acceptedCategory: 'ram',
    position: [0.66, 0.62, -0.55],
    rotation: [0, 0, 0],
    description: 'Quarto slot de memória RAM (Dual-Channel A2+B2).'
  },
  {
    id: 'slot_m2_1',
    label: 'Slot M.2_1 Principal',
    acceptedCategory: 'storage',
    position: [-0.45, 0.52, 0.08],
    rotation: [0, 0, 0],
    description: 'Conector horizontal M.2 2280 principal na placa-mãe.'
  },
  {
    id: 'slot_m2_2',
    label: 'Slot M.2_2 Secundário',
    acceptedCategory: 'storage',
    position: [-0.45, 0.52, 0.72],
    rotation: [0, 0, 0],
    description: 'Conector horizontal M.2 2280 secundário na placa-mãe.'
  },
  {
    id: 'slot_gpu_pcie16',
    label: 'Slot PCI Express x16 (Placa de Vídeo)',
    acceptedCategory: 'gpu',
    position: [-0.55, 0.78, 0.36],
    rotation: [0, 0, 0],
    description: 'Barramento PCI Express x16 principal para placa de vídeo dedicada.'
  },
  {
    id: 'slot_pcie_x1',
    label: 'Slot PCI Express x1 (Expansão)',
    acceptedCategory: 'gpu',
    position: [-0.55, 0.70, 0.92],
    rotation: [0, 0, 0],
    description: 'Slot curto PCI Express x1 para placas de expansão (Wi-Fi, Rede, Som).'
  },
  {
    id: 'slot_drive_bay_1',
    label: 'Baia de Armazenamento SATA 1 (HDD 3,5" / SSD 2,5")',
    acceptedCategory: 'storage',
    position: [1.55, 0.52, -0.35],
    rotation: [0, 0, 0],
    description: 'Gaveta lateral para instalação de HDD de 3,5" ou SSD/HDD de 2,5".'
  },
  {
    id: 'slot_drive_bay_2',
    label: 'Baia de Armazenamento SATA 2 (SSD/HDD 2,5")',
    acceptedCategory: 'storage',
    position: [1.55, 0.52, 0.45],
    rotation: [0, 0, 0],
    description: 'Gaveta secundária para unidade SATA adicional.'
  },
  {
    id: 'slot_psu',
    label: 'Compartimento da Fonte (PSU)',
    acceptedCategory: 'psu',
    position: [-0.75, 0.62, 1.55],
    rotation: [0, 0, 0],
    description: 'Compartimento inferior traseiro para a fonte de alimentação ATX.'
  },
  {
    id: 'slot_cmos_battery',
    label: 'Soquete da Bateria CMOS (CR2032)',
    acceptedCategory: 'cable',
    acceptedAccessoryType: 'CMOS_BATTERY',
    position: [0.05, 0.50, 0.52],
    rotation: [0, 0, 0],
    description: 'Suporte circular de 3V para a bateria CR2032 da BIOS/RTC.'
  },
  {
    id: 'slot_beep_speaker',
    label: 'Header SPEAKER (Alto-Falante POST)',
    acceptedCategory: 'cable',
    acceptedAccessoryType: 'BEEP_SPEAKER',
    position: [0.58, 0.52, 0.95],
    rotation: [0, 0, 0],
    description: 'Conector de 4 pinos para o speaker piezoelétrico de bipes do POST.'
  },
  {
    id: 'slot_cable_24pin',
    label: 'Conector ATX 24 Pinos (Placa-Mãe)',
    acceptedCategory: 'cable',
    acceptedAccessoryType: 'CABLE_ATX_24PIN',
    position: [0.82, 0.58, -0.25],
    rotation: [0, 0, 0],
    description: 'Entrada de alimentação principal de 24 pinos na lateral direita da placa-mãe.'
  },
  {
    id: 'slot_cable_cpu_eps',
    label: 'Conector EPS 12V (Alimentação CPU)',
    acceptedCategory: 'cable',
    acceptedAccessoryType: 'CABLE_CPU_EPS',
    position: [-1.15, 0.58, -1.05],
    rotation: [0, 0, 0],
    description: 'Conector de 4 ou 8 pinos no canto superior esquerdo para alimentar o VRM da CPU.'
  },
  {
    id: 'slot_cable_pcie_power',
    label: 'Conector de Energia PCIe (GPU)',
    acceptedCategory: 'cable',
    acceptedAccessoryType: 'CABLE_PCIE_POWER',
    position: [0.15, 0.98, 0.36],
    rotation: [0, 0, 0],
    description: 'Entrada de alimentação auxiliar de 8 pinos ou 12V-2x6 na placa de vídeo.'
  },
  {
    id: 'slot_cable_sata',
    label: 'Portas SATA (Dados + Energia)',
    acceptedCategory: 'cable',
    acceptedAccessoryType: 'CABLE_SATA_DATA',
    position: [0.82, 0.52, 0.55],
    rotation: [0, 0, 0],
    description: 'Conexão dos cabos SATA entre as portas da placa-mãe, a fonte e os discos SATA.'
  },
  {
    id: 'slot_cable_front_panel',
    label: 'Header F_PANEL (Painel Frontal)',
    acceptedCategory: 'cable',
    acceptedAccessoryType: 'CABLE_FRONT_PANEL',
    position: [0.75, 0.50, 1.05],
    rotation: [0, 0, 0],
    description: 'Pinos do painel frontal (Power SW, Reset SW, Power LED, HDD LED).'
  }
];
