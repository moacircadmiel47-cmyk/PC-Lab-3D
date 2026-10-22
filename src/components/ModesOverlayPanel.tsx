import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  Wrench,
  BookOpen,
  GraduationCap,
  Save,
  FolderOpen,
  Trash2,
  ShieldCheck,
  AlertOctagon,
} from 'lucide-react';
import { useSimulatorStore } from '../store/useSimulatorStore';
import {
  GUIDED_STEPS,
  DIAGNOSTIC_SCENARIOS,
  EDUCATIONAL_TOPICS,
  REVIEW_QUESTIONS,
} from '../data/educationalContent';
import { getHardwareById } from '../data/catalog';

export const GuidedModeBanner: React.FC = () => {
  const currentGuidedStepIndex = useSimulatorStore((s) => s.currentGuidedStepIndex);
  const setCurrentGuidedStepIndex = useSimulatorStore((s) => s.setCurrentGuidedStepIndex);
  const installed = useSimulatorStore((s) => s.installed);
  const safetyAcknowledged = useSimulatorStore((s) => s.safetyAcknowledged);
  const acknowledgeSafety = useSimulatorStore((s) => s.acknowledgeSafety);
  const lastPostResult = useSimulatorStore((s) => s.lastPostResult);
  const showHints = useSimulatorStore((s) => s.showHints);
  const pedagogicalScore = useSimulatorStore((s) => s.pedagogicalScore);

  const postPassed = Boolean(lastPostResult?.bootToOsSuccess);
  const completedCount = GUIDED_STEPS.filter((step) =>
    step.isCompleted(installed, safetyAcknowledged, postPassed)
  ).length;

  const step = GUIDED_STEPS[currentGuidedStepIndex] ?? GUIDED_STEPS[0];
  const isCurrentDone = step.isCompleted(installed, safetyAcknowledged, postPassed);

  return (
    <div className="border-b border-slate-800 bg-slate-900/95 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-sky-400 tabular-nums">
            Etapa {step.stepNumber} de {GUIDED_STEPS.length} ({completedCount}/{GUIDED_STEPS.length} concluídas)
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono text-xs text-emerald-400 tabular-nums">
            Pontuação Pedagógica: {pedagogicalScore} pts
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentGuidedStepIndex(Math.max(0, currentGuidedStepIndex - 1))}
            disabled={currentGuidedStepIndex === 0}
            className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Anterior
          </button>
          <button
            type="button"
            onClick={() =>
              setCurrentGuidedStepIndex(
                Math.min(GUIDED_STEPS.length - 1, currentGuidedStepIndex + 1)
              )
            }
            disabled={currentGuidedStepIndex === GUIDED_STEPS.length - 1}
            className="flex items-center gap-1 rounded bg-sky-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-sky-500 disabled:opacity-40"
          >
            Próxima Etapa
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">{step.title}</h3>
            {isCurrentDone ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Etapa Concluída!
              </span>
            ) : (
              <span className="text-xs font-medium text-amber-400">Pendente</span>
            )}
          </div>
          <p className="text-xs text-slate-200">{step.instruction}</p>
          <p className="text-xs text-slate-400">
            <strong>Por que isso importa:</strong> {step.pedagogicalWhy}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {step.id === 'step-1-safety' && !safetyAcknowledged && (
            <button
              type="button"
              onClick={acknowledgeSafety}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              <ShieldCheck className="h-4 w-4" />
              Confirmar Segurança ESD e Desligamento da Tomada
            </button>
          )}

          {showHints && (
            <div className="max-w-xs rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-1 font-semibold text-amber-400">
                <Lightbulb className="h-3.5 w-3.5" /> Dica do Professor:
              </div>
              <p className="mt-0.5">{step.hint1}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const DiagnosticModeBanner: React.FC = () => {
  const activeScenarioId = useSimulatorStore((s) => s.activeScenarioId);
  const loadDiagnosticScenario = useSimulatorStore((s) => s.loadDiagnosticScenario);
  const revealedCluesCount = useSimulatorStore((s) => s.revealedCluesCount);
  const revealNextClue = useSimulatorStore((s) => s.revealNextClue);
  const verifyCurrentScenario = useSimulatorStore((s) => s.verifyCurrentScenario);
  const scenarioVerificationMessage = useSimulatorStore((s) => s.scenarioVerificationMessage);
  const showHints = useSimulatorStore((s) => s.showHints);

  const scenario =
    DIAGNOSTIC_SCENARIOS.find((s) => s.id === activeScenarioId) ?? DIAGNOSTIC_SCENARIOS[0];

  return (
    <div className="border-b border-slate-800 bg-slate-900/95 px-4 py-3 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-semibold text-amber-400">
            Modo de Diagnóstico e Manutenção ({scenario.difficulty})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <label htmlFor="diag-select" className="text-xs text-slate-400">
            Escolher Cenário:
          </label>
          <select
            id="diag-select"
            value={scenario.id}
            onChange={(e) => loadDiagnosticScenario(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-100 focus:border-sky-500 focus:outline-none"
          >
            {DIAGNOSTIC_SCENARIOS.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.title} ({sc.difficulty})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={verifyCurrentScenario}
            className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500 whitespace-nowrap"
          >
            Validar Reparo e Testar Boot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-1">
          <h3 className="text-sm font-bold text-white">{scenario.title}</h3>
          <p className="text-xs leading-relaxed text-slate-300">
            <strong>Sintoma Relatado:</strong> {scenario.symptomDescription}
          </p>
        </div>

        <div className="lg:col-span-5 space-y-1.5">
          {showHints && (
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sky-400">
                  Pistas Técnicas ({revealedCluesCount}/{scenario.clues.length})
                </span>
                {revealedCluesCount < scenario.clues.length && (
                  <button
                    type="button"
                    onClick={revealNextClue}
                    className="text-xs font-medium text-amber-400 hover:underline"
                  >
                    + Revelar Próxima Pista
                  </button>
                )}
              </div>
              <ul className="mt-1 space-y-1 text-slate-300">
                {scenario.clues.slice(0, revealedCluesCount).map((cl, i) => (
                  <li key={i}>• {cl}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {scenarioVerificationMessage && (
        <div
          className={`rounded-lg border px-3 py-2 text-xs ${
            scenarioVerificationMessage.resolved
              ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200'
              : 'border-rose-500/40 bg-rose-950/40 text-rose-200'
          }`}
        >
          <strong>Resultado da Intervenção:</strong> {scenarioVerificationMessage.feedback}{' '}
          {scenarioVerificationMessage.resolved && (
            <span className="block mt-1 text-slate-300">
              <strong>Explicação Técnica da Causa:</strong> {scenario.causeExplanation}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const FullScreenStudyOrTeacherModal: React.FC = () => {
  const mode = useSimulatorStore((s) => s.mode);
  const setMode = useSimulatorStore((s) => s.setMode);
  const pedagogicalScore = useSimulatorStore((s) => s.pedagogicalScore);
  const compatibilityErrorLog = useSimulatorStore((s) => s.compatibilityErrorLog);
  const showHints = useSimulatorStore((s) => s.showHints);
  const toggleShowHints = useSimulatorStore((s) => s.toggleShowHints);
  const difficultyLevel = useSimulatorStore((s) => s.difficultyLevel);
  const setDifficultyLevel = useSimulatorStore((s) => s.setDifficultyLevel);
  const presentationMode = useSimulatorStore((s) => s.presentationMode);
  const togglePresentationMode = useSimulatorStore((s) => s.togglePresentationMode);
  const customChallengeObjective = useSimulatorStore((s) => s.customChallengeObjective);
  const setCustomChallengeObjective = useSimulatorStore((s) => s.setCustomChallengeObjective);
  const savedBuilds = useSimulatorStore((s) => s.savedBuilds);
  const saveCurrentBuild = useSimulatorStore((s) => s.saveCurrentBuild);
  const loadSavedBuild = useSimulatorStore((s) => s.loadSavedBuild);
  const deleteSavedBuild = useSimulatorStore((s) => s.deleteSavedBuild);
  const loadDiagnosticScenario = useSimulatorStore((s) => s.loadDiagnosticScenario);
  const resetWorkbench = useSimulatorStore((s) => s.resetWorkbench);

  const [buildNameInput, setBuildNameInput] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  if (mode !== 'STUDY_GUIDE' && mode !== 'TEACHER_AREA') return null;

  return (
    <div
      role="dialog"
      aria-label={mode === 'STUDY_GUIDE' ? 'Conteúdo Educacional ITIC' : 'Área do Professor'}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4"
    >
      <div className="flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-2.5">
            {mode === 'STUDY_GUIDE' ? (
              <BookOpen className="h-5 w-5 text-sky-400" />
            ) : (
              <GraduationCap className="h-5 w-5 text-emerald-400" />
            )}
            <h2 className="text-lg font-bold text-white">
              {mode === 'STUDY_GUIDE'
                ? 'Base de Conteúdo Didático, Arquitetura de Computadores e Revisão (ITIC)'
                : 'Área do Professor — Gestão de Atividades, Diagnóstico e Avaliação'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setMode('FREE_BUILD')}
            className="rounded-lg bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sky-500"
          >
            Voltar para a Bancada 3D
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'STUDY_GUIDE' ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {EDUCATIONAL_TOPICS.map((topic) => (
                  <div
                    key={topic.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3"
                  >
                    <div className="text-xs font-medium text-sky-400">{topic.category}</div>
                    <h3 className="text-base font-bold text-white">{topic.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-300">{topic.summary}</p>
                    <ul className="space-y-1.5 text-xs leading-relaxed text-slate-300">
                      {topic.keyPoints.map((kp, i) => (
                        <li key={i}>• {kp}</li>
                      ))}
                    </ul>
                    <div className="border-t border-slate-800 pt-2.5 text-xs text-emerald-300">
                      <strong>Regra Prática de Laboratório:</strong> {topic.practicalRule}
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Review Quiz */}
              <div className="space-y-4 border-t border-slate-800 pt-6">
                <h3 className="text-base font-bold text-white">
                  Simulado de Revisão Técnica (Arquitetura e Manutenção de Computadores)
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {REVIEW_QUESTIONS.map((q, qIdx) => {
                    const chosen = quizAnswers[q.id];
                    return (
                      <div
                        key={q.id}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs"
                      >
                        <div className="font-semibold text-slate-100">
                          {qIdx + 1}. {q.question}
                        </div>
                        <div className="space-y-1.5">
                          {q.options.map((opt, oIdx) => {
                            const isChosen = chosen === oIdx;
                            const isRight = oIdx === q.correctIndex;
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() =>
                                  setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                                }
                                className={`w-full rounded-lg border p-2.5 text-left transition-colors ${
                                  chosen === undefined
                                    ? 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                                    : isRight
                                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                                    : isChosen
                                    ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                                    : 'border-slate-800 bg-slate-900/40 text-slate-500'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {chosen !== undefined && (
                          <p className="text-slate-300">
                            <strong className="text-sky-400">Fundamento:</strong> {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* TEACHER AREA */
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-6 space-y-5">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                  <h3 className="text-base font-bold text-white">
                    Controles Pedagógicos e Modo de Projeção em Sala
                  </h3>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
                    <span className="text-slate-300">Nível de Dificuldade da Turma:</span>
                    <div className="flex gap-1">
                      {(['Iniciante', 'Intermediário', 'Avançado'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setDifficultyLevel(lvl)}
                          className={`rounded-md px-3 py-1 font-semibold ${
                            difficultyLevel === lvl
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                    <span className="text-slate-300">
                      Exibir Dicas nos Modos Guiado e Diagnóstico:
                    </span>
                    <button
                      type="button"
                      onClick={toggleShowHints}
                      className={`rounded-md px-3 py-1 font-semibold ${
                        showHints ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {showHints ? 'Dicas Ativadas' : 'Dicas Ocultas (Modo Avaliação)'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                    <span className="text-slate-300">
                      Modo Apresentação / Projetor de Aula (Fonte Ampliada):
                    </span>
                    <button
                      type="button"
                      onClick={togglePresentationMode}
                      className={`rounded-md px-3 py-1 font-semibold ${
                        presentationMode ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {presentationMode ? 'Projeção Ativa' : 'Padrão'}
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label htmlFor="challenge-obj" className="font-semibold text-slate-300">
                      Definir Objetivo / Desafio Personalizado para o Aluno:
                    </label>
                    <textarea
                      id="challenge-obj"
                      rows={2}
                      value={customChallengeObjective}
                      onChange={(e) => setCustomChallengeObjective(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-slate-100"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        resetWorkbench(true);
                        setMode('FREE_BUILD');
                      }}
                      className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      Iniciar Desafio com Bancada Vazia (Do Zero)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        loadDiagnosticScenario(DIAGNOSTIC_SCENARIOS[0].id);
                      }}
                      className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500"
                    >
                      Aplicar Cenário de Manutenção
                    </button>
                  </div>
                </div>

                {/* Save & Restore Local Configurations */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                  <h3 className="text-base font-bold text-white">
                    Salvar e Carregar Montagens (Armazenamento Local)
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={buildNameInput}
                      onChange={(e) => setBuildNameInput(e.target.value)}
                      placeholder="Nome da configuração (ex: Bancada AM5 Aluno João)"
                      aria-label="Nome da configuração para salvar"
                      className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        saveCurrentBuild(buildNameInput);
                        setBuildNameInput('');
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 whitespace-nowrap"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Salvar Atual
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {savedBuilds.length === 0 ? (
                      <p className="text-xs text-slate-500">
                        Nenhuma configuração salva localmente neste navegador ainda.
                      </p>
                    ) : (
                      savedBuilds.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-slate-100">{b.name}</div>
                            <div className="text-slate-400">{b.timestamp}</div>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                loadSavedBuild(b.id);
                                setMode('FREE_BUILD');
                              }}
                              className="flex items-center gap-1 rounded bg-sky-600 px-2.5 py-1 font-medium text-white hover:bg-sky-500"
                            >
                              <FolderOpen className="h-3.5 w-3.5" />
                              Carregar
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSavedBuild(b.id)}
                              aria-label={`Excluir montagem ${b.name}`}
                              className="rounded bg-rose-950 p-1 text-rose-300 hover:bg-rose-900"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Student Session Evaluation & Compatibility Error Log */}
              <div className="lg:col-span-6 space-y-5">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">
                      Relatório de Desempenho da Sessão Atual
                    </h3>
                    <span className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
                      Pontuação: {pedagogicalScore} pts
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Nota: Os dados abaixo referem-se à sessão local ativa neste navegador.
                  </p>

                  <div className="space-y-2">
                    <h4 className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                      <AlertOctagon className="h-4 w-4" />
                      Histórico de Erros de Compatibilidade e Dependências ({compatibilityErrorLog.length})
                    </h4>

                    {compatibilityErrorLog.length === 0 ? (
                      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs text-slate-400">
                        Nenhum erro de compatibilidade cometido até o momento nesta sessão.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {compatibilityErrorLog.map((entry, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-3 text-xs space-y-1"
                          >
                            <div className="flex justify-between font-mono text-rose-300">
                              <span>{entry.result.title}</span>
                              <span>{entry.timestamp}</span>
                            </div>
                            <div className="text-slate-200">
                              Peça: <strong>{getHardwareById(entry.itemId)?.name ?? entry.itemId}</strong> → Slot: <span className="font-mono">{entry.slot}</span>
                            </div>
                            <p className="text-slate-300">{entry.result.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
