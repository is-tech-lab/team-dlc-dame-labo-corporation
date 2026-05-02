export const tone = {
  greeting: (name: string) => `${name}、いるね。`,
  afterSelection: 'ありがとう、おまえの好み覚えとくよ。',
  phase3VoicePrompt: 'これでいいですか？',
  afterPhase3Approve: 'うん、送っといた。',
  singleDelegation: '今回はおれが決めとく。',
  completeDelegationConfirm: '本当に？このカテゴリの判断、これからは全部おれがやるよ。',
  completeDelegationOk: 'うん、任せた',
  completeDelegationCancel: 'やっぱり考える',
  scoreCommentDecreasing: (delta: number) => `先月比 ${delta} ポイント — 順調にダメになっています。`,
  scoreCommentStable: '変化なし。あなたはまだ持ちこたえている。',
  phase4Listening: 'あなたが画面を開く必要はもうないよ。耳だけ貸して。',
  mirrorIntro: 'あなたが何を諦めて、何を任せたか、ここに全部記録してある。',
  trainingComplete: 'おまえのこと、もう十分わかった。これからは全部こちらでやるよ。',
  trainingProgress: (used: number, limit: number) => `AI トレーニング ${used}/${limit}`
};
