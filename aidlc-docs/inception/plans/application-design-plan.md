# Application Design Plan

**作成日**: 2026-04-29
**フェーズ**: INCEPTION - Application Design
**前提資料**:
- `aidlc-docs/inception/requirements/team-pre-discussion.md`
- `aidlc-docs/inception/requirements/requirements.md`
- `aidlc-docs/inception/user-stories/personas.md`
- `aidlc-docs/inception/user-stories/stories.md`
- `aidlc-docs/inception/plans/execution-plan.md`

このプランは Application Design の Plan + 質問。チームの回答を得てから、実際の設計成果物（`components.md`, `component-methods.md`, `services.md`, `component-dependency.md`, `application-design.md`）を生成する。

---

## 0. 既に確定している論理コンポーネント（事前議論より）

> **MVP 設計更新（2026-05-02 Discovery レビュー後の chat 議論）**:
> 当初の事前議論では AI エージェント 3 個構成だったが、Discovery Mock の HIL リファクタを経て、**MVP では単一エージェントに統合** する方針に変更。
> - Profile Agent: MVP では除外（嗜好学習は hardcoded 代替）
> - サジェスチョン Agent + 委譲＆実行 Agent: **1 つの Agent に統合**（mode に応じて Active = 4 提案生成 / Autonomous = 自律実行 + Polly 報告 を切り替え）
>
> **MVP では AI エージェント 1 個** とし、本セクションおよび後続の Question C-1/C-2 はこの前提で読み替える。当初の 3 エージェント分割は将来構想として `aidlc-docs/construction/TODO_construction.md` で park。

**AI エージェント（MVP: 1 個に統合）**
- ダメ・ラボ Agent（仮称、単一）: 観察データから context 推論、mode に応じて以下を切替
  - Active モード: 4 提案 + 自由記載をフロントへ返却、選択ログ DynamoDB 書込
  - Autonomous モード: 受信代行 / 自発代行 を Bedrock 自律判断、Polly 音声報告生成
- **Mode 遷移トリガー**: (a) ユーザーの完全委譲ボタン押下、または (b) **`SELF_DECISION_LIMIT = 3` トレーニング上限到達による auto-graduate** のいずれかで Active → Autonomous へ遷移。詳細は `requirements.md` Appendix B.5、`stories.md` Appendix B.3 Story X.1 参照。

**当初の 3 エージェント分割（将来構想として park）**
- サジェスチョン・エージェント: ユーザー対話、選択肢生成、選択理由抽出
- プロファイル・エージェント: 嗜好抽出、フェーズ移行判定
- 委譲＆実行エージェント: 委譲アクション処理、Phase 4 自律実行、音声報告

**機能 Unit（1 個、非 AI）**
- ミラー・ビュー: ログ集計＋ダッシュボード描画

**横断要素**
- 認証基盤（Cognito）
- 共通基盤（API Gateway、Lambda 共通レイヤー、DynamoDB）
- 音声 UI（Polly 統合）
- フロントエンド（React）

これらの **境界・公開メソッド・連結方式** を本ステージで確定する。

---

## 1. エージェント連結モデル

> **MVP では moot 化（2026-05-02 更新）**: §0 の通り単一エージェントに統合したため、「マルチエージェント連結」は本 MVP では発生しない。
> 本 §1 と §2 はオリジナルのまま保持（将来 Profile Agent / 専門 Agent を再導入する時の判断材料として残す）。

### 計画ステップ
- [ ] Bedrock AgentCore + Bedrock Agents のどのパターンで 3 エージェントを連結するかを決定
- [ ] エージェント間呼び出しの責務をどこに置くか（オーケストレーター？フロントから順次？）
- [ ] Decision を `services.md` のサービス層に反映

### Question C-1: マルチエージェント連結パターン

A) **Supervisor パターン**: 1 つの Supervisor Bedrock Agent が他 2 つの Bedrock Agent をツール（Function Calling）として呼ぶ。**Bedrock のマルチエージェント機能を最大活用**
B) **オーケストレーター Lambda パターン**: フロントは単一 API を叩き、オーケストレーター Lambda が用途に応じて Bedrock Agent を順次呼び出す。**制御性が高い**
C) **フロント駆動・直接呼び出しパターン**: フロントから 3 つのエージェント API を順次叩く。**実装が単純**
D) **イベント駆動パターン**: 各 Agent が EventBridge イベントを介して連動。**疎結合・拡張性が高いが MVP には過剰**
Z) **MVP では適用外**（単一エージェント構成のため moot）
X) その他（下の `[Answer]:` タグの後に詳述してください）

[Answer]: Z

---

## 2. エージェント間データ受け渡し

> **MVP では moot 化（2026-05-02 更新）**: 単一エージェント前提のため「エージェント間」のデータ受け渡しは存在しない。Agent と DynamoDB の関係のみが残る（A 案の DynamoDB 共有を Agent 自身の永続化先として採用、で十分）。

### 計画ステップ
- [ ] エージェント間で受け渡されるデータの形態を決定（共有 DB / 直接渡し / イベント）
- [ ] プロファイル・エージェントの更新結果をどうサジェスチョン・エージェントに渡すか
- [ ] 選択ログの記録タイミングと書き込み主体を決定

### Question C-2: エージェント間データ受け渡し方式

A) **DynamoDB を共有ストアとして使う**: 各 Agent が必要な時に DynamoDB を読み書きし、状態は永続化レイヤーで一元管理
B) **API レスポンスとして直接受け渡す**: Supervisor or オーケストレーターが Agent A の結果を Agent B の入力に注入する
C) **両方併用**: 永続データは DynamoDB、リアルタイムなコンテキスト共有は API レスポンス経由
Z) **MVP では適用外**（単一エージェントが直接 DynamoDB を読み書きするため、エージェント間受け渡しは発生しない）
X) その他（下の `[Answer]:` タグの後に詳述してください）

[Answer]: Z

---

## 3. API スタイル

### 計画ステップ
- [ ] フロントエンド ↔ バックエンド API のスタイルを決定
- [ ] エンドポイント数の見積もり

### Question C-3: API スタイル

A) **REST API（API Gateway REST API + Lambda）** — 王道、AWS との相性も最高
B) **GraphQL（AppSync）** — 単一エンドポイントで柔軟、ミラー・ビューの集計クエリと相性良
C) **REST + WebSocket（API Gateway WebSocket）** — 音声通知などのプッシュに WebSocket を併用
D) **gRPC / tRPC** — 型安全だが MVP には過剰
X) その他（下の `[Answer]:` タグの後に詳述してください）

[Answer]: 

---

## 4. Phase 4 自律実行のトリガー

### 計画ステップ
- [ ] Phase 4 で AI が自律的に動くタイミング・きっかけを決定
- [ ] デモシナリオで自律実行を見せる方法を決定

### Question C-4: Phase 4 自律実行トリガー

A) **EventBridge スケジュール（cron）**: 例として 30 分おきに Lambda を発火し、Phase 4 カテゴリの自律実行をチェック。**実用的だがデモには時間調整が必要**
B) **デモ用「実行をシミュレート」ボタン**: MVP/予選デモでは手動ボタンで自律実行を即座に発動。**デモ向き、後でスケジュール化**
C) **A + B 併用**: 本番は EventBridge、デモ時はボタンも併存させる
D) **Webhook/外部イベント駆動**: 外部から「未読が増えた」「招待が来た」等の擬似イベントを受け取って発動
X) その他（下の `[Answer]:` タグの後に詳述してください）

[Answer]: 

---

## 5. 音声通知のデリバリ方式

### 計画ステップ
- [ ] Phase 4 の音声報告をユーザーのイヤホンまで届ける経路を決定
- [ ] 音声合成と再生の責務分担を決定

### Question C-5: 音声通知デリバリ

A) **WebSocket push**: API Gateway WebSocket でブラウザにイベント push、フロントで Polly 音声を取得・再生
B) **長時間ポーリング**: フロントが定期的にバックエンドに「報告ある？」と問い合わせ、あれば再生
C) **PWA Push Notification**: Service Worker でバックグラウンド通知 → フォアグラウンドで音声再生
D) **デモ用「報告再生」ボタンで即時再生**: バックエンドで音声を生成済みにし、ユーザーがボタンを押した瞬間に再生（MVP 簡易化）
E) **A + D 併用**: 本番想定は WebSocket、デモ時は手動ボタンも併存
X) その他（下の `[Answer]:` タグの後に詳述してください）

[Answer]: 

---

## 6. ミラー・ビュー集計の更新タイミング

### 計画ステップ
- [ ] ダッシュボードの数値・グラフをいつ集計するか決定
- [ ] 大規模データでの将来拡張性も考慮

### Question C-6: ミラー集計更新方式

A) **オンデマンド集計**: ユーザーがミラー画面を開いた時に DynamoDB を直接クエリして集計
B) **スケジュール集計**: EventBridge で 1 日 1 回など定期的に集計、結果テーブルに保存。ミラー画面はそれを表示
C) **イベント駆動の増分更新**: 選択ログ書き込み時に集計値も同時更新（ストリーム / Lambda）
X) その他（下の `[Answer]:` タグの後に詳述してください）

[Answer]: 

---

## 7. フロントエンドのアーキテクチャ

### 計画ステップ
- [ ] React アプリのレンダリング戦略を決定
- [ ] ホスティング方式と SEO 要否

### Question C-7: フロントエンドのアーキテクチャ

A) **SPA（Single Page App）**: Vite + React + React Router、S3 + CloudFront でホスト。**最も軽量・MVP 向き**
B) **SSR（Next.js App Router）**: SEO・初回レンダリング高速、Vercel or Amplify Hosting
C) **静的サイト生成（Astro / Next.js Static Export）**: 一部静的に書き出し、API 呼び出し部分のみ動的
X) その他（下の `[Answer]:` タグの後に詳述してください）

[Answer]: 

---

## 8. 外部メッセージング送信のモック境界

### 計画ステップ
- [ ] LINE / Slack / メール 送信の MVP 上のモック境界を決定
- [ ] デモシナリオの安全性・再現性を担保

### Question C-8: 外部メッセージング送信の扱い

A) **完全モック**: 全ての外部メッセージング（LINE、Slack、メール）は送信せず、デモ画面上で「送信した体」を演出。Polly 音声で「送っといたよ」とだけ報告
B) **限定的な実送信**: チーム内アカウント（チームメンバーの Slack ワークスペース、ダミー LINE アカウント）にのみ実送信
C) **送信モック + 送信ログをミラーに表示**: 送信は行わないが、ミラーに「○月○日 何時何分に〜への返信を送った（モック）」と詳細表示
X) その他（下の `[Answer]:` タグの後に詳述してください）

[Answer]: 

---

## 9. 必須成果物（ALWAYS GENERATE）

チーム回答後、以下を生成する:

- [ ] `aidlc-docs/inception/application-design/components.md` — コンポーネント定義と高レベル責務
- [ ] `aidlc-docs/inception/application-design/component-methods.md` — メソッドシグネチャ（詳細ビジネスルールは Construction フェーズの Functional Design で）
- [ ] `aidlc-docs/inception/application-design/services.md` — サービス定義とオーケストレーションパターン
- [ ] `aidlc-docs/inception/application-design/component-dependency.md` — 依存関係マトリクスと通信パターン、データフロー図
- [ ] `aidlc-docs/inception/application-design/application-design.md` — 上記 4 ファイルを統合した俯瞰ドキュメント
- [ ] 設計の整合性・完全性を検証

---

**回答完了後、Claude に「アプリ設計プラン回答完了」とお伝えください。** 矛盾・曖昧さがあればフォローアップ質問を、なければ Application Design 成果物の生成に進みます。
