import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Volume2,
  Terminal,
  Cpu,
  HardDrive,
} from 'lucide-react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { getHardwareById } from '../data/catalog';
import { MotherboardSpec, CpuSpec, RamSpec, StorageSpec } from '../types/hardware';

export const PostBootModal: React.FC = () => {
  const showPostModal = useSimulatorStore((s) => s.showPostModal);
  const lastPostResult = useSimulatorStore((s) => s.lastPostResult);
  const setShowPostModal = useSimulatorStore((s) => s.setShowPostModal);
  const powerOffComputer = useSimulatorStore((s) => s.powerOffComputer);
  const updateMotherboardBios = useSimulatorStore((s) => s.updateMotherboardBios);
  const powerOnComputer = useSimulatorStore((s) => s.powerOnComputer);
  const installed = useSimulatorStore((s) => s.installed);

  const [viewScreen, setViewScreen] = useState<'POST_DIAGNOSTIC' | 'UEFI_BIOS' | 'OS_DESKTOP'>('POST_DIAGNOSTIC');

  if (!showPostModal || !lastPostResult) return null;

  const mb = installed.motherboardId
    ? (getHardwareById(installed.motherboardId) as MotherboardSpec | undefined)
    : undefined;
  const cpu = installed.cpuId
    ? (getHardwareById(installed.cpuId) as CpuSpec | undefined)
    : undefined;
  const rams = Object.values(installed.ramSlots)
    .filter((id): id is string => Boolean(id))
    .map((id) => getHardwareById(id) as RamSpec);
  const totalRamGb = rams.reduce((sum, r) => sum + (r?.capacityGb ?? 0), 0);

  return (
    <div
      role="dialog"
      aria-label="Simulação Didática de Inicialização POST e UEFI"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">
        {/* Top Monitor Frame Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <Terminal className="h-5 w-5 text-sky-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                Monitor do Laboratório — Simulação Conceitual de POST, UEFI e Boot
              </h2>
              <p className="text-xs text-slate-400">
                Simulação educacional das etapas de inicialização (não executa um firmware ou sistema operacional real).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {lastPostResult.postSuccess && (
              <div className="flex items-center gap-1 rounded-lg bg-slate-950 p-1">
                <button
                  type="button"
                  onClick={() => setViewScreen('POST_DIAGNOSTIC')}
                  className={`rounded px-2.5 py-1 text-xs font-medium ${
                    viewScreen === 'POST_DIAGNOSTIC'
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Etapas do POST
                </button>
                <button
                  type="button"
                  onClick={() => setViewScreen('UEFI_BIOS')}
                  className={`rounded px-2.5 py-1 text-xs font-medium ${
                    viewScreen === 'UEFI_BIOS'
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tela UEFI / BIOS
                </button>
                {lastPostResult.bootToOsSuccess && (
                  <button
                    type="button"
                    onClick={() => setViewScreen('OS_DESKTOP')}
                    className={`rounded px-2.5 py-1 text-xs font-medium ${
                      viewScreen === 'OS_DESKTOP'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sistema Iniciado
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowPostModal(false)}
              aria-label="Voltar à bancada mantendo o PC ligado"
              className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Status Bar: POST Hex Code + Beep Speaker Code */}
        <div
          className={`flex flex-wrap items-center justify-between gap-4 border-b px-6 py-3 text-xs ${
            lastPostResult.bootToOsSuccess
              ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-200'
              : lastPostResult.postSuccess
              ? 'border-amber-500/30 bg-amber-950/30 text-amber-200'
              : 'border-rose-500/30 bg-rose-950/30 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {lastPostResult.bootToOsSuccess ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : lastPostResult.postSuccess ? (
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            ) : (
              <XCircle className="h-4 w-4 text-rose-400" />
            )}
            <span>{lastPostResult.summaryTitle}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono">
            <span className="flex items-center gap-1.5">
              <Volume2 className="h-4 w-4 text-amber-400" />
              Speaker: {lastPostResult.beepCode}
            </span>
            <span>POST Code: {lastPostResult.postHexCode}</span>
          </div>
        </div>

        {/* Main Screen Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewScreen === 'POST_DIAGNOSTIC' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">{lastPostResult.summaryMessage}</p>

              {/* 8 Sequential POST Stages */}
              <div className="space-y-2">
                {lastPostResult.stages.map((st) => (
                  <div
                    key={st.stageOrder}
                    className={`flex items-start justify-between gap-4 rounded-lg border p-3 text-xs ${
                      st.status === 'PASS'
                        ? 'border-slate-800 bg-slate-900/90 text-slate-200'
                        : st.status === 'WARN'
                        ? 'border-amber-500/40 bg-amber-950/30 text-amber-100'
                        : 'border-rose-500/50 bg-rose-950/40 text-rose-100'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="font-mono text-sky-400">[{st.stageCode}]</span>
                        <span>{st.stageName}</span>
                      </div>
                      <p className="text-slate-300">{st.detail}</p>
                    </div>
                    <span
                      className={`shrink-0 font-mono font-semibold ${
                        st.status === 'PASS'
                          ? 'text-emerald-400'
                          : st.status === 'WARN'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {st.status === 'PASS'
                        ? 'APROVADO'
                        : st.status === 'WARN'
                        ? 'ALERTA'
                        : 'FALHA'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Remediation / Detected Errors */}
              {lastPostResult.detectedErrors.length > 0 && (
                <div className="rounded-lg border border-rose-500/40 bg-rose-950/25 p-4 text-xs space-y-2">
                  <h3 className="font-bold text-rose-300">
                    Diagnóstico Pedagógico da Falha de Inicialização:
                  </h3>
                  {lastPostResult.detectedErrors.map((err, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="font-semibold text-white">• {err.title}: {err.message}</p>
                      <p className="text-slate-300">{err.educationalDetails}</p>
                      {err.remediation && (
                        <p className="font-medium text-sky-300">Solução Recomendada: {err.remediation}</p>
                      )}
                      {err.code === 'POST_BIOS_OUTDATED_FOR_CPU' && (
                        <button
                          type="button"
                          onClick={() => {
                            updateMotherboardBios();
                            powerOnComputer();
                          }}
                          className="mt-2 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500"
                        >
                          Atualizar BIOS Agora (USB Flashback) e Reiniciar POST
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewScreen === 'UEFI_BIOS' && (
            <div className="rounded-lg border border-sky-500/40 bg-slate-900 p-5 font-mono text-xs text-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-sm font-bold text-sky-400">
                  {mb?.manufacturer} UEFI BIOS Utility — Modo Didático ITIC
                </span>
                <span className="text-slate-400">
                  Versão BIOS: {installed.motherboardBiosUpdated ? mb?.latestBiosVersion : mb?.shippedBiosVersion}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded border border-slate-800 bg-slate-950 p-3 space-y-1.5">
                  <div className="font-semibold text-amber-400">Processador e Placa-Mãe</div>
                  <div>Placa-Mãe: {mb?.name} ({mb?.chipset})</div>
                  <div>Processador: {cpu?.name}</div>
                  <div>Arquitetura: {cpu?.architecture} ({cpu?.cores}C / {cpu?.threads}T)</div>
                  <div>Frequência Base / Boost: {cpu?.baseClockGhz} GHz / {cpu?.boostClockGhz} GHz</div>
                  <div>Temperatura CPU Package: 36.0 °C (Cooler PWM Ativo)</div>
                </div>
                <div className="rounded border border-slate-800 bg-slate-950 p-3 space-y-1.5">
                  <div className="font-semibold text-emerald-400">Memória DRAM & Barramentos</div>
                  <div>Capacidade Total: {totalRamGb * 1024} MB ({mb?.ramGeneration})</div>
                  <div>Modo de Canal: {rams.length >= 2 ? 'Dual-Channel Interleaved' : 'Single-Channel'}</div>
                  <div>Tensão VDIMM: {rams[0]?.voltageV ?? 1.2} V</div>
                  <div>Bateria CMOS RTC: {installed.cmosBatteryInstalled ? 'OK (3.08V)' : 'Ausente (Reset)'}</div>
                </div>
              </div>
            </div>
          )}

          {viewScreen === 'OS_DESKTOP' && (
            <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 p-6 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Sistema Operacional Didático Carregado na Memória RAM!
              </h3>
              <p className="mx-auto max-w-xl text-xs leading-relaxed text-slate-300">
                O bootloader EFI foi lido da unidade de armazenamento não-volátil, transferiu o kernel para os <strong>{totalRamGb} GB de memória RAM {mb?.ramGeneration}</strong> e iniciou a execução das threads nos <strong>{cpu?.cores} núcleos</strong> do processador <strong>{cpu?.name}</strong>.
              </p>
              <div className="mx-auto grid max-w-2xl grid-cols-3 gap-3 text-left text-xs">
                <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3">
                  <div className="flex items-center gap-1.5 font-semibold text-sky-400">
                    <Cpu className="h-4 w-4" /> CPU Ativa
                  </div>
                  <div className="mt-1 font-mono text-slate-200">{cpu?.name}</div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3">
                  <div className="font-semibold text-emerald-400">RAM Alocada</div>
                  <div className="mt-1 font-mono text-slate-200">{totalRamGb} GB {mb?.ramGeneration}</div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                    <HardDrive className="h-4 w-4" /> Disco de Boot
                  </div>
                  <div className="mt-1 font-mono text-slate-200">
                    {
                      (
                        getHardwareById(
                          installed.m2Slots.slot_m2_1 ||
                            installed.m2Slots.slot_m2_2 ||
                            installed.driveBays.slot_drive_bay_1 ||
                            installed.driveBays.slot_drive_bay_2
                        ) as StorageSpec | undefined
                      )?.model
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900 px-6 py-3">
          <button
            type="button"
            onClick={powerOffComputer}
            className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
          >
            Desligar Computador Virtual
          </button>
          <button
            type="button"
            onClick={() => setShowPostModal(false)}
            className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
          >
            Retornar à Bancada 3D
          </button>
        </div>
      </div>
    </div>
  );
};
