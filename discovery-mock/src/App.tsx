import { useState } from 'react';
import { AppState, Category, CategoryState, DelegationKind, HistoryEntry } from './types';
import { buildInitialScoreSeries, categoryLabel, suggestions } from './mockData';

// HIL: ユーザーが「自分で決める」できるのは 3 回まで。
// 思想: 3 回トレーニングすれば AI が大体わかる → 自動的に autonomous へ graduate。
export const SELF_DECISION_LIMIT = 3;
import OnboardingScreen from './screens/OnboardingScreen';
import CategorySelectScreen from './screens/CategorySelectScreen';
import SuggestionScreen from './screens/SuggestionScreen';
import AutonomousScreen from './screens/AutonomousScreen';
import MirrorScreen from './screens/MirrorScreen';
import CompleteDelegationDialog from './components/CompleteDelegationDialog';
import DemoControls from './components/DemoControls';

const initialCategoryState = (cat: Category): CategoryState => ({
  category: cat,
  mode: 'active',
  selfDecisionCount: 0,
  delegationCount: 0,
  history: [],
  lastSelfDecisionAt: null,
  scoreSeries: buildInitialScoreSeries()
});

const buildInitialState = (): AppState => ({
  userName: '高木皇佑',
  contact: initialCategoryState('contact'),
  shopping: initialCategoryState('shopping'),
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
      screen: s[cat].mode === 'autonomous' ? 'autonomous' : 'suggestion'
    }));
  };

  const handleBackToCategorySelect = () => {
    setState((s) => ({ ...s, screen: 'category-select', activeCategory: null }));
  };

  const handleGoMirror = () => {
    setState((s) => ({ ...s, screen: 'mirror' }));
  };

  const checkAndAutoGraduate = (cat: Category, newCount: number) => {
    if (newCount < SELF_DECISION_LIMIT) return;
    addHistory(
      cat,
      'auto-graduate',
      `${SELF_DECISION_LIMIT} 回トレーニング完了 → 自律実行モードへ自動遷移`
    );
    updateCategory(cat, (prev) => ({ ...prev, mode: 'autonomous' }));
    decayScore(cat, 8);
    setTimeout(() => {
      setState((s) => ({ ...s, screen: 'autonomous' }));
    }, 1800);
  };

  const handleSelfDecision = (cat: Category, suggestionId: string, reason: string) => {
    const opt = suggestions[cat].find((o) => o.id === suggestionId);
    const detail = `自分で選んだ: ${opt?.text ?? '(不明)'}${reason ? ` / 理由: ${reason}` : ''}`;
    addHistory(cat, 'self-decision', detail);
    const newCount = state[cat].selfDecisionCount + 1;
    updateCategory(cat, (prev) => ({
      ...prev,
      selfDecisionCount: newCount,
      lastSelfDecisionAt: new Date()
    }));
    decayScore(cat, 0.5);
    checkAndAutoGraduate(cat, newCount);
  };

  const handleFreeInput = (cat: Category, freeText: string) => {
    if (!freeText.trim()) return;
    addHistory(cat, 'free-input', `自由記載: ${freeText.trim()}`);
    const newCount = state[cat].selfDecisionCount + 1;
    updateCategory(cat, (prev) => ({
      ...prev,
      selfDecisionCount: newCount,
      lastSelfDecisionAt: new Date()
    }));
    decayScore(cat, 0.3);
    checkAndAutoGraduate(cat, newCount);
  };

  const handleSingleDelegate = (cat: Category, suggestionId: string) => {
    const opt = suggestions[cat].find((o) => o.id === suggestionId);
    const detail = `単発委譲（AI 選択）: ${opt?.text ?? '(不明)'}`;
    addHistory(cat, 'single-delegation', detail);
    updateCategory(cat, (prev) => ({
      ...prev,
      delegationCount: prev.delegationCount + 1
    }));
    decayScore(cat, 1.5);
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
      mode: 'autonomous',
      delegationCount: prev.delegationCount + 1
    }));
    decayScore(cat, 12);
    setState((s) => ({
      ...s,
      showCompleteDelegationDialog: false,
      screen: 'autonomous'
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

  const handleToggleAutonomous = (cat: Category) => {
    updateCategory(cat, (prev) => ({
      ...prev,
      mode: prev.mode === 'active' ? 'autonomous' : 'active',
      // autonomous → active に戻す時はトレーニング回数をリセット (デモ用途)
      selfDecisionCount: prev.mode === 'autonomous' ? 0 : prev.selfDecisionCount
    }));
    setState((s) => ({
      ...s,
      activeCategory: cat,
      screen: state[cat].mode === 'active' ? 'autonomous' : 'suggestion'
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
            shopping={state.shopping}
            onSelect={handleSelectCategory}
            onMirror={handleGoMirror}
          />
        );
      case 'suggestion':
        if (!state.activeCategory) return null;
        return (
          <SuggestionScreen
            key={state.activeCategory}
            category={state.activeCategory}
            selfDecisionCount={state[state.activeCategory].selfDecisionCount}
            onSelectOwn={(id, reason) => handleSelfDecision(state.activeCategory!, id, reason)}
            onFreeInput={(text) => handleFreeInput(state.activeCategory!, text)}
            onSingleDelegate={(id) => handleSingleDelegate(state.activeCategory!, id)}
            onCompleteDelegate={handleRequestCompleteDelegation}
            onBack={handleBackToCategorySelect}
          />
        );
      case 'autonomous':
        if (!state.activeCategory) return null;
        return (
          <AutonomousScreen
            category={state.activeCategory}
            onAutoExecuted={handleAutoExecuted}
            onBack={handleBackToCategorySelect}
          />
        );
      case 'mirror':
        return (
          <MirrorScreen
            contact={state.contact}
            shopping={state.shopping}
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
        contactMode={state.contact.mode}
        shoppingMode={state.shopping.mode}
        onToggleMode={handleToggleAutonomous}
        onResetAll={handleResetAll}
        onGoMirror={handleGoMirror}
      />
    </div>
  );
}
