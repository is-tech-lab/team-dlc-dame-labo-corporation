import { useEffect, useState } from 'react';
import { Category } from '../types';
import { autonomousReports, categoryLabel } from '../mockData';
import { tone } from '../tonePhrases';
import { speak, stopSpeaking } from '../lib/speech';

type Props = {
  category: Category;
  onAutoExecuted: (detail: string) => void;
  onBack: () => void;
};

export default function AutonomousScreen({ category, onAutoExecuted, onBack }: Props) {
  const reports = autonomousReports[category];
  const [pickedReports, setPickedReports] = useState<string[]>([]);
  const [speaking, setSpeaking] = useState(false);

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

  // 入った瞬間に 1 回目を自動発火 (放置されたら沈黙が「真っ暗」になる)
  useEffect(() => {
    const t = setTimeout(() => {
      void triggerAutoExecute();
    }, 1500);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="screen phase4">
      <button className="back-link" onClick={onBack}>← カテゴリに戻る</button>
      <div className="suggestion-header">
        <span className="category-tag">{categoryLabel[category]}</span>
        <span className="autonomous-badge">完全委譲済み — 自律実行モード</span>
      </div>

      <div className="autonomous-graduation-message">
        {tone.trainingComplete}
      </div>

      <h2 className="phase4-title">{tone.phase4Listening}</h2>

      <div className="phase4-card">
        <div className="phase4-instruction">
          {speaking ? (
            <span className="autonomous-pulse">AI が代わりに動いてる…</span>
          ) : (
            <>イヤホンを接続するか、PC の音量を上げてください。</>
          )}
        </div>
        <button
          className="phase4-execute-button"
          onClick={triggerAutoExecute}
          disabled={speaking}
        >
          {speaking ? '報告中…' : 'もう一度発火（デモ）'}
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
