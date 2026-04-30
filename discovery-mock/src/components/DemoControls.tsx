import { Category, Phase } from '../types';
import { phaseMeta } from '../mockData';

type Props = {
  activeCategory: Category | null;
  contactPhase: Phase;
  relationshipPhase: Phase;
  onJumpPhase: (category: Category, phase: Phase) => void;
  onResetAll: () => void;
  onGoMirror: () => void;
};

export default function DemoControls({
  activeCategory,
  contactPhase,
  relationshipPhase,
  onJumpPhase,
  onResetAll,
  onGoMirror
}: Props) {
  const renderPhaseButtons = (label: string, currentPhase: Phase, category: Category) => (
    <div className="demo-controls-section">
      <span className="demo-label">
        {label} <span className="demo-current">(P{currentPhase} {phaseMeta[currentPhase].name})</span>
      </span>
      {([1, 2, 3, 4] as Phase[]).map((p) => (
        <button
          key={`${category}-${p}`}
          className={`demo-button ${currentPhase === p && activeCategory === category ? 'active' : ''}`}
          onClick={() => onJumpPhase(category, p)}
          title={`Phase ${p} — ${phaseMeta[p].name}: ${phaseMeta[p].tagline}`}
        >
          P{p} {phaseMeta[p].name.charAt(0)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="demo-controls">
      <div className="demo-controls-title">DEMO CONTROLS — フェーズ手動ジャンプ</div>
      <div className="demo-legend">
        <span>P1 探 = 探索期</span><span>P2 絞 = 絞り込み期</span><span>P3 確 = 確認期</span><span>P4 代 = 代行期</span>
      </div>
      {renderPhaseButtons('連絡', contactPhase, 'contact')}
      {renderPhaseButtons('人間関係', relationshipPhase, 'relationship')}
      <div className="demo-controls-section">
        <button className="demo-button" onClick={onGoMirror}>ミラー</button>
        <button className="demo-button danger" onClick={onResetAll}>リセット</button>
      </div>
    </div>
  );
}
