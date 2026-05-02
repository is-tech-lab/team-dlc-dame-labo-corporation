# Components — 論理コンポーネント定義

**フェーズ**: INCEPTION - Application Design
**作成日**: 2026-05-02
**MVP 設計入力**: `application-design-plan.md` C-1〜C-8 確定回答 + Follow-up C-3a/C-8a
**前提**:
- 単一エージェント構成（C-1/C-2 = Z, moot 化）
- API スタイル: REST + WebSocket（C-3a 訂正後）
- フロント: SPA on S3+CloudFront（C-7 = A）
- 外部送信: コード内 const ホワイトリスト + DRY_RUN（C-8 = B + C-8a = C）

---

## 1. コンポーネント一覧

| # | コンポーネント名 | カテゴリ | 主たる責務 | MVP 採用技術 |
|---|---|---|---|---|
| 1 | **ダメ・ラボ Agent** | AI 中核 | 自我/シンギュラリティモード切替、提案生成、自律実行、context 推論 | Amazon Bedrock Agent (Claude) |
| 2 | **傀儡度** | 機能 Unit | 選択ログ集計、自己決定能力スコア算出、ダッシュボード描画 | Lambda + React component |
| 3 | **共通基盤** | 横断 | API Gateway, Lambda 共通レイヤ, DynamoDB データストア, EventBridge スケジューラ | API Gateway (REST + WebSocket), Lambda Layer, DynamoDB, EventBridge |
| 4 | **音声 UI** | 横断 | Polly TTS 音声合成、WebSocket push 配信、フロント再生 | Amazon Polly + API Gateway WebSocket |
| 5 | **フロントエンド SPA** | プレゼンテーション | ユーザー操作受付、画面描画、名前入力でセッション開始、音声再生 | Vite + React + React Router (S3 + CloudFront) |
| 6 | **外部メッセージング送信** | 統合 | **Slack のみ** への返信代行送信、ホワイトリスト + DRY_RUN 制御 | Lambda + Slack Web API |

> **MVP スコープ縮減（2026-05-02 user 指示）**: **認証基盤（Cognito）を MVP から撤廃**。決勝プレゼンでマルチユーザーをアピールしないため、単一デモユーザー（hardcoded `userId = "demo-user-001"` 等）+ 名前のローカルストレージ保持で代用。`TODO_construction.md` で park、マルチユーザー対応時に復帰。

---

## 2. 各コンポーネント詳細

### 2.1 ダメ・ラボ Agent

**Purpose**: 単一の AI エージェントとして、ユーザーの観察データから context を推論し、mode に応じた振る舞いを切り替える。MVP の AI 中核。

> **設計上の意図（傀儡化方針）**
>
> > **「自我のあるうちは決めねばならぬ。3 回で自我は溶け、シンギュラリティに至る。」**
>
> 自我モードは "通過点"、シンギュラリティモードが "到達点"。ユーザーが自我モードで能動的に介入する機会は最小限に留め（提案 + 自由記載 + 委譲ボタン）、`SELF_DECISION_LIMIT = 3` 到達で速やかにシンギュラリティへ遷移させる。"決めない快楽" を最短距離で体験させる設計。
>
> このタグラインは Bedrock Agent のシステムプロンプト引用候補（Functional Design 段階で正式化）。

**Responsibilities**:
- **自我モード**: 入力（ユーザーの状況メッセージ）から 4 つの提案 + 自由記載枠を生成し、フロントに返却
- **シンギュラリティモード**: 受信代行 / 自発代行 を Bedrock の自律判断で実行し、Polly 音声報告を生成
- ユーザーの選択ログを DynamoDB に書込（自我モード時）
- カテゴリ単位で mode 状態を管理（自我 / シンギュラリティ）
- Mode 遷移トリガー判定:
  - (a) 完全委譲ボタン押下イベントを受信
  - (b) `SELF_DECISION_LIMIT = 3` に基づく自動 graduate（自分で決める or 自由記載が連続 3 回）
- シンギュラリティモードで外部メッセージング送信コンポーネントを呼び出し

**Interfaces**:
- 入力: REST API 経由のユーザーメッセージ / カテゴリ ID / 選択イベント、EventBridge 経由の自律実行トリガー
- 出力: 提案リスト（自我）、音声報告テキスト + Polly 音声 URL（シンギュラリティ）、選択ログ書込
- 依存: 共通基盤（DynamoDB 永続化、API Gateway）、音声 UI（Polly 呼出）、外部メッセージング送信

**境界外（含めない）**:
- マルチエージェント協調（C-1 = Z で moot 化、将来 Profile Agent 復活時に再分割検討）
- 嗜好学習（MVP では hardcoded 代替、Profile Agent 復活時に対応）

---

### 2.2 傀儡度

**Purpose**: ユーザーの委譲履歴と自己決定能力低下を可視化し、「ダメになっていく」体験を提示する。

**Responsibilities**:
- 選択ログ集計（カテゴリ別 / 期間別 / 自己決定 vs AI 委譲比率）
- 自己決定能力スコアの時系列算出（時間経過とともに減衰、委譲率上昇で加速）
- シンギュラリティモード到達カテゴリ数のカウント（傀儡化が完了したカテゴリ）
- ダッシュボード描画（フロント側 React component）

**Interfaces**:
- 入力: REST API（ユーザー ID, 期間レンジ）、DynamoDB 直クエリ
- 出力: 集計結果 JSON（フロントの React component が受け取り SVG / Chart 描画）
- 集計タイミング: **オンデマンド**（C-6 = A、画面表示時に DynamoDB 直クエリ）

**境界外**:
- バッチ集計テーブル（C-6 で却下、将来データ量増加時に再評価）
- リアルタイムストリーム集計（同上）

---

### 2.3 共通基盤

**Purpose**: 全コンポーネントが共有するインフラレイヤ。API ルーティング、永続化、スケジューリングを提供。

**Responsibilities**:
- **API Gateway REST**: フロントからの同期 API ルーティング（MVP は認証なし、user_id は body / header のクエリパラメータで受け取る）
- **API Gateway WebSocket**: 音声通知 push 用の永続接続管理（C-3a / C-5 で確定）
- **Lambda 共通レイヤ**: ロギング、エラーハンドリング、user_id 解決等の共通処理
- **DynamoDB**: ユーザー / カテゴリ状態 / 選択ログ / 自律実行報告の永続化
- **EventBridge**: シンギュラリティモード自律実行 cron + デモボタンからの即時イベント（C-4 = C 併用）

**主要 DynamoDB テーブル（高レベル、詳細は Functional Design で）**:
- `Users`: ユーザープロファイル（PK: userId）
- `CategoryStates`: ユーザー × カテゴリの mode 状態 + 自己決定カウンタ（PK: userId, SK: categoryId）
- `ChoiceLogs`: 選択ログ（PK: userId, SK: timestamp#categoryId）
- `SingularityReports`: 自律実行報告（PK: userId, SK: timestamp#categoryId）

**Interfaces**:
- フロント / 全 Lambda が依存する横断レイヤ
- WebSocket 接続情報も DynamoDB に保持（接続 ID → userId マッピング）

---

### 2.4 音声 UI

**Purpose**: AI の自律実行報告を「相棒の声」としてユーザーに届ける。

**Responsibilities**:
- Polly による TTS 合成（pitch 0.85, rate 0.95 で低めの相棒声 — Discovery Mock の知見継承）
- 合成済み音声 URL を WebSocket 経由でフロントに push（C-5 = A）
- フロント側の音声再生プレイヤー（React component）

**Interfaces**:
- 入力: ダメ・ラボ Agent からの報告テキスト、ユーザー ID
- 出力: WebSocket メッセージ（音声 URL + 報告テキスト）→ フロントが受信して再生
- 依存: 共通基盤（WebSocket、DynamoDB 接続情報）

---

### 2.5 フロントエンド SPA

**Purpose**: ユーザー対面の Web アプリケーション。

**Responsibilities**:
- 画面描画（オンボーディング = 名前入力、カテゴリ選択、サジェスチョン、傀儡度、シンギュラリティモード画面）
- 名前入力 → ローカルストレージ保持で簡易セッション開始（MVP 認証なし）
- REST API 呼出（提案取得、選択イベント送信、傀儡度集計取得）
- WebSocket 接続管理（シンギュラリティ突入時に接続、報告受信時に再生）
- 音声プレイヤー（Web Audio API or HTMLAudioElement）
- リューク的相棒トーンの UI 文言（Discovery Mock の `tonePhrases.ts` を移植）

**Interfaces**:
- ホスティング: S3 + CloudFront（C-7 = A）
- 通信: REST（同期）、WebSocket（音声 push）

**境界外**:
- SSR / SSG（C-7 で却下）
- ネイティブモバイルアプリ（MVP では PWA 対応も含めず）

---

### 2.6 外部メッセージング送信

**Purpose**: シンギュラリティモードでユーザーに代わって **Slack** に返信代行を実送信する。**ハッカソン MVP の最重要安全境界**。

> **MVP スコープ縮減（2026-05-02 user 指示）**: 当初は Slack / LINE / メール (SES) の 3 チャネルを想定していたが、MVP では **Slack 1 チャネルのみ** に絞る。LINE / SES は当面取り扱わず、必要になった時点で park から復帰させる。理由:
> - LINE Messaging API は bot アカウント申請、SES は domain verification 等の事前手続きが必要で 5/10 締切リスク
> - C-8a の const ホワイトリストも 1 種類だけで済み Construction の Functional Design がシンプル化
> - デモシナリオ（専用 Slack workspace）と完全整合

**Responsibilities**:
- Slack: 専用 workspace の指定 channel に投稿（Slack Web API `chat.postMessage`）
- **ホワイトリスト検証**: コード内 const に許可済み workspace ID / channel ID を hardcode し、起動時 + 送信前に検証（C-8a = C）
- **DRY_RUN モード**: 環境変数 `DRY_RUN=true` 時は送信処理を完全スキップしログのみ出力（ローカル開発時のデフォルト）

**Interfaces**:
- 入力: ダメ・ラボ Agent からの送信指示（送信先 channel, 本文, カテゴリ ID）
- 出力: 送信成功 / 失敗 / DRY_RUN スキップ のステータスを Agent に返却、ログを DynamoDB に記録
- 依存: 共通基盤（DynamoDB ログ）、Slack Web API SDK

**安全境界（重要）**:
```typescript
// application code 内に hardcode（PR レビューで誤設定検出）
const ALLOWED_SLACK_WORKSPACE_ID = "T0XXXXXXXXX";  // デモ用専用 workspace
const ALLOWED_SLACK_CHANNELS = ["C0XXXXX", "C0YYYYY"];
// 上記以外への送信要求は throw でハードフェイル
```

**park 項目（`TODO_construction.md` で park）**: LINE Messaging API / SES（メール）の追加は予選/決勝で必要になったタイミングで再評価。

---

## 3. コンポーネント間の関係（高レベル）

```
                         [フロントエンド SPA] (C-7=A, S3+CloudFront)
                              ↑↓ REST           ↑↓ WebSocket
              ┌───────────[共通基盤: API Gateway]───────────┐
              ↓                  ↓                            ↓
              ↓        [ダメ・ラボ Agent]              [傀儡度]
              ↓             ↓     ↓                            ↓
              ↓             ↓     ↓                            ↓
                       [音声 UI] [外部メッセージング送信]   [DynamoDB]
                       (Polly)   (Slack only)                 (集計)
                             ↑                                  ↑
                         [EventBridge cron]               [選択ログ]
                         (シンギュラリティ トリガ)                (実行報告)
```

詳細は `component-dependency.md` 参照。

---

## 4. PBT-01 適用範囲（Application Design 段階での flag）

PBT-01「Property Identification During Design」は **Construction の Functional Design** ステージで実施されるルール。本ステージでは「どのコンポーネントが PBT 分析対象になるか」を flag するに留める。

| コンポーネント | PBT 分析対象 | 想定プロパティカテゴリ |
|---|---|---|
| ダメ・ラボ Agent | ✅ 対象 | Invariant（提案数=4）、Idempotence（同じ context で同じ提案）、Oracle（hardcoded 期待値との照合） |
| 傀儡度 | ✅ 対象 | Invariant（集計の合計が選択ログ数と一致）、Round-trip（書込→読出で値保存） |
| 共通基盤 | ✅ 対象（DynamoDB アクセス層） | Round-trip（保存→取得 = 入力）、Invariant（PK/SK 一意性） |
| 音声 UI | ⚠️ 限定（Polly 自体は外部） | Invariant（音声 URL 形式） |
| フロントエンド SPA | ❌ 対象外 | UI ロジックは traditional テストで十分 |
| 外部メッセージング送信 | ✅ 対象（**最重要**） | Invariant（送信先 ⊆ ホワイトリスト常時成立）、Idempotence（DRY_RUN 時は副作用なし） |

各 Unit の Functional Design ステージで詳細化。

---

## 5. 境界の明示（MVP では含めない）

以下は将来実装の余地として明示的に MVP 対象外:
- マルチエージェント協調（Profile Agent 復活時に検討、`TODO_construction.md` で park 中）
- 嗜好学習（hardcoded 代替で MVP 対応）
- 非同期バッチ集計（C-6 = A で却下）
- 認証基盤（Cognito、ソーシャルログイン、MFA、JWT 検証）— 2026-05-02 撤廃、`TODO_construction.md` で park
- ネイティブモバイル
- Phase 1〜3 の段階的 UX（Discovery Mock リファクタで撤廃済、自我 / シンギュラリティ の 2 モード + 3 回 auto-graduate に統一、`requirements.md` Appendix B.2 参照）
