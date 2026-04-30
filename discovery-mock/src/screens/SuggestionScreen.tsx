import { useState } from 'react';
import { Category, Phase } from '../types';
import { categoryLabel, categoryQuestion, suggestions } from '../mockData';
import { tone } from '../tonePhrases';
import { speak } from '../lib/speech';
import PhaseBadge, { PhaseDescription } from '../components/PhaseBadge';

type Props = {
  category: Category;
  phase: Phase;
  onSelectOwn: (suggestionId: string, reason: string) => void;
  onSingleDelegate: () => void;
  onPhaseUp: () => void;
  onCompleteDelegate: () => void;
  onBack: () => void;
};

export default function SuggestionScreen({
  category,
  phase,
  onSelectOwn,
  onSingleDelegate,
  onPhaseUp,
  onCompleteDelegate,
  onBack
}: Props) {
  const opts = suggestions[category][phase];
  const question = categoryQuestion[category][phase];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selectedId) return;
    onSelectOwn(selectedId, reason);
    setFeedback(phase === 3 ? tone.afterPhase3Approve : tone.afterSelection);
    if (phase === 3) {
      void speak(tone.phase3VoicePrompt);
    }
  };

  const handleSingleDelegate = () => {
    onSingleDelegate();
    setFeedback(tone.singleDelegation);
    void speak(tone.singleDelegation);
  };

  return (
    <div className="screen suggestion">
      <button className="back-link" onClick={onBack}>← カテゴリに戻る</button>
      <div className="suggestion-header">
        <span className="category-tag">{categoryLabel[category]}</span>
        <PhaseBadge phase={phase} />
      </div>
      <PhaseDescription phase={phase} />
      <h2 className="suggestion-question">{question}</h2>

      <div className="suggestion-list">
        {opts.map((s, i) => (
          <label
            key={s.id}
            className={`suggestion-option ${selectedId === s.id ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name="suggestion"
              checked={selectedId === s.id}
              onChange={() => setSelectedId(s.id)}
            />
            <div className="suggestion-option-body">
              <div className="suggestion-option-text">[{i + 1}] {s.text}</div>
              {s.hint && <div className="suggestion-option-hint">（{s.hint}）</div>}
            </div>
          </label>
        ))}
      </div>

      {phase === 2 && (
        <div className="exception-input">
          <label>例外として自分の文案を入れる:</label>
          <input
            type="text"
            placeholder="自由記述"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      )}

      {phase === 1 && selectedId && (
        <div className="reason-input">
          <label>選択理由（任意）:</label>
          <input
            type="text"
            placeholder="例: 親しいから / 急ぎではないから一旦留めた"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      )}

      <div className="action-row">
        <button
          className="primary-button"
          onClick={handleConfirm}
          disabled={!selectedId}
        >
          {phase === 3 ? 'これでいい' : '自分で決める'}
        </button>
        {phase < 4 && (
          <button className="secondary-button" onClick={handleSingleDelegate}>
            AI に任せる（1回だけ）
          </button>
        )}
      </div>

      {phase < 4 && (
        <div className="action-row mt16">
          <button className="ghost-button" onClick={onPhaseUp}>
            次のフェーズに進める
          </button>
          <button className="danger-button" onClick={onCompleteDelegate}>
            もう{categoryLabel[category]}のことは考えたくない（完全委譲）
          </button>
        </div>
      )}

      {feedback && <div className="ryuk-feedback">{feedback}</div>}
    </div>
  );
}
