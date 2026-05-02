# Discovery Mock — ダメ・ラボ・コーポレーション

AWS Summit Japan 2026 AI-DLC ハッカソン参加チームの **Discovery Mock**。
**捨てる前提のフロントエンドのみのプロトタイプ** で、リューク的相棒トーン・委ねるボタンのドラマ性・Phase 4 音声体験を磨くために作成されたもの。

## ⚠️ Construction フェーズで参照しないこと

このディレクトリのコードは **本番開発の参考にしない**。
- 仕様の正本は `aidlc-docs/` 配下のドキュメント
- このモックは Discovery 目的で書かれた捨てコード
- 本番（Construction フェーズ）の Code Generation はゼロから書く

詳細は `aidlc-docs/inception/plans/discovery-mock-plan.md` を参照。

## 起動方法

```bash
cd discovery-mock
npm install
npm run dev
```

ブラウザで http://localhost:5173 が自動で開く。

### 推奨ブラウザ
- **Chrome / Edge**（Web Speech API の音声品質が良い）
- macOS の Safari でも動作するが、日本語音声の質はブラウザ・OS の音声合成エンジン依存

## 触り方

1. **オンボーディング**: 名前確認 → カテゴリ選択（連絡 / 人間関係）
2. **サジェスチョン画面（Phase 1）**: 3〜5 個の選択肢から選ぶ／単発委譲する／フェーズを進める／完全委譲する
3. **画面右下のデモコントロール**でフェーズを手動ジャンプ（実本番では自動昇格）
4. **完全委譲ボタン**を押すとドラマ的な確認ダイアログが表示される
5. **Phase 4 到達後**は「やっといたよ」音声が再生される（イヤホン推奨、または音量を上げる）
6. **ミラー画面**で堕落の進行を可視化（自己決定能力スコアの折れ線グラフ）

## 観点別の確認ポイント

| 観点 | 触ってみて確認すること |
| --- | --- |
| **トーン** | 文言が「リューク的相棒（冷笑系ではない、愛着のある）」になっているか |
| **委ねるボタン** | 押すときに罪悪感＋解放感の両方を感じるか |
| **Phase 4 音声** | 自然に聞こえるか、レイテンシは違和感ないか |
| **完全委譲** | 確認ダイアログの重みは適切か、「うん、任せた」を押すドラマ性 |
| **ミラー** | 堕落の進行が視覚的に伝わるか、スコアコメントは効いているか |

## 知見の還元

モックを触って気づいたことは:
1. 下の「発見事項」セクションに箇条書きで記録
2. `aidlc-docs/inception/plans/application-design-plan.md` の C-3/C-4/C-5/C-7/C-8 への回答に反映
3. 必要なら `requirements.md` / `stories.md` の更新提案を出す

## 発見事項

（チームでモックを触りながら追記）

- [x] **2026-04-29 高木氏**: Phase Num（数字）だけでは抽象的すぎて、各フェーズの意味が伝わらない
  - **対応済み**: フェーズに名称（探索期 / 絞り込み期 / 確認期 / 代行期）、一言タグライン、委譲度ゲージ（●○○○ → ●●●●）、説明文を追加。サジェスチョン画面・カテゴリカード・ミラーカード・DemoControls 全てに反映。
  - **書き戻し候補**: requirements.md / stories.md / personas.md にも phaseMeta 相当の標準フェーズ説明を追加すべきかチームで議論
- [ ] （以後の発見はここに追記）

## ファイル構成

```
discovery-mock/
├── README.md                    ← 本ファイル
├── package.json
├── vite.config.ts
├── tsconfig.*.json
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx                  ← メイン状態管理
    ├── App.css
    ├── types.ts                 ← 型定義
    ├── mockData.ts              ← サジェスチョン応答 / Phase 4 報告 ハードコード
    ├── tonePhrases.ts           ← リューク的相棒トーンの文言集
    ├── lib/
    │   └── speech.ts            ← Web Speech API ラッパー
    ├── screens/
    │   ├── OnboardingScreen.tsx
    │   ├── CategorySelectScreen.tsx
    │   ├── SuggestionScreen.tsx
    │   ├── Phase4Screen.tsx
    │   └── MirrorScreen.tsx
    └── components/
        ├── CompleteDelegationDialog.tsx
        └── DemoControls.tsx
```

## 参照しているドキュメント

このモックは以下の AI-DLC 文書をもとに実装されている:

- `aidlc-docs/inception/user-stories/stories.md` — Must 10 ストーリー（特に 1.3 / 2.4 / 4.3 / 5.5）
- `aidlc-docs/inception/user-stories/personas.md` — 高木皇佑のキャラ・トーン
- `aidlc-docs/inception/requirements/team-pre-discussion.md` — UI スケッチ・Phase 4 音声台詞例

`application-design-plan.md` と `execution-plan.md` は **意図的に参照していない**（モックで判断するため）。
