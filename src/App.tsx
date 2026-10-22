/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Power,
  Undo2,
  Redo2,
  RotateCcw,
  Disc,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  ChevronDown,
  ChevronUp,
  Cpu,
  Eye,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { useSimulatorStore } from './store/useSimulatorStore';
import { WorkbenchCanvas } from './three/WorkbenchCanvas';
import { CatalogSidebar } from './components/CatalogSidebar';
import { ComponentInspectorPanel } from './components/ComponentInspectorPanel';
import { PostBootModal } from './components/PostBootModal';
import {
  GuidedModeBanner,
  DiagnosticModeBanner,
  FullScreenStudyOrTeacherModal,
} from './components/ModesOverlayPanel';
import { getHardwareById } from './data/catalog';
import { MotherboardSpec, CpuSpec, RamSpec } from './types/hardware';

export default function App() {
  const mode = useSimulatorStore((s) => s.mode);
  const setMode = useSimulatorStore((s) => s.setMode);
  const installed = useSimulatorStore((s) => s.installed);
  const lastValidationResult = useSimulatorStore((s) => s.lastValidationResult);
  const clearValidationBanner = useSimulatorStore((s) => s.clearValidationBanner);

  const undo = useSimulatorStore((s) => s.undo);
  const redo = useSimulatorStore((s) => s.redo);
  const history = useSimulatorStore((s) => s.history);
  const future = useSimulatorStore((s) => s.future);
  const resetWorkbench = useSimulatorStore((s) => s.resetWorkbench);
  const loadPresetStarterKit = useSimulatorStore((s) => s.loadPresetStarterKit);
  const updateMotherboardBios = useSimulatorStore((s) => s.updateMotherboardBios);

  const cameraPreset = useSimulatorStore((s) => s.cameraPreset);
  const setCameraPreset = useSimulatorStore((s) => s.setCameraPreset);
  const caseSidePanelOpen = useSimulatorStore((s) => s.caseSidePanelOpen);
  const toggleCaseSidePanel = useSimulatorStore((s) => s.toggleCaseSidePanel);

  const powerOnComputer = useSimulatorStore((s) => s.powerOnComputer);
  const isPoweredOn = useSimulatorStore((s) => s.isPoweredOn);

  const setSelectedInspectItemId = useSimulatorStore((s) => s.setSelectedInspectItemId);
  const setInspectorTab = useSimulatorStore((s) => s.setInspectorTab);
  const loadDiagnosticScenario = useSimulatorStore((s) => s.loadDiagnosticScenario);
  const presentationMode = useSimulatorStore((s) => s.presentationMode);

  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);

  const mb = installed.motherboardId
    ? (getHardwareById(installed.motherboardId) as MotherboardSpec | undefined)
    : undefined;
  const cpu = installed.cpuId
    ? (getHardwareById(installed.cpuId) as CpuSpec | undefined)
    : undefined;
  const installedRams = Object.values(installed.ramSlots)
    .filter((id): id is string => Boolean(id))
    .map((id) => getHardwareById(id) as RamSpec);
  const totalRamGb = installedRams.reduce((acc, r) => acc + (r?.capacityGb ?? 0), 0);

  return (
    <div
      className={`flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-100 ${
        presentationMode ? 'text-base' : 'text-sm'
      }`}
    >
      {/* Top Bar Contract: [Brand title, one line] — [5 nav links, single-line] — [1 primary action] */}
      <header className="flex items-center justify-between gap-8 border-b border-slate-800 bg-slate-950 px-6 py-3 shrink-0 z-20">
        <a
          href="#bancada"
          onClick={(e) => {
            e.preventDefault();
            setMode('FREE_BUILD');
          }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display"
        >
          PC Lab 3D
        </a>

        <nav
          aria-label="Modos do Laboratório"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
        >
          <a
            href="#modo-livre"
            onClick={(e) => {
              e.preventDefault();
              setMode('FREE_BUILD');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              mode === 'FREE_BUILD' ? 'text-sky-400 underline underline-offset-8' : ''
            }`}
          >
            Modo Livre
          </a>
          <a
            href="#montagem-guiada"
            onClick={(e) => {
              e.preventDefault();
              setMode('GUIDED_BUILD');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              mode === 'GUIDED_BUILD' ? 'text-sky-400 underline underline-offset-8' : ''
            }`}
          >
            Montagem Guiada
          </a>
          <a
            href="#diagnostico"
            onClick={(e) => {
              e.preventDefault();
              loadDiagnosticScenario('diag-1-missing-cpu-eps');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              mode === 'DIAGNOSTIC' ? 'text-sky-400 underline underline-offset-8' : ''
            }`}
          >
            Diagnóstico
          </a>
          <a
            href="#hdd-3d"
            onClick={(e) => {
              e.preventDefault();
              setSelectedInspectItemId('storage-hdd-seagate-2tb-35');
              setInspectorTab('HOW_IT_WORKS');
              setIsInspectorOpen(true);
            }}
            className="transition-colors whitespace-nowrap shrink-0 text-emerald-400 hover:text-emerald-300"
          >
            Laboratório HDD 3D
          </a>
          <a
            href="#conteudo-itic"
            onClick={(e) => {
              e.preventDefault();
              setMode('STUDY_GUIDE');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              mode === 'STUDY_GUIDE' ? 'text-sky-400 underline underline-offset-8' : ''
            }`}
          >
            Conteúdo ITIC
          </a>
          <a
            href="#professor"
            onClick={(e) => {
              e.preventDefault();
              setMode('TEACHER_AREA');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              mode === 'TEACHER_AREA' ? 'text-sky-400 underline underline-offset-8' : ''
            }`}
          >
            Área do Professor
          </a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => powerOnComputer()}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 ${
              isPoweredOn
                ? 'bg-emerald-600 hover:bg-emerald-500'
                : 'bg-sky-600 hover:bg-sky-500'
            }`}
          >
            <Power className="h-4 w-4" />
            {isPoweredOn ? 'PC Ligado (Ver POST)' : 'Ligar PC (POST)'}
          </button>
        </div>
      </header>

      {/* Mobile Mode Switcher Bar (visible on small viewports) */}
      <div className="flex md:hidden items-center justify-between gap-1 border-b border-slate-800 bg-slate-900 px-3 py-1.5 text-xs overflow-x-auto shrink-0">
        <button
          type="button"
          onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
          className="rounded bg-sky-600 px-2.5 py-1 font-semibold text-white whitespace-nowrap"
        >
          {mobileCatalogOpen ? 'Ver Bancada 3D' : 'Catálogo de Peças'}
        </button>
        <button
          type="button"
          onClick={() => setMode('GUIDED_BUILD')}
          className="rounded bg-slate-800 px-2 py-1 text-slate-200 whitespace-nowrap"
        >
          Guia
        </button>
        <button
          type="button"
          onClick={() => loadDiagnosticScenario('diag-1-missing-cpu-eps')}
          className="rounded bg-slate-800 px-2 py-1 text-slate-200 whitespace-nowrap"
        >
          Diagnóstico
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedInspectItemId('storage-hdd-seagate-2tb-35');
            setInspectorTab('HOW_IT_WORKS');
            setIsInspectorOpen(true);
          }}
          className="rounded bg-emerald-900/70 px-2 py-1 text-emerald-300 whitespace-nowrap"
        >
          HDD 3D
        </button>
      </div>

      {/* Mode Contextual Banner (Guided Assembly or Diagnostic Troubleshooting) */}
      {mode === 'GUIDED_BUILD' && <GuidedModeBanner />}
      {mode === 'DIAGNOSTIC' && <DiagnosticModeBanner />}

      {/* Main Split Workspace: Left Catalog Sidebar + Right 3D Workbench Stage */}
      <main className="relative flex flex-1 overflow-hidden">
        {/* Left Region: Hardware Catalog & Installed Components */}
        <div
          className={`${
            mobileCatalogOpen ? 'flex w-full' : 'hidden'
          } md:flex md:w-[390px] lg:w-[420px] shrink-0 h-full z-10`}
        >
          <CatalogSidebar
            onOpenInspectorModal={() => {
              setIsInspectorOpen(true);
            }}
          />
        </div>

        {/* Center/Right Region: Interactive 3D Workbench Stage */}
        <div className="relative flex-1 h-full overflow-hidden bg-slate-950">
          {/* 3D WebGL Canvas */}
          <WorkbenchCanvas />

          {/* Top Overlay inside 3D Viewport: Current Workbench Spec & Live Compatibility Banner */}
          <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 flex flex-col gap-2.5">
            {/* Compact Spec Strip */}
            <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/95 px-3.5 py-2 text-xs">
              <div className="flex flex-wrap items-center gap-2 text-slate-300">
                <span className="font-semibold text-white">
                  {mb ? `${mb.name} (${mb.socket} · ${mb.ramGeneration})` : 'Sem Placa-Mãe'}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  CPU: <strong className="text-sky-300">{cpu ? cpu.name : 'Vazio'}</strong>
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  RAM: <strong className="text-emerald-300">{totalRamGb} GB</strong> ({installedRams.length}/{mb?.ramSlots ?? 0} slots)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {mb && !installed.motherboardBiosUpdated && (
                  <button
                    type="button"
                    onClick={updateMotherboardBios}
                    className="rounded bg-amber-600/90 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-500 whitespace-nowrap"
                  >
                    Atualizar BIOS ({mb.shippedBiosVersion} → {mb.latestBiosVersion})
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedInspectItemId('storage-hdd-seagate-2tb-35');
                    setInspectorTab('HOW_IT_WORKS');
                    setIsInspectorOpen(true);
                  }}
                  className="flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-500 whitespace-nowrap"
                >
                  <Disc className="h-3.5 w-3.5" />
                  Demonstração HDD 3D
                </button>

                <button
                  type="button"
                  onClick={loadPresetStarterKit}
                  className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 whitespace-nowrap"
                >
                  <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                  Montar PC Completo
                </button>
              </div>
            </div>

            {/* Real-Time Compatibility / Dependency Diagnostic Toast Banner */}
            {lastValidationResult && (
              <div
                role="status"
                aria-live="polite"
                className={`pointer-events-auto flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-xs shadow-lg ${
                  !lastValidationResult.allowed && lastValidationResult.status === 'INCOMPATIBLE'
                    ? 'border-rose-500 bg-rose-950/95 text-rose-100'
                    : lastValidationResult.status === 'INSUFFICIENT_DATA'
                    ? 'border-amber-500 bg-amber-950/95 text-amber-100'
                    : lastValidationResult.status === 'DEPENDENCY_MISSING' ||
                      lastValidationResult.status === 'BIOS_UPDATE_REQUIRED' ||
                      lastValidationResult.status === 'COMPATIBLE_WITH_WARNINGS'
                    ? 'border-amber-500/80 bg-slate-900/95 text-amber-100'
                    : 'border-emerald-500/60 bg-slate-900/95 text-emerald-100'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {!lastValidationResult.allowed &&
                  lastValidationResult.status === 'INCOMPATIBLE' ? (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                  ) : lastValidationResult.status === 'COMPATIBLE' ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  )}

                  <div className="space-y-1">
                    <div className="font-bold">
                      [{lastValidationResult.status}] {lastValidationResult.title}
                    </div>
                    <p className="leading-relaxed">{lastValidationResult.message}</p>
                    <p className="text-slate-300">{lastValidationResult.educationalDetails}</p>
                    {lastValidationResult.remediation && (
                      <p className="font-semibold text-sky-300">
                        Recomendação: {lastValidationResult.remediation}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearValidationBanner}
                  aria-label="Fechar aviso de compatibilidade"
                  className="shrink-0 rounded px-2 py-0.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>

          {/* Collapsible Bottom Control Dock (Camera Presets, Undo/Redo, Case Cover, Inspector) */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 w-[94%] max-w-4xl -translate-x-1/2 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setDockCollapsed(!dockCollapsed)}
              className="pointer-events-auto flex items-center gap-1 rounded-t-lg border border-b-0 border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" /> Mostrar Controles da Bancada
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" /> Ocultar Controles
                </>
              )}
            </button>

            {!dockCollapsed && (
              <div className="pointer-events-auto flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/95 px-4 py-2.5 text-xs shadow-2xl">
                {/* Camera Angle Presets */}
                <div className="flex flex-wrap items-center gap-1">
                  <span className="mr-1 flex items-center gap-1 text-slate-400">
                    <Camera className="h-3.5 w-3.5" /> Câmera:
                  </span>
                  {(
                    [
                      { id: 'ORBIT_MAIN', label: 'Geral 3D' },
                      { id: 'SOCKET_CPU', label: 'Socket CPU' },
                      { id: 'SLOTS_RAM', label: 'Slots RAM' },
                      { id: 'STORAGE_HDD', label: 'Baias HDD/SSD' },
                      { id: 'PCIE_GPU', label: 'Slot PCIe' },
                      { id: 'MOTHERBOARD_TOP', label: 'Vista Topo' },
                    ] as const
                  ).map((cam) => (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => setCameraPreset(cam.id)}
                      className={`rounded-md px-2.5 py-1 font-medium transition-colors whitespace-nowrap ${
                        cameraPreset === cam.id
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cam.label}
                    </button>
                  ))}
                </div>

                {/* Workbench Actions: Case Panel, Undo, Redo, Reset, Open Inspector */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleCaseSidePanel}
                    className="rounded-md bg-slate-800 px-2.5 py-1 font-medium text-slate-200 hover:bg-slate-700 whitespace-nowrap"
                  >
                    {caseSidePanelOpen ? 'Fechar Acrílico' : 'Abrir Gabinete'}
                  </button>

                  <button
                    type="button"
                    onClick={undo}
                    disabled={history.length === 0}
                    aria-label="Desfazer ação"
                    className="flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-slate-200 hover:bg-slate-700 disabled:opacity-40 whitespace-nowrap"
                  >
                    <Undo2 className="h-3.5 w-3.5" /> Desfazer
                  </button>

                  <button
                    type="button"
                    onClick={redo}
                    disabled={future.length === 0}
                    aria-label="Refazer ação"
                    className="flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-slate-200 hover:bg-slate-700 disabled:opacity-40 whitespace-nowrap"
                  >
                    <Redo2 className="h-3.5 w-3.5" /> Refazer
                  </button>

                  <button
                    type="button"
                    onClick={() => resetWorkbench(false)}
                    className="flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-1 text-amber-300 hover:bg-slate-700 whitespace-nowrap"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reiniciar Base
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsInspectorOpen(true)}
                    className="flex items-center gap-1 rounded-md bg-sky-600 px-2.5 py-1 font-semibold text-white hover:bg-sky-500 whitespace-nowrap"
                  >
                    <Eye className="h-3.5 w-3.5" /> Inspetor / Animações 3D
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals & Contextual Overlays */}
      {isInspectorOpen && (
        <ComponentInspectorPanel onClose={() => setIsInspectorOpen(false)} />
      )}
      <PostBootModal />
      <FullScreenStudyOrTeacherModal />
    </div>
  );
}
