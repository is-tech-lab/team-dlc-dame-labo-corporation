import { Category, CategoryState } from '../types';
import { categoryLabel } from '../mockData';

type Props = {
  contact: CategoryState;
  shopping: CategoryState;
  onSelect: (category: Category) => void;
  onMirror: () => void;
};

export default function CategorySelectScreen({ contact, shopping, onSelect, onMirror }: Props) {
  return (
    <div className="screen">
      <h2 className="section-title">どこから手放しますか？</h2>
      <p className="section-sub">最初は連絡か、人間関係から。両方並行でも構わない。</p>

      <div className="category-grid">
        <CategoryCard state={contact} onClick={() => onSelect('contact')} />
        <CategoryCard state={shopping} onClick={() => onSelect('shopping')} />
      </div>

      <button className="ghost-button mt32" onClick={onMirror}>
        ミラーで進捗を見る
      </button>
    </div>
  );
}

function CategoryCard({ state, onClick }: { state: CategoryState; onClick: () => void }) {
  const label = categoryLabel[state.category];
  const modeLabel = state.mode === 'autonomous' ? '完全委譲済み — 自律実行' : 'アクティブ — AI 提案中';
  return (
    <button className={`category-card mode-${state.mode}`} onClick={onClick}>
      <div className="category-name">{label}</div>
      <div className={`category-phase mode-${state.mode}`}>{modeLabel}</div>
      <div className="category-detail">
        自己決定 {state.selfDecisionCount} 回 / 委譲 {state.delegationCount} 回
      </div>
    </button>
  );
}
