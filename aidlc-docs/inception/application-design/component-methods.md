# Component Methods — メソッドシグネチャ

**フェーズ**: INCEPTION - Application Design
**作成日**: 2026-05-02
**対応**: `components.md` の各コンポーネント

> **Note**: 本ドキュメントはメソッドの **シグネチャと高レベル目的** のみを定義する。
> 詳細なビジネスルール / バリデーション / エッジケースは Construction フェーズの **Functional Design (per-unit)** で定義する。
> 言語表記は TypeScript ライクな擬似コード（実装言語は Construction の NFR Requirements で確定）。

---

## 1. ダメ・ラボ Agent

### 1.1 自我モード API

```typescript
generateSuggestions(
  userId: string,
  categoryId: string,
  contextMessage: string
): Promise<{
  proposals: Array<{ id: string; text: string; reasoning?: string }>;  // 常に 4 件
  freeFormPrompt: string;  // 自由記載枠の placeholder
  modeState: "ego" | "singularity";  // 遷移後は singularity を返す
}>
```
**目的**: ユーザーの状況メッセージから 4 提案を生成。自我モード時のみ呼出可。

```typescript
recordChoice(
  userId: string,
  categoryId: string,
  choice: { type: "proposal"; proposalId: string }
        | { type: "self"; freeText: string }
        | { type: "delegate" }
): Promise<{
  modeState: "ego" | "singularity";
  selfDecisionCount: number;  // 0〜3、3 到達時に singularity 遷移
  graduated: boolean;          // この呼出で auto-graduate したか
}>
```
**目的**: 選択ログ書込 + mode 遷移判定（SELF_DECISION_LIMIT = 3）。

### 1.2 シンギュラリティモード API

```typescript
runSingularityAction(
  userId: string,
  categoryId: string,
  trigger: "schedule" | "demo_button" | "incoming_event"
): Promise<{
  reportText: string;          // 「やっといたよ」報告本文
  audioUrl: string;            // Polly 合成済 S3 URL
  externalActions: Array<{ destination: string; status: "sent" | "dry_run" }>;
}>
```
**目的**: 自律判断 → 外部送信 → 音声報告生成 を一連で実行。EventBridge / デモボタンから呼出。

### 1.3 完全委譲

```typescript
delegateCompletely(userId: string, categoryId: string): Promise<{ modeState: "singularity" }>
```
**目的**: ユーザー操作で即時 シンギュラリティ遷移。

---

## 2. 傀儡度

```typescript
getPuppetLevelSummary(
  userId: string,
  range: { from: Date; to: Date }
): Promise<{
  selfDecisionScore: { value: number; trend: number[] };  // 時系列配列
  delegationByCategory: Array<{ categoryId: string; selfCount: number; agentCount: number }>;
  phase4ReachedCategories: string[];
  totalChoices: number;
}>
```
**目的**: 傀儡度画面表示時にオンデマンド集計（C-6 = A）。DynamoDB を直クエリ。

```typescript
getCategoryDetail(
  userId: string,
  categoryId: string
): Promise<{
  modeState: "ego" | "singularity";
  selfDecisionCount: number;
  recentChoices: ChoiceLog[];
  recentReports: SingularityReport[];
}>
```
**目的**: カテゴリ単位の詳細表示。

---

## 3. 認証基盤

```typescript
// Cognito SDK のラッパとして提供（薄い）
signUp(email: string, password: string): Promise<{ userId: string }>
signIn(email: string, password: string): Promise<{ idToken: string; userId: string }>
signOut(idToken: string): Promise<void>
verifyToken(idToken: string): Promise<{ userId: string; expiresAt: Date }>
```
**目的**: Cognito User Pool 操作の共通化。詳細フローは Cognito SDK のドキュメントに従う。

---

## 4. 共通基盤

### 4.1 DynamoDB アクセス層（責務分離のための薄いリポジトリ）

```typescript
UsersRepo {
  put(user: User): Promise<void>
  getById(userId: string): Promise<User | null>
}

CategoryStatesRepo {
  get(userId: string, categoryId: string): Promise<CategoryState>
  upsert(state: CategoryState): Promise<void>
  incrementSelfDecisionCount(userId: string, categoryId: string): Promise<number>
  setMode(userId: string, categoryId: string, mode: "ego" | "singularity"): Promise<void>
}

ChoiceLogsRepo {
  append(log: ChoiceLog): Promise<void>
  queryByUser(userId: string, range: { from: Date; to: Date }): Promise<ChoiceLog[]>
  queryByUserCategory(userId: string, categoryId: string, limit: number): Promise<ChoiceLog[]>
}

SingularityReportsRepo {
  append(report: SingularityReport): Promise<void>
  queryByUser(userId: string, range: { from: Date; to: Date }): Promise<SingularityReport[]>
}

WebSocketConnectionsRepo {
  register(connectionId: string, userId: string): Promise<void>
  unregister(connectionId: string): Promise<void>
  findByUser(userId: string): Promise<string[]>  // 1 ユーザー複数接続を許容
}
```

### 4.2 EventBridge スケジューラ

```typescript
scheduleSingularitySweep(): void  // CDK / IaC で定義する cron ルール (例: rate(30 minutes))
emitDemoTrigger(userId: string, categoryId: string): Promise<void>  // デモボタンからの即時イベント
```
**目的**: 本番は cron、デモ時はボタンから直接 EventBridge イベント発火（C-4 = C 併用）。

---

## 5. 音声 UI

```typescript
synthesizeReport(
  reportText: string,
  voiceProfile: { pitch: number; rate: number }  // デフォルト: { 0.85, 0.95 }
): Promise<{ audioUrl: string; durationMs: number }>
```
**目的**: Polly TTS 合成 → S3 保存 → presigned URL 返却。

```typescript
pushToUser(
  userId: string,
  payload: { reportText: string; audioUrl: string; categoryId: string }
): Promise<{ delivered: number; failed: number }>
```
**目的**: 該当ユーザーの全 WebSocket 接続にメッセージ push。

---

## 6. フロントエンド SPA

### 6.1 主要画面の Props / State インターフェース（高レベル）

```typescript
// React Component の入出力契約のみ。詳細実装は Construction で。
<OnboardingScreen onComplete={(name: string) => void} />
<CategorySelectScreen userId, onSelect={(categoryId) => void} />
<SuggestionScreen userId, categoryId, onChoice, onDelegate, onFreeText />
<SingularityScreen userId, categoryId, onReceiveReport={(audioUrl, text) => void} />
<PuppetLevelScreen userId, range />
```

### 6.2 通信レイヤ

```typescript
class ApiClient {
  // REST
  generateSuggestions(...): Promise<...>
  recordChoice(...): Promise<...>
  delegateCompletely(...): Promise<...>
  getPuppetLevelSummary(...): Promise<...>

  // WebSocket
  connectVoiceChannel(userId: string): WebSocketConnection
  // 接続後、message イベントで {audioUrl, reportText} を受信
}
```

---

## 7. 外部メッセージング送信

> **MVP スコープ**: Slack のみ（LINE / SES は park）。

```typescript
sendSlackMessage(
  request: {
    workspaceId: string;        // 検証用、ALLOWED_SLACK_WORKSPACE_ID と一致必須
    channelId: string;          // ALLOWED_SLACK_CHANNELS に含まれること
    body: string;
    metadata: { userId: string; categoryId: string };
  }
): Promise<{
  status: "sent" | "dry_run" | "rejected";
  reason?: "not_in_whitelist" | "external_api_error" | "dry_run_skip";
  slackMessageTs?: string;      // Slack の ts (タイムスタンプ ID)
}>
```

**重要な内部ロジック（high-level、詳細は Functional Design）**:
1. `process.env.DRY_RUN === "true"` ならログのみ出力し `status: "dry_run"` を返却
2. ホワイトリスト const に `workspaceId` / `channelId` が含まれるか検証 → 含まれなければ `status: "rejected", reason: "not_in_whitelist"` で hard fail
3. 含まれる場合、Slack Web API `chat.postMessage` で送信
4. 結果を `ExternalMessageLogs` テーブル（または `ChoiceLogs` に集約）に記録

```typescript
// ホワイトリスト定数（hardcode、PR レビューで監視）
const ALLOWED_SLACK_WORKSPACE_ID: string;
const ALLOWED_SLACK_CHANNELS: readonly string[];
```

---

## 8. メソッド一覧サマリ表

| Component | Public Methods 数（高レベル） |
|---|---|
| ダメ・ラボ Agent | 4 (generateSuggestions, recordChoice, runSingularityAction, delegateCompletely) |
| 傀儡度 | 2 (getPuppetLevelSummary, getCategoryDetail) |
| 認証基盤 | 4 (signUp, signIn, signOut, verifyToken) |
| 共通基盤 - Repo 群 | ~14 (Repo 5 種 × 2-4 メソッド) |
| 共通基盤 - EventBridge | 2 (scheduleSingularitySweep, emitDemoTrigger) |
| 音声 UI | 2 (synthesizeReport, pushToUser) |
| フロントエンド | 5 画面コンポーネント + 1 ApiClient |
| 外部メッセージング送信 | 1 (sendSlackMessage) |

> **Construction 注**: 詳細なバリデーションルール、エラーケース、retry / timeout 戦略、入力境界条件は **Functional Design (per-unit)** で確定する。本ドキュメントはあくまで境界の高レベル定義。
