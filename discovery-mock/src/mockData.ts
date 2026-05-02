import { Category, Suggestion } from './types';

export const categoryLabel: Record<Category, string> = {
  contact: '連絡',
  shopping: '買い物'
};

// active モード: 常に 4 提案 + 自由記載
export const categoryQuestion: Record<Category, string> = {
  contact: 'お母さんから LINE 来てたな。なに返す？',
  shopping: 'Amazon のカートに残ってるな。どうする？'
};

export const suggestions: Record<Category, Suggestion[]> = {
  contact: [
    { id: 'c-1', text: 'お母さんに「元気だよ、最近忙しいけど大丈夫」と返信', hint: '直近で 2 回選んでた' },
    { id: 'c-2', text: 'お母さんに「今度電話するね」と返信', hint: '電話ハードル高そうな時のパターン' },
    { id: 'c-3', text: 'お母さんに「ごめん最近忙しくて、また連絡する」と返信', hint: '逃げ気味の時' },
    { id: 'c-4', text: '既読スルー', hint: '今のあなたなら正直これ' }
  ],
  shopping: [
    { id: 'sh-1', text: 'カートの商品をまとめて購入（合計 ¥4,200）', hint: '何度か放置してたパターン' },
    { id: 'sh-2', text: 'カート空にして購入保留', hint: '来月に持ち越し' },
    { id: 'sh-3', text: 'Prime セールまで待つ（約 3 日後）', hint: '値下げ狙い' },
    { id: 'sh-4', text: '楽天の同商品と比較する', hint: 'ポイント重視' }
  ]
};

// autonomous モード: AI 自律実行の事後報告
// 受信代行 + agent-initiated 自発代行を混在
export const autonomousReports: Record<Category, string[]> = {
  contact: [
    'お母さんから来てた LINE に「元気だよ」って返しといたから',
    '上司の Slack に「承知しました、対応します」返しといたよ',
    '取引先のメール、丁寧めに返信しといた。「明日朝までに進捗共有します」って',
    'お父さん、明日が誕生日だったから「いつもありがとう」ってメッセージ送っといた',
    '最近お母さんに連絡してなかったでしょ？　こちらから「元気？」送っといた',
    '取引先への定期報告、今月分こちらから送っといたよ'
  ],
  shopping: [
    // 受信代行 (来てた通知に応答)
    'Amazon カートに残ってた本 3 冊、まとめて買っといたよ',
    'Netflix のサブスク更新通知来てたから、自動更新止めといた。最近見てないでしょ',
    'セール終了前にトイレットペーパー買い足しといた、3 日後に届く',
    // 自発代行 (AI が自ら判断)
    'シャンプー残り少ないみたいだから、いつものブランド買っといた',
    '今月のサブスク見直したよ。使ってない 2 つ解約しといた、月 ¥1,800 浮いた',
    'お父さんの誕生日プレゼント、革財布頼んどいた。来週届く'
  ]
};

export const buildInitialScoreSeries = (): { day: number; score: number }[] => {
  const series: { day: number; score: number }[] = [];
  let s = 100;
  for (let d = 0; d < 30; d++) {
    if (d > 5) s -= Math.random() * 1.2 + 0.3;
    if (d > 15) s -= Math.random() * 1.5;
    series.push({ day: d - 29, score: Math.max(0, Math.round(s * 10) / 10) });
  }
  return series;
};
