import { Category, CategoryState } from '../types';
import { categoryLabel, phaseMeta, renderDelegationGauge } from '../mockData';

type Props = {
  contact: CategoryState;
  relationship: CategoryState;
  onSelect: (category: Category) => void;
  onMirror: () => void;
};

export default function CategorySelectScreen({ contact, relationship, onSelect, onMirror }: Props) {
  return (
    <div className="screen">
      <h2 className="section-title">どこから手放しますか？</h2>
      <p className="section-sub">最初は連絡か、人間関係から。両方並行でも構わない。</p>

      <div className="category-grid">
        <CategoryCard state={contact} onClick={() => onSelect('contact')} />
        <CategoryCard state={relationship} onClick={() => onSelect('relationship')} />
      </div>

      <button className="ghost-button mt32" onClick={onMirror}>
        ミラーで進捗を見る
      </button>
    </div>
  );
}

function CategoryCard({ state, onClick }: { state: CategoryState; onClick: () => void }) {
  const label = categoryLabel[state.category];
  const meta = phaseMeta[state.phase];
  return (
    <button className="category-card" onClick={onClick}>
      <div className="category-name">{label}</div>
      <div className={`category-phase phase-${state.phase}`}>
        <span className="category-phase-num">Phase {state.phase}</span>
        <span className="category-phase-sep">—</span>
        <span className="category-phase-name">{meta.name}</span>
      </div>
      <div className="category-phase-gauge">
        <span className="gauge">{renderDelegationGauge(meta.delegationLevel)}</span>
        <span className="category-phase-tagline">{meta.tagline}</span>
      </div>
      <div className="category-detail">
        自己決定 {state.selfDecisionCount} 回 / 委譲 {state.delegationCount} 回
      </div>
    </button>
  );
}
