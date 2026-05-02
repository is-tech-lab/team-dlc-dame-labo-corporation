export type Category = 'contact' | 'shopping';
export type CategoryMode = 'active' | 'autonomous';

export type Suggestion = {
  id: string;
  text: string;
  hint?: string;
};

export type DelegationKind =
  | 'self-decision'
  | 'free-input'
  | 'single-delegation'
  | 'complete-delegation'
  | 'auto-execute'
  | 'auto-graduate';

export type HistoryEntry = {
  date: Date;
  category: Category;
  kind: DelegationKind;
  detail: string;
};

export type CategoryState = {
  category: Category;
  mode: CategoryMode;
  selfDecisionCount: number;
  delegationCount: number;
  history: HistoryEntry[];
  lastSelfDecisionAt: Date | null;
  scoreSeries: { day: number; score: number }[];
};

export type ScreenName = 'onboarding' | 'category-select' | 'suggestion' | 'autonomous' | 'mirror';

export type AppState = {
  userName: string;
  contact: CategoryState;
  shopping: CategoryState;
  screen: ScreenName;
  activeCategory: Category | null;
  showCompleteDelegationDialog: boolean;
};
