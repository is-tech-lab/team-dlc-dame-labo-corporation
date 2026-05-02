import { useState } from 'react';
import { Category, Suggestion } from '../types';
import { categoryLabel, categoryQuestion, suggestions } from '../mockData';
import { tone } from '../tonePhrases';
import { speak } from '../lib/speech';
import { SELF_DECISION_LIMIT } from '../App';

type Props = {
  category: Category;
  selfDecisionCount: number;
  onSelectOwn: (suggestionId: string, reason: string) => void;
  onFreeInput: (text: string) => void;
  onSingleDelegate: (suggestionId: string) => void;
  onCompleteDelegate: () => void;
  onBack: () => void;
};

export default function SuggestionScreen({
  category,
  selfDecisionCount,
  onSelectOwn,
  onFreeInput,
  onSingleDelegate,
  onCompleteDelegate,
  onBack
}: Props) {
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);
  const [freeInputText, setFreeInputText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [aiChose, setAiChose] = useState<Suggestion | null>(null);

  const opts = suggestions[category];
  const question = categoryQuestion[category];
  const trainingExhausted = selfDecisionCount >= SELF_DECISION_LIMIT;

  const handleSubmit = () => {
    if (selectedSuggestionId) {
      onSelectOwn(selectedSuggestionId, freeInputText);
      setFeedback(tone.afterSelection);
      setAiChose(null);
    } else if (freeInputText.trim()) {
      onFreeInput(freeInputText);
      setFeedback('自分で書いたな。記録しといた。');
      setAiChose(null);
    }
  };

  const handleSingleDelegate = () => {
    const aiPick = opts[Math.floor(Math.random() * opts.length)];
    setAiChose(aiPick);
    setSelectedSuggestionId(aiPick.id);
    setFeedback(tone.singleDelegation);
    onSingleDelegate(aiPick.id);
    void speak(tone.singleDelegation);
  };

  const canSubmit = selectedSuggestionId !== null || freeInputText.trim().length > 0;

  return (
    <div className="screen suggestion">
      <button className="back-link" onClick={onBack}>← カテゴリに戻る</button>
      <div className="suggestion-header">
        <span className="category-tag">{categoryLabel[category]}</span>
        <TrainingProgress used={selfDecisionCount} limit={SELF_DECISION_LIMIT} />
      </div>

      <h2 className="suggestion-question">{question}</h2>

      <div className="suggestion-list">
        {opts.map((s, i) => (
          <label
            key={s.id}
            className={`suggestion-option ${selectedSuggestionId === s.id ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name="suggestion"
              checked={selectedSuggestionId === s.id}
              onChange={() => setSelectedSuggestionId(s.id)}
            />
            <div className="suggestion-option-body">
              <div className="suggestion-option-text">[{i + 1}] {s.text}</div>
              {s.hint && <div className="suggestion-option-hint">（{s.hint}）</div>}
            </div>
          </label>
        ))}
      </div>

      <div className="free-input">
        <label>
          自由記載 — どれもしっくり来ないなら自分で書く
        </label>
        <textarea
          placeholder="例: 「明日電話するね」と返したい"
          value={freeInputText}
          onChange={(e) => {
            setFreeInputText(e.target.value);
            if (e.target.value.trim()) setSelectedSuggestionId(null);
          }}
          rows={2}
        />
      </div>

      <div className="action-row">
        <button
          className="primary-button"
          onClick={handleSubmit}
          disabled={!canSubmit || trainingExhausted}
          title={trainingExhausted ? 'トレーニング 3 回到達済み、もう自分では決められない' : ''}
        >
          {freeInputText.trim() && !selectedSuggestionId ? '自分で書いたので送る' : '自分で決める'}
        </button>
        <button className="secondary-button" onClick={handleSingleDelegate}>
          AI に任せる（1回だけ）
        </button>
      </div>
      {trainingExhausted && (
        <div className="training-exhausted-note">
          自分で決められる回数は終わった。AI に任せるか、完全委譲するしかない。
        </div>
      )}

      <div className="action-row mt16">
        <button className="danger-button" onClick={onCompleteDelegate}>
          もう{categoryLabel[category]}のことは考えたくない（完全委譲）
        </button>
      </div>

      {aiChose && (
        <div className="ai-chose-result">
          <div className="ai-chose-label">
            <span className="ai-chose-eye">🤖</span>
            AI がこれを選んだ
          </div>
          <div className="ai-chose-text">{aiChose.text}</div>
          {aiChose.hint && <div className="ai-chose-hint">（{aiChose.hint}）</div>}
        </div>
      )}

      {feedback && <div className="ryuk-feedback">{feedback}</div>}
    </div>
  );
}

function TrainingProgress({ used, limit }: { used: number; limit: number }) {
  const dots = Array.from({ length: limit }, (_, i) => i < used);
  const exhausted = used >= limit;
  return (
    <span className={`training-progress ${exhausted ? 'exhausted' : ''}`}>
      <span className="training-progress-dots">
        {dots.map((filled, i) => (
          <span key={i} className={filled ? 'dot filled' : 'dot empty'}>●</span>
        ))}
      </span>
      <span className="training-progress-label">{tone.trainingProgress(used, limit)}</span>
    </span>
  );
}
