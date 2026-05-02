import { CategoryState } from '../types';
import { categoryLabel } from '../mockData';
import { tone } from '../tonePhrases';

type Props = {
  contact: CategoryState;
  shopping: CategoryState;
  onBack: () => void;
};

export default function MirrorScreen({ contact, shopping, onBack }: Props) {
  const allHistory = [...contact.history, ...shopping.history]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  return (
    <div className="screen mirror">
      <button className="back-link" onClick={onBack}>← カテゴリに戻る</button>
      <h2 className="mirror-title">ミラー</h2>
      <p className="mirror-sub">{tone.mirrorIntro}</p>

      <div className="mirror-grid">
        <CategoryStatusCard state={contact} />
        <CategoryStatusCard state={shopping} />
      </div>

      <ScoreChart contact={contact} shopping={shopping} />

      <div className="mirror-section">
        <h3>委譲アクション履歴</h3>
        {allHistory.length === 0 ? (
          <div className="empty">まだ何も諦めていない。</div>
        ) : (
          <ul className="history-list">
            {allHistory.map((h, i) => (
              <li key={i} className={`history-${h.kind}`}>
                <div className="history-date">{formatDate(h.date)}</div>
                <div className="history-detail">
                  <span className="history-category">[{categoryLabel[h.category]}]</span>
                  {h.detail}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function CategoryStatusCard({ state }: { state: CategoryState }) {
  const total = state.selfDecisionCount + state.delegationCount;
  const delegationRate = total === 0 ? 0 : Math.round((state.delegationCount / total) * 100);
  const lastDayLabel = state.lastSelfDecisionAt
    ? formatRelative(state.lastSelfDecisionAt)
    : '自己決定なし';
  const modeLabel = state.mode === 'autonomous' ? '完全委譲済み — 自律実行' : 'アクティブ';

  return (
    <div className={`mirror-card mode-${state.mode}`}>
      <div className="mirror-card-name">{categoryLabel[state.category]}</div>
      <div className="mirror-card-phase">
        <span className="mirror-card-phase-name">{modeLabel}</span>
      </div>
      <div className="mirror-card-stats">
        <div>自己決定 {state.selfDecisionCount} 回</div>
        <div>AI 委譲 {state.delegationCount} 回 ({delegationRate}%)</div>
        <div className="mirror-card-last">最後に自分で選んだ: {lastDayLabel}</div>
      </div>
    </div>
  );
}

function ScoreChart({ contact, shopping }: { contact: CategoryState; shopping: CategoryState }) {
  const width = 600;
  const height = 200;
  const padding = 32;

  const scoreSeries = mergeSeries(contact.scoreSeries, shopping.scoreSeries);
  if (scoreSeries.length === 0) return null;

  const maxScore = 100;
  const minScore = 0;
  const days = scoreSeries.length;

  const xFor = (i: number) => padding + ((width - padding * 2) * i) / Math.max(1, days - 1);
  const yFor = (s: number) => padding + (height - padding * 2) * (1 - (s - minScore) / (maxScore - minScore));

  const path = scoreSeries
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i).toFixed(2)} ${yFor(p.score).toFixed(2)}`)
    .join(' ');

  const last = scoreSeries[scoreSeries.length - 1].score;
  const first = scoreSeries[0].score;
  const delta = Math.round((last - first) * 10) / 10;
  const comment = delta < 0 ? tone.scoreCommentDecreasing(delta) : tone.scoreCommentStable;

  return (
    <div className="mirror-section">
      <h3>自己決定能力スコア</h3>
      <div className="score-current">{last.toFixed(1)} <span className="score-unit">/ 100</span></div>
      <div className="score-comment">{comment}</div>
      <svg viewBox={`0 0 ${width} ${height}`} className="score-chart">
        {[0, 25, 50, 75, 100].map((g) => (
          <g key={g}>
            <line
              x1={padding}
              x2={width - padding}
              y1={yFor(g)}
              y2={yFor(g)}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
            <text x={padding - 6} y={yFor(g) + 4} textAnchor="end" fontSize={10} fill="rgba(255,255,255,0.4)">
              {g}
            </text>
          </g>
        ))}
        <path d={path} fill="none" stroke="#ff6b6b" strokeWidth={2.5} />
      </svg>
    </div>
  );
}

function mergeSeries(a: { day: number; score: number }[], b: { day: number; score: number }[]) {
  const days = Array.from(new Set([...a.map((p) => p.day), ...b.map((p) => p.day)])).sort((x, y) => x - y);
  return days.map((day) => {
    const av = a.find((p) => p.day === day)?.score ?? 100;
    const bv = b.find((p) => p.day === day)?.score ?? 100;
    return { day, score: (av + bv) / 2 };
  });
}

function formatDate(d: Date) {
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatRelative(d: Date) {
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 0) return '今日';
  if (diffDays === 1) return '昨日';
  if (diffDays < 30) return `${diffDays} 日前`;
  return formatDate(d);
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}
