import { Category, CategoryMode } from '../types';

type Props = {
  activeCategory: Category | null;
  contactMode: CategoryMode;
  shoppingMode: CategoryMode;
  onToggleMode: (category: Category) => void;
  onResetAll: () => void;
  onGoMirror: () => void;
};

export default function DemoControls({
  activeCategory,
  contactMode,
  shoppingMode,
  onToggleMode,
  onResetAll,
  onGoMirror
}: Props) {
  const renderToggle = (label: string, currentMode: CategoryMode, category: Category) => (
    <div className="demo-controls-section">
      <span className="demo-label">
        {label}: <span className="demo-current">{currentMode === 'autonomous' ? '自律実行' : 'アクティブ'}</span>
      </span>
      <button
        className={`demo-button ${activeCategory === category ? 'active' : ''}`}
        onClick={() => onToggleMode(category)}
        title="モード切替（active ↔ autonomous）"
      >
        切替
      </button>
    </div>
  );

  return (
    <div className="demo-controls">
      <div className="demo-controls-title">DEMO CONTROLS</div>
      <div className="demo-legend">
        <span>active = AI 提案 + 自由記載</span>
        <span>autonomous = 完全委譲済み</span>
      </div>
      {renderToggle('連絡', contactMode, 'contact')}
      {renderToggle('買い物', shoppingMode, 'shopping')}
      <div className="demo-controls-section">
        <button className="demo-button" onClick={onGoMirror}>ミラー</button>
        <button className="demo-button danger" onClick={onResetAll}>リセット</button>
      </div>
    </div>
  );
}
