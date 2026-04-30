import { useState } from 'react';
import { AppState, Category, CategoryState, DelegationKind, HistoryEntry, Phase } from './types';
import { buildInitialScoreSeries, categoryLabel, suggestions } from './mockData';
import OnboardingScreen from './screens/OnboardingScreen';
import CategorySelectScreen from './screens/CategorySelectScreen';
import SuggestionScreen from './screens/SuggestionScreen';
import Phase4Screen from './screens/Phase4Screen';
import MirrorScreen from './screens/MirrorScreen';
import CompleteDelegationDialog from './components/CompleteDelegationDialog';
import DemoControls from './components/DemoControls';

const initialCategoryState = (cat: Category): CategoryState => ({
  category: cat,
  phase: 1,
  selfDecisionCount: 0,
  delegationCount: 0,
  history: [],
  lastSelfDecisionAt: null,
  scoreSeries: buildInitialScoreSeries()
});

const buildInitialState = (): AppState => ({
  userName: '高木皇佑',
  contact: initialCategoryState('contact'),
  relationship: initialCategoryState('relationship'),
  screen: 'onboarding',
  activeCategory: null,
  showCompleteDelegationDialog: false
});

export default function App() {
  const [state, setState] = useState<AppState>(buildInitialState);

  const updateCategory = (
    cat: Category,
    updater: (prev: CategoryState) => CategoryState
  ) => {
    setState((s) => ({ ...s, [cat]: updater(s[cat]) }));
  };

  const addHistory = (cat: Category, kind: DelegationKind, detail: string) => {
    const entry: HistoryEntry = { date: new Date(), category: cat, kind, detail };
    updateCategory(cat, (prev) => ({ ...prev, history: [entry, ...prev.history] }));
  };

  const decayScore = (cat: Category, points: number) => {
    updateCategory(cat, (prev) => {
      const last = prev.scoreSeries[prev.scoreSeries.length - 1];
      const next = Math.max(0, Math.round((last.score - points) * 10) / 10);
      return {
        ...prev,
        scoreSeries: [...prev.scoreSeries, { day: last.day + 1, score: next }]
      };
    });
  };

  const handleStart = () => {
    setState((s) => ({ ...s, screen: 'category-select' }));
  };

  const handleSelectCategory = (cat: Category) => {
    setState((s) => ({
      ...s,
      activeCategory: cat,
      screen: s[cat].phase === 4 ? 'phase4-listening' : 'suggestion'
    }));
  };

  const handleBackToCategorySelect = () => {
    setState((s) => ({ ...s, screen: 'category-select', activeCategory: null }));
  };

  const handleGoMirror = () => {
    setState((s) => ({ ...s, screen: 'mirror' }));
  };

  const handleSelfDecision = (cat: Category, suggestionId: string, reason: string) => {
    const opt = suggestions[cat][state[cat].phase].find((o) => o.id === suggestionId);
    const detail = `自分で選んだ: ${opt?.text ?? '(不明)'}${reason ? ` / 理由: ${reason}` : ''}`;
    addHistory(cat, 'self-decision', detail);
    updateCategory(cat, (prev) => ({
      ...prev,
      selfDecisionCount: prev.selfDecisionCount + 1,
      lastSelfDecisionAt: new Date()
    }));
    decayScore(cat, 0.5);
  };

  const handleSingleDelegate = (cat: Category) => {
    const opt = suggestions[cat][state[cat].phase][0];
    const detail = `単発委譲: ${opt?.text ?? '(AI 第 1 候補)'}`;
    addHistory(cat, 'single-delegation', detail);
    updateCategory(cat, (prev) => ({
      ...prev,
      delegationCount: prev.delegationCount + 1
    }));
    decayScore(cat, 1.5);
  };

  const handlePhaseUp = (cat: Category) => {
    const current = state[cat].phase;
    if (current >= 4) return;
    const next = (current + 1) as Phase;
    addHistory(cat, 'phase-up', `Phase ${current} → Phase ${next} に手動昇格`);
    updateCategory(cat, (prev) => ({
      ...prev,
      phase: next,
      delegationCount: prev.delegationCount + 1
    }));
    decayScore(cat, 4);
    if (next === 4) {
      setState((s) => ({ ...s, screen: 'phase4-listening' }));
    }
  };

  const handleRequestCompleteDelegation = () => {
    setState((s) => ({ ...s, showCompleteDelegationDialog: true }));
  };

  const handleConfirmCompleteDelegation = () => {
    const cat = state.activeCategory;
    if (!cat) return;
    addHistory(cat, 'complete-delegation', `${categoryLabel[cat]} カテゴリを完全委譲した`);
    updateCategory(cat, (prev) => ({
      ...prev,
      phase: 4,
      delegationCount: prev.delegationCount + 1
    }));
    decayScore(cat, 12);
    setState((s) => ({
      ...s,
      showCompleteDelegationDialog: false,
      screen: 'phase4-listening'
    }));
  };

  const handleCancelCompleteDelegation = () => {
    setState((s) => ({ ...s, showCompleteDelegationDialog: false }));
  };

  const handleAutoExecuted = (detail: string) => {
    const cat = state.activeCategory;
    if (!cat) return;
    addHistory(cat, 'auto-execute', detail);
    updateCategory(cat, (prev) => ({
      ...prev,
      delegationCount: prev.delegationCount + 1
    }));
    decayScore(cat, 1);
  };

  const handleJumpPhase = (cat: Category, phase: Phase) => {
    updateCategory(cat, (prev) => ({ ...prev, phase }));
    setState((s) => ({
      ...s,
      activeCategory: cat,
      screen: phase === 4 ? 'phase4-listening' : 'suggestion'
    }));
  };

  const handleResetAll = () => {
    setState(buildInitialState());
  };

  const renderScreen = () => {
    switch (state.screen) {
      case 'onboarding':
        return <OnboardingScreen userName={state.userName} onProceed={handleStart} />;
      case 'category-select':
        return (
          <CategorySelectScreen
            contact={state.contact}
            relationship={state.relationship}
            onSelect={handleSelectCategory}
            onMirror={handleGoMirror}
          />
        );
      case 'suggestion':
        if (!state.activeCategory) return null;
        return (
          <SuggestionScreen
            category={state.activeCategory}
            phase={state[state.activeCategory].phase}
            onSelectOwn={(id, reason) => handleSelfDecision(state.activeCategory!, id, reason)}
            onSingleDelegate={() => handleSingleDelegate(state.activeCategory!)}
            onPhaseUp={() => handlePhaseUp(state.activeCategory!)}
            onCompleteDelegate={handleRequestCompleteDelegation}
            onBack={handleBackToCategorySelect}
          />
        );
      case 'phase4-listening':
        if (!state.activeCategory) return null;
        return (
          <Phase4Screen
            category={state.activeCategory}
            onAutoExecuted={handleAutoExecuted}
            onBack={handleBackToCategorySelect}
          />
        );
      case 'mirror':
        return (
          <MirrorScreen
            contact={state.contact}
            relationship={state.relationship}
            onBack={handleBackToCategorySelect}
          />
        );
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-brand">ダメ・ラボ・コーポレーション</span>
        <span className="app-tagline">Discovery Mock — 捨てる前提</span>
      </header>

      <main className="app-main">{renderScreen()}</main>

      {state.showCompleteDelegationDialog && state.activeCategory && (
        <CompleteDelegationDialog
          category={state.activeCategory}
          onConfirm={handleConfirmCompleteDelegation}
          onCancel={handleCancelCompleteDelegation}
        />
      )}

      <DemoControls
        activeCategory={state.activeCategory}
        contactPhase={state.contact.phase}
        relationshipPhase={state.relationship.phase}
        onJumpPhase={handleJumpPhase}
        onResetAll={handleResetAll}
        onGoMirror={handleGoMirror}
      />
    </div>
  );
}
