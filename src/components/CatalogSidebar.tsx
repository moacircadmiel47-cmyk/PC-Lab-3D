import React, { useState } from 'react';
import {
  Cpu,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  MonitorPlay,
  Fan,
  Zap,
  Box,
  Cable,
  Search,
  RotateCw,
  Trash2,
  Eye,
  CheckCircle2,
  Hand,
} from 'lucide-react';
import {
  useSimulatorStore,
  getSuggestedTargetSlotForItem,
} from '../store/useSimulatorStore';
import {
  ALL_HARDWARE_ITEMS,
  getHardwareById,
} from '../data/catalog';
import {
  ComponentCategory,
  HardwareItem,
  SnapSlotId,
  MotherboardSpec,
  CpuSpec,
  RamSpec,
  StorageSpec,
  GpuSpec,
  CoolerSpec,
  PsuSpec,
  CaseSpec,
} from '../types/hardware';

const CATEGORIES: { id: ComponentCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'cpu', label: 'Processadores', icon: <Cpu className="h-4 w-4" /> },
  { id: 'motherboard', label: 'Placas-Mãe', icon: <CircuitBoard className="h-4 w-4" /> },
  { id: 'ram', label: 'Memórias RAM', icon: <MemoryStick className="h-4 w-4" /> },
  { id: 'storage', label: 'Armazenamento', icon: <HardDrive className="h-4 w-4" /> },
  { id: 'cooler', label: 'Refrigeração', icon: <Fan className="h-4 w-4" /> },
  { id: 'gpu', label: 'Placas de Vídeo', icon: <MonitorPlay className="h-4 w-4" /> },
  { id: 'psu', label: 'Fontes (PSU)', icon: <Zap className="h-4 w-4" /> },
  { id: 'case', label: 'Gabinetes', icon: <Box className="h-4 w-4" /> },
  { id: 'cable', label: 'Cabos e Acessórios', icon: <Cable className="h-4 w-4" /> },
];

function formatItemKicker(item: HardwareItem): string {
  switch (item.category) {
    case 'motherboard': {
      const mb = item as MotherboardSpec;
      return `Socket ${mb.socket} · Chipset ${mb.chipset} · ${mb.ramGeneration} · ${mb.formFactor}`;
    }
    case 'cpu': {
      const cpu = item as CpuSpec;
      return `Socket ${cpu.socket} · ${cpu.cores}C/${cpu.threads}T · ${cpu.baseClockGhz}–${cpu.boostClockGhz} GHz · TDP ${cpu.tdpWatts ?? '?'}W`;
    }
    case 'ram': {
      const ram = item as RamSpec;
      return `${ram.generation}-${ram.speedMTs} · ${ram.capacityGb} GB · ${ram.formFactor} (${ram.pins} pinos · ${ram.voltageV}V)`;
    }
    case 'storage': {
      const st = item as StorageSpec;
      return `${st.storageType.replace(/_/g, ' ')} · ${st.capacityGb} GB · ${st.protocol} · ${st.readSpeedMBs} MB/s`;
    }
    case 'gpu': {
      const gpu = item as GpuSpec;
      return `${gpu.interface} · ${gpu.vramGb > 0 ? `${gpu.vramGb} GB ${gpu.vramType}` : 'Expansão'} · ${gpu.tdpWatts}W · ${gpu.lengthMm} mm`;
    }
    case 'cooler': {
      const c = item as CoolerSpec;
      return `Até ${c.maxTdpWatts}W TDP · Altura ${c.heightMm} mm · Sockets: ${c.supportedSockets.slice(0, 4).join(', ')}`;
    }
    case 'psu': {
      const p = item as PsuSpec;
      return `${p.wattage !== null ? `${p.wattage}W` : 'Potência Desconhecida'} · ${p.efficiencyRating} · PCIe 8-pin: ${p.pcie8PinCount}`;
    }
    case 'case': {
      const cs = item as CaseSpec;
      return `Suporta ${cs.supportedFormFactors.join('/')} · GPU máx ${cs.maxGpuLengthMm} mm · Cooler máx ${cs.maxCoolerHeightMm} mm`;
    }
    case 'cable':
      return `${item.manufacturer} · ${item.model}`;
  }
}

export const CatalogSidebar: React.FC<{ onOpenInspectorModal: () => void }> = ({
  onOpenInspectorModal,
}) => {
  const activeCategory = useSimulatorStore((s) => s.activeCategory);
  const setActiveCategory = useSimulatorStore((s) => s.setActiveCategory);
  const searchQuery = useSimulatorStore((s) => s.searchQuery);
  const setSearchQuery = useSimulatorStore((s) => s.setSearchQuery);

  const installed = useSimulatorStore((s) => s.installed);
  const heldItemId = useSimulatorStore((s) => s.heldItemId);
  const heldRotationStep = useSimulatorStore((s) => s.heldRotationStep);
  const pickUpItem = useSimulatorStore((s) => s.pickUpItem);
  const rotateHeldItem = useSimulatorStore((s) => s.rotateHeldItem);
  const cancelHeldItem = useSimulatorStore((s) => s.cancelHeldItem);
  const attemptInstallItem = useSimulatorStore((s) => s.attemptInstallItem);
  const attemptRemoveFromSlot = useSimulatorStore((s) => s.attemptRemoveFromSlot);
  const setSelectedInspectItemId = useSimulatorStore((s) => s.setSelectedInspectItemId);
  const setInspectorTab = useSimulatorStore((s) => s.setInspectorTab);

  const [sidebarView, setSidebarView] = useState<'CATALOG' | 'INSTALLED'>('CATALOG');
  const [customRamSlot, setCustomRamSlot] = useState<'slot_ram_1' | 'slot_ram_2' | 'slot_ram_3' | 'slot_ram_4'>('slot_ram_2');
  const [customM2Slot, setCustomM2Slot] = useState<'slot_m2_1' | 'slot_m2_2'>('slot_m2_1');

  const filteredItems = ALL_HARDWARE_ITEMS.filter((item) => {
    const matchesCat = searchQuery.trim().length > 0 ? true : item.category === activeCategory;
    if (!matchesCat) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.manufacturer.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      formatItemKicker(item).toLowerCase().includes(q)
    );
  });

  // Build installed list for easy inspection and removal
  const installedList: { slot: SnapSlotId; slotLabel: string; itemName: string; itemId?: string }[] = [];
  if (installed.caseId) {
    installedList.push({
      slot: 'slot_case',
      slotLabel: 'Gabinete',
      itemName: getHardwareById(installed.caseId)?.name ?? installed.caseId,
      itemId: installed.caseId,
    });
  }
  if (installed.standoffsInstalled) {
    installedList.push({
      slot: 'slot_standoffs',
      slotLabel: 'Espaçadores Chassi',
      itemName: 'Kit de Espaçadores Metálicos (Standoffs M3)',
      itemId: 'acc-standoffs-kit',
    });
  }
  if (installed.motherboardId) {
    installedList.push({
      slot: 'slot_motherboard',
      slotLabel: 'Placa-Mãe',
      itemName: getHardwareById(installed.motherboardId)?.name ?? installed.motherboardId,
      itemId: installed.motherboardId,
    });
  }
  if (installed.cpuId) {
    installedList.push({
      slot: 'slot_cpu',
      slotLabel: 'Socket CPU',
      itemName: getHardwareById(installed.cpuId)?.name ?? installed.cpuId,
      itemId: installed.cpuId,
    });
  }
  if (installed.thermalPasteApplied) {
    installedList.push({
      slot: 'slot_thermal_paste',
      slotLabel: 'Interface Térmica',
      itemName: 'Pasta Térmica Arctic MX-4 Aplicada',
      itemId: 'acc-thermal-paste-mx4',
    });
  }
  if (installed.coolerId) {
    installedList.push({
      slot: 'slot_cooler',
      slotLabel: 'Cooler CPU',
      itemName: getHardwareById(installed.coolerId)?.name ?? installed.coolerId,
      itemId: installed.coolerId,
    });
  }
  (['slot_ram_1', 'slot_ram_2', 'slot_ram_3', 'slot_ram_4'] as const).forEach((rk, i) => {
    const rId = installed.ramSlots[rk];
    if (rId) {
      installedList.push({
        slot: rk,
        slotLabel: `Slot DIMM ${i + 1}`,
        itemName: getHardwareById(rId)?.name ?? rId,
        itemId: rId,
      });
    }
  });
  (['slot_m2_1', 'slot_m2_2'] as const).forEach((mk, i) => {
    const mId = installed.m2Slots[mk];
    if (mId) {
      installedList.push({
        slot: mk,
        slotLabel: `Slot M.2_${i + 1}`,
        itemName: getHardwareById(mId)?.name ?? mId,
        itemId: mId,
      });
    }
  });
  (['slot_drive_bay_1', 'slot_drive_bay_2'] as const).forEach((bk, i) => {
    const dId = installed.driveBays[bk];
    if (dId) {
      installedList.push({
        slot: bk,
        slotLabel: `Baia SATA ${i + 1}`,
        itemName: getHardwareById(dId)?.name ?? dId,
        itemId: dId,
      });
    }
  });
  if (installed.gpuId) {
    installedList.push({
      slot: 'slot_gpu_pcie16',
      slotLabel: 'PCIe x16 Principal',
      itemName: getHardwareById(installed.gpuId)?.name ?? installed.gpuId,
      itemId: installed.gpuId,
    });
  }
  if (installed.pcieAddonId) {
    installedList.push({
      slot: 'slot_pcie_x1',
      slotLabel: 'PCIe x1 Expansão',
      itemName: getHardwareById(installed.pcieAddonId)?.name ?? installed.pcieAddonId,
      itemId: installed.pcieAddonId,
    });
  }
  if (installed.psuId) {
    installedList.push({
      slot: 'slot_psu',
      slotLabel: 'Fonte (PSU)',
      itemName: getHardwareById(installed.psuId)?.name ?? installed.psuId,
      itemId: installed.psuId,
    });
  }
  if (installed.cables.atx24Pin) {
    installedList.push({
      slot: 'slot_cable_24pin',
      slotLabel: 'Cabo ATX 24-Pin',
      itemName: 'Cabo Alimentação Principal 24 Pinos',
      itemId: 'cable-atx-24pin',
    });
  }
  if (installed.cables.cpuEps) {
    installedList.push({
      slot: 'slot_cable_cpu_eps',
      slotLabel: 'Cabo CPU EPS',
      itemName: 'Cabo Alimentação CPU EPS 12V',
      itemId: 'cable-cpu-eps-8pin',
    });
  }
  if (installed.cables.pciePower) {
    installedList.push({
      slot: 'slot_cable_pcie_power',
      slotLabel: 'Cabo Energia GPU',
      itemName: 'Cabo Alimentação PCIe Placa de Vídeo',
      itemId: 'cable-pcie-power',
    });
  }
  if (installed.cables.sataData) {
    installedList.push({
      slot: 'slot_cable_sata',
      slotLabel: 'Cabos SATA',
      itemName: 'Kit Cabo de Dados e Energia SATA',
      itemId: 'cable-sata-data-and-power',
    });
  }
  if (installed.cables.frontPanel) {
    installedList.push({
      slot: 'slot_cable_front_panel',
      slotLabel: 'Painel Frontal',
      itemName: 'Conectores F_PANEL (PWR_SW / LEDs)',
      itemId: 'cable-front-panel-fpanel',
    });
  }

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-800 bg-slate-900/95">
      {/* Top Segmented Switch: Catálogo vs Peças Instaladas */}
      <div className="border-b border-slate-800 p-3">
        <div className="flex items-center gap-1 rounded-lg bg-slate-950 p-1">
          <button
            type="button"
            onClick={() => setSidebarView('CATALOG')}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              sidebarView === 'CATALOG'
                ? 'bg-sky-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Catálogo de Peças ({ALL_HARDWARE_ITEMS.length})
          </button>
          <button
            type="button"
            onClick={() => setSidebarView('INSTALLED')}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              sidebarView === 'INSTALLED'
                ? 'bg-sky-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Na Bancada ({installedList.length})
          </button>
        </div>

        {sidebarView === 'CATALOG' && (
          <div className="relative mt-2.5">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar socket, DDR4, DDR5, Ryzen, HDD..."
              aria-label="Buscar componente no catálogo"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Held Item Active Banner (for 3D Drag & Orientation control) */}
      {heldItemId && (
        <div className="border-b border-sky-500/40 bg-sky-950/70 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-300">
              Peça na Mão: {getHardwareById(heldItemId)?.name}
            </span>
            <span className="font-mono text-xs text-amber-300 tabular-nums">
              Orientação: {heldRotationStep * 90}°
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-300">
            Mova o cursor sobre a bancada 3D até o anel de encaixe e clique para instalar, ou gire a peça:
          </p>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={rotateHeldItem}
              className="flex items-center gap-1.5 rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-100 hover:bg-slate-700 whitespace-nowrap"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Girar Peça (Tecla R)
            </button>
            <button
              type="button"
              onClick={cancelHeldItem}
              className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-rose-300 hover:bg-slate-700 whitespace-nowrap"
            >
              Soltar (Esc)
            </button>
          </div>
        </div>
      )}

      {sidebarView === 'CATALOG' ? (
        <>
          {/* Category Filter Bar */}
          <div className="flex flex-wrap gap-1 border-b border-slate-800 bg-slate-950/60 p-2">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id && !searchQuery.trim();
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory(cat.id);
                  }}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Slot Target Selector for RAM or M.2 */}
          {activeCategory === 'ram' && !searchQuery && (
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-3 py-2 text-xs">
              <span className="text-slate-400">Slot DIMM Alvo:</span>
              <div className="flex gap-1">
                {(['slot_ram_1', 'slot_ram_2', 'slot_ram_3', 'slot_ram_4'] as const).map((s, idx) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCustomRamSlot(s)}
                    className={`rounded px-2 py-0.5 font-mono text-xs font-medium ${
                      customRamSlot === s
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'storage' && !searchQuery && (
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-3 py-2 text-xs">
              <span className="text-slate-400">Slot M.2 Alvo:</span>
              <div className="flex gap-1">
                {(['slot_m2_1', 'slot_m2_2'] as const).map((s, idx) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCustomM2Slot(s)}
                    className={`rounded px-2 py-0.5 font-mono text-xs font-medium ${
                      customM2Slot === s
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    M.2_{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Component List */}
          <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
            {filteredItems.map((item) => {
              const isHeld = heldItemId === item.id;
              const targetSlot: SnapSlotId =
                item.category === 'ram'
                  ? customRamSlot
                  : item.category === 'storage' && (item as StorageSpec).formFactor === 'M2_2280'
                  ? customM2Slot
                  : getSuggestedTargetSlotForItem(item.id, installed);

              const isAlreadyInstalled =
                installed.motherboardId === item.id ||
                installed.cpuId === item.id ||
                installed.coolerId === item.id ||
                installed.gpuId === item.id ||
                installed.pcieAddonId === item.id ||
                installed.psuId === item.id ||
                installed.caseId === item.id ||
                Object.values(installed.ramSlots).includes(item.id) ||
                Object.values(installed.m2Slots).includes(item.id) ||
                Object.values(installed.driveBays).includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`rounded-lg border p-3 transition-colors ${
                    isHeld
                      ? 'border-sky-500 bg-sky-950/30'
                      : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                  }`}
                >
                  {/* Unboxed metadata kicker */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{formatItemKicker(item)}</span>
                    {isAlreadyInstalled && (
                      <span className="flex items-center gap-1 font-medium text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Na Bancada
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1 text-sm font-semibold text-slate-100">{item.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.summary}</p>

                  {item.incompleteSpecsWarning && (
                    <p className="mt-1.5 text-xs font-medium text-amber-400">
                      Aviso Técnico: {item.incompleteSpecsWarning}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => attemptInstallItem(item.id, targetSlot)}
                      className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 transition-colors whitespace-nowrap"
                    >
                      Encaixar no Slot
                    </button>

                    <button
                      type="button"
                      onClick={() => pickUpItem(item.id)}
                      className={`flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                        isHeld
                          ? 'border-sky-400 bg-sky-900/60 text-sky-200'
                          : 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <Hand className="h-3.5 w-3.5" />
                      {isHeld ? 'Arrastando 3D' : 'Arrastar 3D'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedInspectItemId(item.id);
                        setInspectorTab(
                          item.category === 'storage' && (item as StorageSpec).storageType === 'HDD'
                            ? 'HOW_IT_WORKS'
                            : 'OVERVIEW'
                        );
                        onOpenInspectorModal();
                      }}
                      className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {item.category === 'storage' && (item as StorageSpec).storageType === 'HDD'
                        ? 'Abrir HDD 3D'
                        : 'Detalhes / 3D'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Installed Hardware List with Dependency-Checked Removal */
        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          <p className="text-xs text-slate-400">
            Gerencie as peças atualmente instaladas na bancada. A desmontagem respeita a ordem técnica real (ex: remova o cooler antes da CPU; desconecte os cabos antes de retirar a fonte ou placa-mãe).
          </p>
          {installedList.length === 0 ? (
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-6 text-center text-xs text-slate-400">
              Nenhuma peça instalada na bancada no momento.
            </div>
          ) : (
            installedList.map((entry) => (
              <div
                key={entry.slot}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-2.5"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs text-slate-400">{entry.slotLabel}</div>
                  <div className="truncate text-xs font-semibold text-slate-100">
                    {entry.itemName}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {entry.itemId && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedInspectItemId(entry.itemId!);
                        setInspectorTab('HOW_IT_WORKS');
                        onOpenInspectorModal();
                      }}
                      className="rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-sky-300 hover:bg-slate-700 whitespace-nowrap"
                    >
                      Animação 3D
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => attemptRemoveFromSlot(entry.slot)}
                    aria-label={`Remover ${entry.itemName}`}
                    className="flex items-center gap-1 rounded-md bg-rose-950/70 px-2 py-1 text-xs font-medium text-rose-300 hover:bg-rose-900 whitespace-nowrap"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remover
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </aside>
  );
};
