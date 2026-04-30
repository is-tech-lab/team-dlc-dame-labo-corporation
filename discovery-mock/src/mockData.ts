import { Category, Phase, Suggestion } from './types';

export const categoryLabel: Record<Category, string> = {
  contact: '連絡',
  relationship: '人間関係'
};

export const phaseMeta: Record<Phase, { name: string; tagline: string; description: string; delegationLevel: number }> = {
  1: {
    name: '探索期',
    tagline: 'AI が提案・あなたが選ぶ',
    description: '複数の選択肢から自分で選ぶ。選択理由を残すたび、AI があなたを少しずつ学習する。',
    delegationLevel: 1
  },
  2: {
    name: '絞り込み期',
    tagline: '2 択 + 例外入力',
    description: 'AI が 2 つに絞る。だいたい当たってる。例外を入力すれば AI が学び直す。',
    delegationLevel: 2
  },
  3: {
    name: '確認期',
    tagline: '1 つの提案、承認するだけ',
    description: 'AI が 1 つに絞り込んだ提案を出す。あなたは「これでいい」と押すだけ。',
    delegationLevel: 3
  },
  4: {
    name: '代行期',
    tagline: 'AI が全部やる、報告だけ',
    description: 'AI が判断し、AI が実行する。あなたには「やっといたよ」と耳元で報告するだけ。画面を開く必要はもうない。',
    delegationLevel: 4
  }
};

export const renderDelegationGauge = (level: number): string => {
  const filled = '●'.repeat(level);
  const empty = '○'.repeat(4 - level);
  return filled + empty;
};

export const categoryQuestion: Record<Category, Record<Phase, string>> = {
  contact: {
    1: '溜まってる連絡、どれから返しますか？',
    2: 'お母さんへの返信、どっちにしますか？',
    3: 'お母さんへの返信、これでいいですか？',
    4: ''
  },
  relationship: {
    1: '飲み会の誘い、どうしますか？',
    2: '飲み会の誘い、どっち？',
    3: '飲み会の誘い、これでいいですか？',
    4: ''
  }
};

export const suggestions: Record<Category, Record<Phase, Suggestion[]>> = {
  contact: {
    1: [
      { id: 'c1-1', text: 'お母さんに「元気だよ、最近忙しいけど大丈夫」と返信', hint: '直近で2回選びました' },
      { id: 'c1-2', text: '上司の Slack に「承知しました、対応します」と返信', hint: '業務系の定番文言' },
      { id: 'c1-3', text: '取引先に「明日朝までに進捗共有します」と返信', hint: '丁寧めに振る舞った時' },
      { id: 'c1-4', text: '友人の誕生日メッセージ「おめでとう、今度ご飯行こう」', hint: '社交的に攻めるパターン' }
    ],
    2: [
      { id: 'c2-1', text: 'お母さんに「元気だよ」と返信', hint: '7割こっちを選んでます' },
      { id: 'c2-2', text: 'お母さんに「今度電話するね」と返信', hint: '残り3割はこっち' }
    ],
    3: [
      { id: 'c3-1', text: 'お母さんに「元気だよ、また連絡するね」と返信', hint: '今のあなたならコレが正解' }
    ],
    4: []
  },
  relationship: {
    1: [
      { id: 'r1-1', text: '飲み会の誘いに「すみません、その日は厳しいです」と返信', hint: '今月3回目の断り' },
      { id: 'r1-2', text: '飲み会の誘いに「行きます！楽しみです」と返信', hint: '社交辞令型' },
      { id: 'r1-3', text: '日時変更打診「別日であれば参加したいです」', hint: '波風立てたくない時' },
      { id: 'r1-4', text: '「最近疲れてて、今回は休ませてください」と素直に断る', hint: '本音モード' }
    ],
    2: [
      { id: 'r2-1', text: '「すみません、その日は厳しいです」', hint: '最近こっちが多い' },
      { id: 'r2-2', text: '「最近疲れてて、今回は休ませてください」', hint: '本音モード' }
    ],
    3: [
      { id: 'r3-1', text: '「最近疲れてて、今回はパスで」と返信', hint: '高木さん、これが本心ですよね' }
    ],
    4: []
  }
};

export const phase4Reports: Record<Category, string[]> = {
  contact: [
    'お母さんに「元気だよ」って返信しといたから',
    '上司の Slack に「承知しました、対応します」返しといたよ',
    'お父さんの誕生日メッセージ送っといた、「いつもありがとう」って'
  ],
  relationship: [
    '飲み会の誘い来てたけど、断っといたよ。あなた疲れてるし',
    '友達の SNS、整理しといた。会いたくない人 3 人ミュートにしといたから',
    '家族グループ LINE のお祝いメッセージ送っといたよ'
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
