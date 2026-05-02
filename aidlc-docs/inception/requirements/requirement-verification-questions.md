# Requirements Verification Questions (v2)

このファイルは AWS Summit Japan 2026 AI-DLC ハッカソン「人をダメにするサービス」の要件を確定させるためのチーム協議用質問集（v2: チーム事前議論を反映）。

**前提**: チームは AI-DLC 開始前に詳細な議論を実施済み。完全な原文は `aidlc-docs/inception/requirements/team-pre-discussion.md` に保存。本ファイルは事前議論から **推定確定した事項の確認** と **未決事項の質問** に絞る。

**回答方法**: 各 `[Answer]:` タグの後にアルファベット選択肢（または X) で自由記述）を記入。記入完了後、Claude に「回答完了」と伝える。

---

## Part A: 事前議論からの推定 — 確認だけお願いします

以下は事前議論から推定した内容です。**問題なければ A) 確認、修正があれば X) で詳細記述** をお願いします。

### Question A-1: アイデアの方向性（Q1 相当）

事前議論から推定: **「思考停止系」と「依存系」のハイブリッド** —「決めない快楽」「自己決定能力スコア」など、Larry Wall 三大美徳の "怠慢" を哲学レベルで深掘りする方向。

A) この推定で問題ない（確認）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question A-2: ターゲットユーザー（Q2 相当）

事前議論から推定: **意思決定疲れに苦しむ多忙な社会人（20〜40 代）** がプライマリ。短期ゴールで「最初のユーザー 1 万人」「食事・買い物・連絡カテゴリの利用」と明示。

A) この推定で問題ない（確認）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question A-3: サービス形態（Q3 相当）

事前議論から推定: **Web アプリ（サジェスチョン画面＋ミラー・ダッシュボード）＋ 音声 UI（イヤホン経由）のマルチチャネル**。ハッカソン MVP では Web アプリと音声 UI 双方を見せたい。

A) この推定で問題ない（確認、Web + 音声 UI 両方デモ）
B) **MVP では Web のみ** に絞り、音声 UI は決勝でデモ（時間配分上の現実解）
C) **MVP では音声 UI のみ** に絞り、Web 管理画面は省略
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question A-4: AI 活用度（Q4 相当）

事前議論から推定: **AI 全振り**。3 つの AI エージェント（サジェスチョン／プロファイル／委譲＆実行）が中核で、嗜好ベクトル化・例外パターン抽出・フェーズ自動判定など全てに LLM を活用する。

A) この推定で問題ない（AI 全振り）
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question A-5: トーン（Q5 相当）

事前議論から推定: **真顔のシリアス系 ＋ シニカル風刺**。「決めない快楽」「自己決定の放棄を本人が選び取る構造」など、便利機能ではなく "思考の放棄" として大真面目に提示する文体。

A) この推定で問題ない（シリアス＋シニカル）
X) Other (please describe after [Answer]: tag below)

[Answer]: X
相棒！冷笑系ではない。デスノートの死神リュークみたいな愛着

---

### Question A-14: アイデアの種（Q14 相当）

事前議論から確認: **既にコアコンセプト・エージェント構成・UI まで詳細議論済み**（`team-pre-discussion.md` 参照）。

A) この事前議論をベースに進める（確認）
X) Other (please describe after [Answer]: tag below — 例: "実装中に大きく変える可能性あり" など)

[Answer]: A

---

## Part B: 未決事項 — 新規質問

### Question B-1: MVP のスコープ（Q6 相当）

書類審査・予選・決勝のうち、**書類審査（5/10）と予選（5/30）の MVP デモで何を見せるか**。事前議論には 6 カテゴリ × 4 フェーズ × 3 エージェントが登場するため、ハッカソン期間（5 月）でどこまでを実装するかを決める必要がある。

A) **1 カテゴリ × Phase 1〜4 全部** — たとえば「食事」だけに絞り、4 フェーズの遷移と Phase 4「やっといたよ」音声体験を磨き込む
B) **2〜3 カテゴリ × Phase 1〜3** — 食事・買い物・連絡の 3 カテゴリで Phase 1〜3 まで動作させ、Phase 4 はモック
C) **6 カテゴリ × Phase 1〜2 のみ** — カテゴリの広がりを見せるが、深さは犠牲にする
D) **物語仕立てのデモ動画 + Phase 4 だけ実装** — Phase 1〜3 は動画で見せ、Phase 4「やっといたよ」体験のみ実装
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question B-2: 主要技術スタック（Q7 相当）

AWS 上での開発・稼働が必須。事前議論で 3 エージェント＋集計ダッシュボードという構成が確定しているため、自然な選択肢は限定される。

A) **Bedrock + Lambda + API Gateway + DynamoDB + S3/CloudFront**（サーバーレス + AI/ML 中心）
B) **Bedrock + ECS/Fargate + RDS + ALB**（コンテナ＋リレーショナル DB）
C) **Bedrock AgentCore + Bedrock Agents** を中核に据える（マネージドエージェント志向）
D) **Strands Agents (OSS) + Lambda + DynamoDB**（コード中心、エージェント間通信を細かく制御）
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

### Question B-3: フロントエンド（Q8 相当）

サジェスチョン画面とミラー・ダッシュボードを実装する UI。

A) **Next.js (React + TypeScript) + Tailwind CSS** — モダン定番
B) **SvelteKit** — 軽量・高速で書ける量が少ない
C) **Vanilla HTML/CSS/JS** — 最小コスト、ハッカソン MVP に集中
D) **Streamlit / Gradio** — Python で爆速プロトタイピング、デモ向き
X) Other (please describe after [Answer]: tag below)

[Answer]: X
Reactで！コンポーネントを追加してくイメージ！みんなが慣れているから

---

### Question B-4: 音声 UI の実現手段

事前議論で「イヤホン経由の音声 UI」が中核機能として定義されている。これを MVP でどう実現するか。

A) **Web ブラウザの Web Speech API（TTS）+ Web Audio API** — Web アプリ内で完結
B) **Amazon Polly（TTS）で生成し、Web/Mobile で再生** — 高品質音声、AWS 完結
C) **iOS/Android ネイティブの読み上げ機能（実機に依存）**
D) **Alexa スキル / Google Home などスマートスピーカー連携**
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question B-5: チームスキル分布（Q9 相当）

メンバーの主スキルを把握しておくと、Workflow Planning でのタスク分担が現実的になる。

A) フロントエンド寄り中心（React/Vue 等）
B) バックエンド寄り中心（API/DB/サーバーレス）
C) インフラ・SRE 寄り中心（AWS/IaC/CI/CD）
D) AI/ML 寄り中心（モデル運用、LLM プロンプト設計）
E) **混成チーム**（複数領域がバランス良く揃っている）
X) Other (please describe after [Answer]: tag below — 例: "FE 2 名、BE 1 名、企画 1 名" など人数で詳述)

[Answer]: X
企画 1 名 FE 1名　BE 1名 AI/ML 1名

---

### Question B-6: リソース配分の方針（Q10 相当）

書類審査（5/10）が最初の関門で、評価軸の半分以上が「Intent の明確さ」「ドキュメント品質」「創造性」。

A) **ドキュメント・コンセプト重視** — 書類審査を確実に通すため、ドキュメント＆コンセプト整備に最大限投資（実装は予選フェーズで本格化）
B) **コード・デモ重視** — 動くものを早めに作って、ドキュメントはそこから生成
C) **バランス型** — Inception はドキュメント、Construction はコードに重点を置く
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

### Question B-7: コスト・期間制約（Q11 相当）

AWS 利用料・開発期間（〜6/26）に関する制約。

A) **AWS Free Tier / クレジット内に収める** — 個人負担最小
B) **少額の自己負担は許容**（〜数千円/月）
C) **会社/組織のクレジットを利用可能** — コスト制約は緩い
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

### Question B-8: データの永続性（プライバシー観点）

ユーザープロファイル（嗜好ベクトル、選択履歴、委譲履歴）はかなり機微なデータ。MVP 段階での扱いは？

A) **デモ用ダミーユーザーのみ**（実ユーザーデータなし、固定シナリオで動作）
B) **匿名化された一時ユーザー**（セッション単位で消える、永続化なし）
C) **AWS Cognito + DynamoDB で実ユーザーアカウント**（本格運用想定）
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

### Question B-9: セキュリティ拡張（Q12 相当）

このプロジェクトでセキュリティ拡張ルールを強制適用しますか？

A) **Yes — 全セキュリティルールをブロッキング制約として強制する**（本番運用想定のアプリケーション向けに推奨）
B) **No — 全セキュリティルールをスキップする**（PoC・プロトタイプ・実験的プロジェクト向け）
X) その他（下の `[Answer]:` タグの後に詳述してください）

[Answer]: B

---

### Question B-10: プロパティベーステスト拡張（Q13 相当）

このプロジェクトでプロパティベーステスト（PBT）ルールを強制適用しますか？

A) **Yes — 全 PBT ルールをブロッキング制約として強制する**（ビジネスロジック・データ変換・シリアライゼーション・状態を持つコンポーネントを含むプロジェクト向けに推奨）
B) **Partial — 純粋関数とシリアライゼーションのラウンドトリップのみ PBT ルールを強制する**（アルゴリズム的複雑さが限定的なプロジェクト向け）
C) **No — 全 PBT ルールをスキップする**（シンプルな CRUD アプリ・UI のみのプロジェクト・有意なビジネスロジックを持たない薄い統合層向け）
X) その他（下の `[Answer]:` タグの後に詳述してください）

[Answer]: A

---

### Question B-11: ハッカソン勝つための隠し玉

書類審査・予選で他チームと差別化するために、何かチームとして仕込みたいものはあるか？（任意項目、なければ A）

A) **特になし、ベース機能を磨き込む**
B) **デモ用の物語シナリオ（特定ペルソナの 24 時間）を凝る**
C) **「自己決定能力スコア」可視化のグラフィックを徹底的に凝る**
D) **発表時のパフォーマンス（実演芸風、自分達がダメになっていく寸劇など）**
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

**回答完了後、Claude に「Q&A 回答完了」とお伝えください。** 矛盾・曖昧さがなければ要件定義書 `requirements.md` の生成に進みます。
