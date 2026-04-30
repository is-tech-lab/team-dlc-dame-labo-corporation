import { useEffect, useState } from 'react';
import { Category } from '../types';
import { categoryLabel, phase4Reports } from '../mockData';
import { tone } from '../tonePhrases';
import { speak, stopSpeaking } from '../lib/speech';
import PhaseBadge, { PhaseDescription } from '../components/PhaseBadge';

type Props = {
  category: Category;
  onAutoExecuted: (detail: string) => void;
  onBack: () => void;
};

export default function Phase4Screen({ category, onAutoExecuted, onBack }: Props) {
  const reports = phase4Reports[category];
  const [pickedReports, setPickedReports] = useState<string[]>([]);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const triggerAutoExecute = async () => {
    const next = reports[Math.floor(Math.random() * reports.length)];
    setSpeaking(true);
    setPickedReports((prev) => [next, ...prev].slice(0, 5));
    onAutoExecuted(next);
    try {
      await speak(next, { rate: 0.92, pitch: 0.82 });
    } finally {
      setSpeaking(false);
    }
  };

  return (
    <div className="screen phase4">
      <button className="back-link" onClick={onBack}>← カテゴリに戻る</button>
      <div className="suggestion-header">
        <span className="category-tag">{categoryLabel[category]}</span>
        <PhaseBadge phase={4} variant="pill" />
      </div>
      <PhaseDescription phase={4} />

      <h2 className="phase4-title">{tone.phase4Listening}</h2>

      <div className="phase4-card">
        <div className="phase4-instruction">
          イヤホンを接続するか、PC の音量を上げてください。
        </div>
        <button
          className="phase4-execute-button"
          onClick={triggerAutoExecute}
          disabled={speaking}
        >
          {speaking ? '報告中…' : '自律実行を発火（デモ）'}
        </button>
      </div>

      {pickedReports.length > 0 && (
        <div className="phase4-history">
          <div className="phase4-history-title">事後報告ログ</div>
          <ul>
            {pickedReports.map((r, i) => (
              <li key={i}>
                <span className="phase4-prefix">やっといたよ：</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
