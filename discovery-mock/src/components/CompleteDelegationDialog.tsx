import { useState } from 'react';
import { Category } from '../types';
import { categoryLabel } from '../mockData';
import { tone } from '../tonePhrases';

type Props = {
  category: Category;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function CompleteDelegationDialog({ category, onConfirm, onCancel }: Props) {
  const [pressing, setPressing] = useState(false);

  const handleConfirm = () => {
    setPressing(true);
    setTimeout(() => {
      onConfirm();
      setPressing(false);
    }, 600);
  };

  return (
    <div className="dialog-backdrop">
      <div className={`dialog ${pressing ? 'dialog-confirming' : ''}`}>
        <div className="dialog-eyebrow">完全委譲確認</div>
        <h3 className="dialog-title">{tone.completeDelegationConfirm}</h3>
        <p className="dialog-body">
          このボタンを押すと、<strong>{categoryLabel[category]}</strong> カテゴリは Phase 4 にジャンプします。<br />
          もう、選択肢は提示されません。<br />
          AI が判断し、AI が実行し、あなたには「やっといたよ」と耳元で伝えるだけになります。
        </p>
        <div className="dialog-actions">
          <button className="ghost-button" onClick={onCancel} disabled={pressing}>
            {tone.completeDelegationCancel}
          </button>
          <button className="danger-button-large" onClick={handleConfirm} disabled={pressing}>
            {pressing ? '...' : tone.completeDelegationOk}
          </button>
        </div>
      </div>
    </div>
  );
}
