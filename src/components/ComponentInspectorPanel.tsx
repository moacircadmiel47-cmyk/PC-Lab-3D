import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Disc,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  HelpCircle,
} from 'lucide-react';
import {
  useSimulatorStore,
  getSuggestedTargetSlotForItem,
} from '../store/useSimulatorStore';
import {
  getHardwareById,
  ALL_HARDWARE_ITEMS,
} from '../data/catalog';
import {
  MOTHERBOARD_REGIONS,
  REVIEW_QUESTIONS,
} from '../data/educationalContent';
import { validateInstallation } from '../engine/compatibility';
import { ComponentMechanismCanvas } from '../three/ComponentMechanismCanvas';
import {
  MotherboardSpec,
  CpuSpec,
  RamSpec,
  StorageSpec,
  GpuSpec,
  CoolerSpec,
  PsuSpec,
  CaseSpec,
} from '../types/hardware';

export const ComponentInspectorPanel: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const selectedInspectItemId = useSimulatorStore((s) => s.selectedInspectItemId);
  const setSelectedInspectItemId = useSimulatorStore((s) => s.setSelectedInspectItemId);
  const inspectorTab = useSimulatorStore((s) => s.inspectorTab);
  const setInspectorTab = useSimulatorStore((s) => s.setInspectorTab);
  const installed = useSimulatorStore((s) => s.installed);
  const attemptInstallItem = useSimulatorStore((s) => s.attemptInstallItem);

  // HDD & Mechanism Lab Controls
  const hddViewMode = useSimulatorStore((s) => s.hddViewMode);
  const setHddViewMode = useSimulatorStore((s) => s.setHddViewMode);
  const hddOperation = useSimulatorStore((s) => s.hddOperation);
  const setHddOperation = useSimulatorStore((s) => s.setHddOperation);
  const hddSpeedMultiplier = useSimulatorStore((s) => s.hddSpeedMultiplier);
  const setHddSpeedMultiplier = useSimulatorStore((s) => s.setHddSpeedMultiplier);
  const hddTargetTrack = useSimulatorStore((s) => s.hddTargetTrack);
  const triggerHddSeek = useSimulatorStore((s) => s.triggerHddSeek);
  const mechanismPlaying = useSimulatorStore((s) => s.mechanismPlaying);
  const setMechanismPlaying = useSimulatorStore((s) => s.setMechanismPlaying);
  const selectedMotherboardRegionId = useSimulatorStore((s) => s.selectedMotherboardRegionId);
  const setSelectedMotherboardRegionId = useSimulatorStore((s) => s.setSelectedMotherboardRegionId);

  const [ramVolatilePowerOn, setRamVolatilePowerOn] = useState(true);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);

  const item = getHardwareById(selectedInspectItemId) ?? ALL_HARDWARE_ITEMS[0];
  const isHdd = item.category === 'storage' && (item as StorageSpec).storageType === 'HDD';

  const suggestedSlot = getSuggestedTargetSlotForItem(item.id, installed);
  const liveCompatibility = validateInstallation(installed, item.id, suggestedSlot, 0);

  const categoryQuestions = REVIEW_QUESTIONS.filter(
    (q) => q.category === item.category || q.category === 'general'
  );
  const currentQuestion = categoryQuestions[0] ?? REVIEW_QUESTIONS[0];

  const activeMbRegion =
    MOTHERBOARD_REGIONS.find((r) => r.id === selectedMotherboardRegionId) ??
    MOTHERBOARD_REGIONS[0];

  return (
    <div
      role="dialog"
      aria-label={`Inspetor Técnico: ${item.name}`}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4"
    >
      <div className="flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Top Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{item.manufacturer}</span>
              <span aria-hidden="true">·</span>
              <span>Modelo: {item.model}</span>
              <span aria-hidden="true">·</span>
              <span className="text-sky-400">
                {item.isDidacticGeneric ? 'Modelo Didático de Laboratório' : 'Especificação Verificada'}
              </span>
            </div>
            <h2 className="mt-0.5 text-lg font-bold text-white">{item.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick switcher to jump straight to HDD 3.5" from anywhere */}
            {!isHdd && (
              <button
                type="button"
                onClick={() => {
                  setSelectedInspectItemId('storage-hdd-seagate-2tb-35');
                  setInspectorTab('HOW_IT_WORKS');
                }}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/50 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 whitespace-nowrap"
              >
                <Disc className="h-4 w-4" />
                Ver Demonstração Interna do HDD 3,5"
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                attemptInstallItem(item.id, suggestedSlot);
                onClose();
              }}
              className="rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 whitespace-nowrap"
            >
              Encaixar na Bancada
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar Painel de Informações"
              className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 6 Required Navigation Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-slate-800 bg-slate-950/60 px-6 py-2">
          {(
            [
              { id: 'OVERVIEW', label: '1. Visão Geral' },
              { id: 'SPECS', label: '2. Especificações Técnicas' },
              { id: 'HOW_IT_WORKS', label: '3. Como Funciona (Animação 3D)' },
              { id: 'INSTALLATION', label: '4. Instalação e Cuidados' },
              { id: 'COMPATIBILITY', label: '5. Compatibilidade Real' },
              { id: 'QUIZ', label: '6. Teste Seus Conhecimentos' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setInspectorTab(t.id);
                setSelectedQuizAnswer(null);
              }}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                inspectorTab === t.id
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Main Content Body: Left 3D Interactive Mechanism Viewport + Right Context Deck */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">
          {/* Left 7 Columns: Live 3D Interactive Mechanism Stage */}
          <div className="relative flex flex-col border-b border-slate-800 bg-slate-950 lg:col-span-7 lg:border-b-0 lg:border-r">
            <div className="flex-1 min-h-[280px]">
              <ComponentMechanismCanvas
                itemId={item.id}
                volatilePowerOn={ramVolatilePowerOn}
              />
            </div>

            {/* Interactive Controls Bar over/under the 3D Mechanism Canvas */}
            <div className="border-t border-slate-800 bg-slate-900/95 p-3">
              {isHdd ? (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-emerald-400">
                      Laboratório Mecânico 3D do HDD ({(item as StorageSpec).rpm} RPM)
                    </span>
                    <div className="flex items-center gap-1">
                      {(
                        [
                          { id: 'CLOSED', label: 'HDD Fechado' },
                          { id: 'CUTAWAY', label: 'Vista em Corte' },
                          { id: 'INTERNAL_ZOOM', label: 'Interno Aberto' },
                        ] as const
                      ).map((vm) => (
                        <button
                          key={vm.id}
                          type="button"
                          onClick={() => setHddViewMode(vm.id)}
                          className={`rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                            hddViewMode === vm.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {vm.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Operation & Track Seek Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-2">
                    <div className="flex flex-wrap items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setMechanismPlaying(!mechanismPlaying)}
                        className="flex items-center gap-1 rounded bg-sky-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-sky-500"
                      >
                        {mechanismPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        {mechanismPlaying ? 'Pausar' : 'Iniciar'}
                      </button>

                      {(
                        [
                          { id: 'READ', label: 'Leitura (Read)' },
                          { id: 'WRITE', label: 'Gravação (Write)' },
                          { id: 'SEEK', label: 'Busca (Seek)' },
                          { id: 'IDLE', label: 'Repouso' },
                        ] as const
                      ).map((op) => (
                        <button
                          key={op.id}
                          type="button"
                          onClick={() => setHddOperation(op.id)}
                          className={`rounded px-2 py-1 text-xs font-medium ${
                            hddOperation === op.id
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {op.label}
                        </button>
                      ))}
                    </div>

                    {/* Speed Multiplier */}
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-slate-400">Velocidade:</span>
                      {[0.25, 0.5, 1, 2].map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          onClick={() => setHddSpeedMultiplier(spd)}
                          className={`rounded px-1.5 py-0.5 font-mono text-xs ${
                            hddSpeedMultiplier === spd
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Track Seek Selector (0..5) + Live Telemetry */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Mover Braço para Trilha:</span>
                      {[0, 1, 2, 3, 4, 5].map((tr) => (
                        <button
                          key={tr}
                          type="button"
                          onClick={() => triggerHddSeek(tr, (tr * 3 + 2) % 12, hddOperation === 'IDLE' ? 'READ' : hddOperation)}
                          className={`rounded px-2 py-0.5 font-mono text-xs ${
                            hddTargetTrack === tr
                              ? 'bg-sky-500 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          T#{tr}
                        </button>
                      ))}
                    </div>

                    <div className="font-mono text-xs text-slate-300 tabular-nums">
                      Trilha #{hddTargetTrack} · Seek: {(4.2 + hddTargetTrack * 1.4).toFixed(1)} ms · Latência Rot.: 4.17 ms
                    </div>
                  </div>
                </div>
              ) : (
                /* Controls for CPU, RAM, SSD, Motherboard, PSU, Cooler, GPU */
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMechanismPlaying(!mechanismPlaying)}
                      className="flex items-center gap-1.5 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500"
                    >
                      {mechanismPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      {mechanismPlaying ? 'Pausar Animação' : 'Iniciar Animação'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMechanismPlaying(true);
                        setHddSpeedMultiplier(1);
                      }}
                      className="flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reiniciar
                    </button>
                  </div>

                  {item.category === 'ram' && (
                    <button
                      type="button"
                      onClick={() => setRamVolatilePowerOn(!ramVolatilePowerOn)}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                        ramVolatilePowerOn
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                          : 'bg-rose-600 text-white hover:bg-rose-500'
                      }`}
                    >
                      <Zap className="h-3.5 w-3.5" />
                      {ramVolatilePowerOn
                        ? 'Energia Ligada (Dados Mantidos na RAM)'
                        : 'Energia Cortada! (Memória Volátil Esvaziada)'}
                    </button>
                  )}

                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-400">Velocidade:</span>
                    {[0.5, 1, 2].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setHddSpeedMultiplier(spd)}
                        className={`rounded px-2 py-1 font-mono text-xs ${
                          hddSpeedMultiplier === spd
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right 5 Columns: Contextual Educational & Technical Details */}
          <div className="flex flex-col overflow-y-auto p-6 lg:col-span-5">
            {inspectorTab === 'OVERVIEW' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-sky-400">O Que É e Sua Função no Computador</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-200">{item.summary}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.functionInPc}</p>
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <h4 className="text-xs font-semibold text-amber-400">Cuidados Importantes no Manuseio</h4>
                  <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-300">
                    {item.handlingPrecautions.map((prec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-mono text-amber-400">0{idx + 1}.</span>
                        <span>{prec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <h4 className="text-xs font-semibold text-emerald-400">Curiosidades Técnicas (ITIC)</h4>
                  <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-300">
                    {item.curiosities.map((cur, idx) => (
                      <li key={idx}>{cur}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {inspectorTab === 'SPECS' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-sky-400">Ficha de Especificações Técnicas</h3>

                {item.incompleteSpecsWarning && (
                  <div className="rounded-lg border border-amber-500/40 bg-amber-950/40 p-3 text-xs text-amber-200">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                      <AlertTriangle className="h-4 w-4" />
                      Documentação Técnica Incompleta (Informações Insuficientes)
                    </div>
                    <p className="mt-1">{item.incompleteSpecsWarning}</p>
                  </div>
                )}

                <div className="divide-y divide-slate-800 rounded-lg border border-slate-800 bg-slate-950 text-xs">
                  <div className="flex justify-between px-3 py-2">
                    <span className="text-slate-400">Fabricante / Modelo</span>
                    <span className="font-mono text-slate-100">{item.manufacturer} {item.model}</span>
                  </div>

                  {item.category === 'motherboard' && (() => {
                    const mb = item as MotherboardSpec;
                    return (
                      <>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Socket / Plataforma</span>
                          <span className="font-mono text-slate-100">{mb.socket} ({mb.platform})</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Chipset / Formato</span>
                          <span className="font-mono text-slate-100">{mb.chipset} · {mb.formFactor}</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Memória Suportada</span>
                          <span className="font-mono text-slate-100 tabular-nums">
                            {mb.ramSlots}x {mb.ramGeneration} ({mb.ramFormFactor}) · Máx {mb.maxRamCapacityGb ?? 'Não Documentado'} GB
                          </span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Versão BIOS de Fábrica / Atual</span>
                          <span className="font-mono text-slate-100">{mb.shippedBiosVersion} (Última: {mb.latestBiosVersion})</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Conectores de Energia</span>
                          <span className="font-mono text-slate-100">{mb.mainPowerConnector} ATX + {mb.cpuPowerConnector} EPS CPU</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Armazenamento (SATA / M.2)</span>
                          <span className="font-mono text-slate-100 tabular-nums">{mb.sataPorts} portas SATA · {mb.m2Slots.length} slot(s) M.2</span>
                        </div>
                      </>
                    );
                  })()}

                  {item.category === 'cpu' && (() => {
                    const cpu = item as CpuSpec;
                    return (
                      <>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Socket / Arquitetura</span>
                          <span className="font-mono text-slate-100">{cpu.socket} · {cpu.architecture}</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Núcleos / Threads</span>
                          <span className="font-mono text-slate-100 tabular-nums">{cpu.cores} Núcleos / {cpu.threads} Threads</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Frequência Base / Boost</span>
                          <span className="font-mono text-slate-100 tabular-nums">{cpu.baseClockGhz} GHz / {cpu.boostClockGhz} GHz</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Cache Total / TDP</span>
                          <span className="font-mono text-slate-100 tabular-nums">{cpu.cacheMb} MB · {cpu.tdpWatts ?? '?'} Watts</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Memórias Suportadas (IMC)</span>
                          <span className="font-mono text-slate-100">{cpu.supportedRamTypes.join(' / ')}</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Gráficos Integrados (iGPU)</span>
                          <span className="font-mono text-slate-100">
                            {cpu.hasIntegratedGraphics ? cpu.integratedGraphicsName : 'Ausente (Exige GPU Dedicada)'}
                          </span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Chipsets Compatíveis</span>
                          <span className="font-mono text-slate-100">{cpu.compatibleChipsets.join(', ')}</span>
                        </div>
                      </>
                    );
                  })()}

                  {item.category === 'ram' && (() => {
                    const ram = item as RamSpec;
                    return (
                      <>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Geração DDR / Formato</span>
                          <span className="font-mono text-slate-100">{ram.generation} · {ram.formFactor}</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Capacidade / Taxa</span>
                          <span className="font-mono text-slate-100 tabular-nums">{ram.capacityGb} GB · {ram.speedMTs} MT/s ({ram.casLatency})</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Contatos / Tensão Nominal</span>
                          <span className="font-mono text-slate-100 tabular-nums">{ram.pins} pinos · {ram.voltageV}V</span>
                        </div>
                      </>
                    );
                  })()}

                  {item.category === 'storage' && (() => {
                    const st = item as StorageSpec;
                    return (
                      <>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Tipo / Formato Físico</span>
                          <span className="font-mono text-slate-100">{st.storageType} · {st.formFactor}</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Interface / Protocolo</span>
                          <span className="font-mono text-slate-100">{st.interface} · {st.protocol}</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Chaveamento M.2 / Rotação</span>
                          <span className="font-mono text-slate-100">
                            {st.m2Key !== 'NONE' ? `Chave ${st.m2Key}` : `${st.rpm ? `${st.rpm} RPM` : 'Estado Sólido (0 RPM)'}`}
                          </span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Leitura / Gravação Sequencial</span>
                          <span className="font-mono text-slate-100 tabular-nums">{st.readSpeedMBs} MB/s / {st.writeSpeedMBs} MB/s</span>
                        </div>
                      </>
                    );
                  })()}

                  {item.category === 'gpu' && (() => {
                    const g = item as GpuSpec;
                    return (
                      <>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Barramento / Memória de Vídeo</span>
                          <span className="font-mono text-slate-100">{g.interface} Gen {g.pcieGeneration} · {g.vramGb} GB {g.vramType}</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Comprimento / TDP / Conector</span>
                          <span className="font-mono text-slate-100 tabular-nums">{g.lengthMm} mm · {g.tdpWatts}W · {g.requiredPowerConnector}</span>
                        </div>
                      </>
                    );
                  })()}

                  {item.category === 'cooler' && (() => {
                    const c = item as CoolerSpec;
                    return (
                      <>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Capacidade Térmica / Altura</span>
                          <span className="font-mono text-slate-100 tabular-nums">Até {c.maxTdpWatts}W TDP · {c.heightMm} mm</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Sockets Compatíveis</span>
                          <span className="font-mono text-slate-100">{c.supportedSockets.join(', ')}</span>
                        </div>
                      </>
                    );
                  })()}

                  {item.category === 'psu' && (() => {
                    const p = item as PsuSpec;
                    return (
                      <>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Potência Nominal / Eficiência</span>
                          <span className="font-mono text-slate-100 tabular-nums">
                            {p.wattage !== null ? `${p.wattage} Watts` : 'Não Informada (Insuficiente)'} · {p.efficiencyRating}
                          </span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Conectores Disponíveis</span>
                          <span className="font-mono text-slate-100">
                            24-pin · {p.cpu8PinCount}x EPS CPU · {p.pcie8PinCount}x PCIe 8-pin {p.has12V2x6Connector ? '+ 12V-2x6' : ''}
                          </span>
                        </div>
                      </>
                    );
                  })()}

                  {item.category === 'case' && (() => {
                    const cs = item as CaseSpec;
                    return (
                      <>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Placas-Mãe Suportadas</span>
                          <span className="font-mono text-slate-100">{cs.supportedFormFactors.join(', ')}</span>
                        </div>
                        <div className="flex justify-between px-3 py-2">
                          <span className="text-slate-400">Limite GPU / Limite Cooler</span>
                          <span className="font-mono text-slate-100 tabular-nums">GPU até {cs.maxGpuLengthMm} mm · Cooler até {cs.maxCoolerHeightMm} mm</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {inspectorTab === 'HOW_IT_WORKS' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-sky-400">
                  Como Funciona Internamente (Representação Didática 3D)
                </h3>

                {isHdd ? (
                  <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-3 text-emerald-200">
                      <strong>Nota Didática:</strong> Esta visualização 3D interativa representa de forma didática a organização interna de um HDD em trilhas e setores para ensino de arquitetura de computadores. Em um disco real, o compartimento é hermeticamente protegido contra poeira.
                    </div>
                    <p>
                      <strong>1. Pratos Magnéticos e Motor de Eixo (Spindle):</strong> Os discos rígidos armazenam bits alterando a polaridade magnética em trilhas circulares concêntricas (divididas em setores). O motor central gira os pratos continuamente a {(item as StorageSpec).rpm} RPM.
                    </p>
                    <p>
                      <strong>2. Braço Atuador (Bobina de Voz) e Cabeça de Leitura/Escrita:</strong> Quando o sistema solicita um arquivo, a bobina eletromagnética move o braço radialmente até a <strong>Trilha #{hddTargetTrack}</strong> (Tempo de Busca / <em>Seek Time</em>). A cabeça espera o setor desejado passar sob ela (Latência Rotacional) e lê ou grava o fluxo magnético (pulsos azuis/laranjas) enviando os bits ao <strong>Controlador SATA</strong>.
                    </p>
                    <p>
                      <strong>3. Acesso Mecânico vs Acesso Eletrônico (SSD):</strong> Como o HDD precisa mover fisicamente o braço e esperar o prato girar, cada acesso aleatório leva ~8 a 12 milissegundos — cerca de 200 vezes mais lento que o acesso puramente eletrônico de um SSD Flash!
                    </p>
                  </div>
                ) : item.category === 'motherboard' ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-300">
                      Clique em uma região da placa-mãe abaixo para inspecionar sua função, importância e componentes relacionados:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {MOTHERBOARD_REGIONS.map((reg) => (
                        <button
                          key={reg.id}
                          type="button"
                          onClick={() => setSelectedMotherboardRegionId(reg.id)}
                          className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                            selectedMotherboardRegionId === reg.id
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {reg.name}
                        </button>
                      ))}
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-xs space-y-2">
                      <h4 className="font-semibold text-white">{activeMbRegion.name}</h4>
                      <p className="text-slate-300"><strong>Função:</strong> {activeMbRegion.role}</p>
                      <p className="text-slate-300"><strong>Importância Técnica:</strong> {activeMbRegion.importance}</p>
                      <p className="text-sky-400">
                        <strong>Relacionado com:</strong> {activeMbRegion.relatedComponents.join(' · ')}
                      </p>
                    </div>
                  </div>
                ) : item.category === 'psu' ? (
                  <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                    <div className="rounded-lg border border-rose-500/40 bg-rose-950/40 p-3 text-rose-200">
                      <strong>AVISO DE SEGURANÇA ELÉTRICA:</strong> Nunca abra uma fonte de alimentação real! Os capacitores do estágio primário armazenam alta tensão letal (300V–400V DC) mesmo após desconectar o cabo da tomada. A visualização ao lado é exclusivamente didática.
                    </div>
                    <p>
                      A fonte chaveada converte a corrente alternada da rede elétrica (110V/220V AC) em tensões contínuas de baixa voltagem e alta estabilidade: <strong>+12V</strong> (CPU, GPU e motores), <strong>+5V</strong> (portas USB e lógica) e <strong>+3.3V</strong> (M.2 e chipset).
                    </p>
                  </div>
                ) : item.category === 'ram' ? (
                  <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                    <p>
                      Cada célula de memória DRAM armazena 1 bit em um capacitor microscópico acompanhado de um transistor. Como esses capacitores descarregam em milissegundos, precisam de energia contínua (<em>Refresh</em>).
                    </p>
                    <p>
                      <strong>Experimente na animação 3D ao lado:</strong> Clique no botão <em>"Energia Ligada / Cortada"</em> abaixo do modelo 3D para observar que os dados mantidos na RAM desaparecem instantaneamente quando a alimentação elétrica é interrompida (memória volátil)!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                    <p>{item.functionInPc}</p>
                    <p>
                      Na visualização 3D interativa ao lado, observe o fluxo conceitual de dados/calor entre o componente e o barramento principal. Use os controles para pausar, reiniciar ou alterar a velocidade da simulação.
                    </p>
                  </div>
                )}
              </div>
            )}

            {inspectorTab === 'INSTALLATION' && (
              <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                <h3 className="text-sm font-semibold text-sky-400">Procedimento de Instalação e Dependências</h3>
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 space-y-2">
                  <div>
                    <span className="text-slate-400">Ponto de Encaixe Alvo (Snap Point): </span>
                    <span className="font-mono text-sky-300">{suggestedSlot}</span>
                  </div>
                  <p>
                    Para instalar na bancada 3D, clique em <strong>"Arrastar 3D"</strong> e posicione a peça sobre o anel indicador na bancada, ou clique em <strong>"Encaixar na Bancada"</strong>.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-amber-400">Regras de Segurança e Ordem de Montagem:</h4>
                  {item.handlingPrecautions.map((p, i) => (
                    <p key={i}>• {p}</p>
                  ))}
                </div>
              </div>
            )}

            {inspectorTab === 'COMPATIBILITY' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-sky-400">
                  Diagnóstico de Compatibilidade com a Bancada Atual
                </h3>
                <div
                  className={`rounded-lg border p-4 text-xs ${
                    liveCompatibility.allowed
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-100'
                      : liveCompatibility.status === 'INSUFFICIENT_DATA'
                      ? 'border-amber-500/40 bg-amber-950/30 text-amber-100'
                      : 'border-rose-500/40 bg-rose-950/30 text-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {liveCompatibility.allowed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400" />
                    )}
                    <span>{liveCompatibility.title}</span>
                  </div>
                  <p className="mt-2 leading-relaxed">{liveCompatibility.message}</p>
                  <p className="mt-2 text-slate-300">
                    <strong>Fundamento Técnico:</strong> {liveCompatibility.educationalDetails}
                  </p>
                  {liveCompatibility.remediation && (
                    <p className="mt-2 font-medium text-sky-300">
                      Como resolver: {liveCompatibility.remediation}
                    </p>
                  )}
                </div>
              </div>
            )}

            {inspectorTab === 'QUIZ' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-sky-400">
                  <HelpCircle className="h-4 w-4" />
                  <span>Pergunta de Revisão Pedagógica</span>
                </div>
                <p className="text-xs font-medium leading-relaxed text-slate-100">
                  {currentQuestion.question}
                </p>
                <div className="space-y-2">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selectedQuizAnswer === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedQuizAnswer(idx)}
                        className={`w-full rounded-lg border p-3 text-left text-xs transition-colors ${
                          selectedQuizAnswer === null
                            ? 'border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-700'
                            : isCorrect
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                            : isSelected
                            ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                            : 'border-slate-800 bg-slate-950/50 text-slate-400'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {selectedQuizAnswer !== null && (
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
                    <strong className="text-sky-400">Explicação do Professor: </strong>
                    {currentQuestion.explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
