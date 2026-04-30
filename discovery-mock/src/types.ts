export type Phase = 1 | 2 | 3 | 4;
export type Category = 'contact' | 'relationship';
export type ScreenName =
  | 'onboarding'
  | 'category-select'
  | 'suggestion'
  | 'phase4-listening'
  | 'mirror';

export type Suggestion = {
  id: string;
  text: string;
  hint?: string;
};

export type DelegationKind =
  | 'self-decision'
  | 'single-delegation'
  | 'phase-up'
  | 'complete-delegation'
  | 'auto-execute';

export type HistoryEntry = {
  date: Date;
  category: Category;
  kind: DelegationKind;
  detail: string;
};

export type CategoryState = {
  category: Category;
  phase: Phase;
  selfDecisionCount: number;
  delegationCount: number;
  history: HistoryEntry[];
  lastSelfDecisionAt: Date | null;
  scoreSeries: { day: number; score: number }[];
};

export type AppState = {
  userName: string;
  contact: CategoryState;
  relationship: CategoryState;
  screen: ScreenName;
  activeCategory: Category | null;
  showCompleteDelegationDialog: boolean;
};
