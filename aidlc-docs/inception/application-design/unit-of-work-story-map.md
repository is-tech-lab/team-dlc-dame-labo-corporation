# Story → Unit マッピング — 書類審査用正規版

> **🜂 設計コアタグライン**
>
> **「自我のあるうちは決めねばならぬ。3 回で自我は溶け、シンギュラリティに至る。」**

**フェーズ**: INCEPTION - Units Generation（PART 2: Generation）
**作成日**: 2026-05-02
**位置付け**: **MVP 実装計画書**（書類審査用の正規版）

> **重要**: 本ドキュメントは `stories.md`（事前議論時点のスナップショット）と独立した実装計画書である。
> - `stories.md`: チーム合作の議論経緯（本文不変、Appendix B のみ追記可）
> - 本ファイル: Appendix B 反映後の **MVP 実装版 Story → Unit マッピング**（書類審査・Construction の正）
>
> 2 つは役割が異なる: 議論経緯 vs 実装計画書。

---

## 1. MVP 実装対象 Story 一覧（最終確定版）

**合計 16 Story を MVP で実装**（事前議論 23 Story から Phase 撤廃 + 認証撤廃 + 集約 + 削除 + 新規昇格 = 16 になった）。

### 1.1 Epic 1: オンボーディング & 初回体験（3 Story）

| # | Story 名 | 主担当 Unit | 関連 Unit | MoSCoW | 改訂状態 |
|---|---|---|---|---|---|
| **1.1** | 名前入力でセッション開始 | F | — | M | **🔄 簡易化**（認証撤廃により Cognito 登録 → 名前入力でローカル保持） |
| **1.2** | 最初のカテゴリ選択 | F | A | M | そのまま実装 |
| **1.3** | 初回サジェスチョン受領 | F + B | A | M | そのまま実装（自我モードの 4 提案を初回表示） |

### 1.2 Epic 2: 連絡カテゴリの委譲ジャーニー（1 Story、Phase 撤廃で大幅集約）

| # | Story 名 | 主担当 Unit | 関連 Unit | MoSCoW | 改訂状態 |
|---|---|---|---|---|---|
| 2.1〜2.3 | Phase 1〜3 連絡 | — | — | — | **❌ 集約**（Phase 撤廃に伴い X.1〜X.4 の自我モード提案として表現） |
| **2.4** | 「やっといたよ」音声報告（連絡） | B + D + E | F + A | M | そのまま実装、Slack 送信込み |
| 2.5 | 連絡カテゴリのフェーズ自動昇格 | — | — | — | **❌ 削除**（Phase 撤廃、X.1 auto-graduate に置換） |
| 2.6 | 委ねるボタンでフェーズ手動昇格 | — | — | — | **❌ 削除**（Phase 撤廃、完全委譲ボタンのみ） |

### 1.3 Epic 3: 買い物カテゴリの委譲ジャーニー（1 Story、人間関係 → 買い物へ置換）

> **カテゴリ置換**: Appendix B.1 で MVP は「人間関係」→「買い物」に変更済（家族写真の問題 + 倫理的影響を回避するため）。

| # | Story 名 | 主担当 Unit | 関連 Unit | MoSCoW | 改訂状態 |
|---|---|---|---|---|---|
| 3.1〜3.3 | Phase 1〜3 人間関係 | — | — | — | **❌ 集約**（Phase 撤廃 + カテゴリ置換、X.1〜X.4 で表現） |
| **3.4** | 「やっといたよ」音声報告（買い物） | B + D | F + A | M | **🔄 改訂実装**（カテゴリを人間関係 → 買い物に置換。買い物タスクは Slack 送信不要、音声報告のみ。実 EC 注文は MVP 範囲外で park） |
| 3.5 | 人間関係カテゴリの自動昇格 | — | — | — | **❌ 削除**（Phase 撤廃 + カテゴリ置換） |
| 3.6 | 委ねるボタンで人間関係手動昇格 | — | — | — | **❌ 削除**（同上） |

### 1.4 Epic 4: 委譲アクション（2 Story）

| # | Story 名 | 主担当 Unit | 関連 Unit | MoSCoW | 改訂状態 |
|---|---|---|---|---|---|
| **4.1** | 単発委譲（1 回だけ AI に任せる） | B + F | A | M | そのまま実装 |
| 4.2 | フェーズ昇格（手動） | — | — | — | **❌ 削除**（Phase 撤廃、auto-graduate のみ） |
| **4.3** | 完全委譲のドラマ（即時シンギュラリティ遷移） | B + F + D | A + E | M | **🔄 改訂実装**（Phase 4 ジャンプ → 即時シンギュラリティ遷移、音声報告即時発火） |

### 1.5 Epic 5: 傀儡度（堕落可視化、5 Story）

> **コンポーネント名変更**: 旧「ミラー・ビュー」→「傀儡度（PuppetLevel）」（2026-05-02 命名統一）。

| # | Story 名 | 主担当 Unit | 関連 Unit | MoSCoW | 改訂状態 |
|---|---|---|---|---|---|
| **5.1** | カテゴリごとの現在モード（自我 / シンギュラリティ） | C + F | A | M | **🔄 改訂実装**（「現在フェーズ」→「現在モード」） |
| **5.2** | 自己決定 vs AI 委譲推移 | C + F | A | M | そのまま実装 |
| **5.3** | 委譲履歴 | C + F | A | M | そのまま実装 |
| **5.4** | 最後に自分で選んだ日 | C + F | A | M | そのまま実装 |
| **5.5** | 自己決定能力スコア時系列 | C + F | A | M | そのまま実装（傀儡度の核心可視化） |

### 1.6 Epic X: 新規昇格 Story（4 Story、Appendix B.3 から正式昇格）

| # | Story 名 | 主担当 Unit | 関連 Unit | MoSCoW | 改訂状態 |
|---|---|---|---|---|---|
| **X.1** | 3 回トレーニング後 auto-graduate | B | A | M | **✨ 新規昇格**（SELF_DECISION_LIMIT = 3 ロジック、自我 → シンギュラリティ自動遷移） |
| **X.2** | 単発委譲時の AI 選択結果表示 | B + F | A | M | **✨ 新規昇格**（透明性確保、AI が選んだ提案を同画面に表示） |
| **X.3** | シンギュラリティ突入後の自動初回発火 | B + D + F | A + E | M | **✨ 新規昇格**（沈黙の「真っ暗」体験を回避、突入 1.5 秒後に AI 自動発火） |
| **X.4** | 自由記載 input | B + F | A | M | **✨ 新規昇格**（4 提案がしっくり来ない時の逃げ道、textarea 常時表示） |

---

## 2. Story 改訂サマリ

| 区分 | 件数 | Story 番号 |
|---|---|---|
| ✅ そのまま実装 | 8 | 1.2 / 1.3 / 2.4 / 4.1 / 5.2 / 5.3 / 5.4 / 5.5 |
| 🔄 改訂実装 | 4 | 1.1（簡易化）/ 3.4（買い物置換）/ 4.3（即時遷移）/ 5.1（モード命名） |
| ✨ 新規昇格 | 4 | X.1 / X.2 / X.3 / X.4 |
| ❌ 集約（X 系で表現） | 6 | 2.1 / 2.2 / 2.3 / 3.1 / 3.2 / 3.3 |
| ❌ 削除 | 5 | 2.5 / 2.6 / 3.5 / 3.6 / 4.2 |
| **合計実装数** | **16** | — |
| 削除/集約 合計 | 11 | — |

---

## 3. Unit 別 Story 担当表

### Unit-A: 共通基盤・インフラ（j-ichikawa）

直接所有 Story なし（インフラ Unit）。**全 Story の前提条件**を提供:
- API Gateway REST / WebSocket
- DynamoDB スキーマ（CategoryStates / ChoiceLogs / SingularityReports / WebSocketConnections）
- EventBridge cron（X.3 自動発火、シンギュラリティ自律実行 sweep）
- Lambda Common Layer（user_id 解決、Repo 抽象化）
- IAM / CDK Stack

### Unit-B: ダメ・ラボ Agent on Bedrock AgentCore（j-ichikawa）

> **実装基盤**: Amazon Bedrock AgentCore **Runtime + Observability** のみ採用。Agent 本体は AgentCore Runtime（コンテナ）にホスト、tools は AgentCore Gateway を **経由せず** Lambda direct invoke（AWS SDK）で呼ぶ。Memory も不採用、DynamoDB で代替。`requirements.md` Appendix B.10 参照。

| Story | 内容 | AgentCore コンポーネント |
|---|---|---|
| 1.3 | 初回サジェスチョン受領（4 提案生成） | Runtime（自我モード instruction）+ Bedrock model |
| 2.4 / 3.4 | やっといたよ音声報告（自律判断） | Runtime（シンギュラリティモード）+ Tool Lambdas direct invoke (synthesize-report / send-slack-message) |
| 4.1 | 単発委譲（AI が 1 つ選ぶ） | Runtime + Bedrock model |
| 4.3 | 完全委譲（即時シンギュラリティ遷移判定） | Runtime + Tool Lambda direct invoke (set-mode) |
| **X.1** | 3 回トレーニング後 auto-graduate | Tool Lambda direct invoke (record-choice、SELF_DECISION_LIMIT = 3 ロジック内蔵) |
| **X.2** | 単発委譲時の AI 選択結果表示 | Runtime + Bedrock model（透明性確保で選択 proposalId 返却） |
| **X.3** | シンギュラリティ突入後の自動初回発火 | EventBridge → invoke-wrapper → Runtime（1.5 秒タイマー後の発火） |
| **X.4** | 自由記載 input | Runtime（textarea 入力を context として処理） |

### Unit-C: 傀儡度 BE（水口）

| Story | 内容 |
|---|---|
| 5.1 | 現在モード集計 |
| 5.2 | 自己決定 vs AI 委譲推移 |
| 5.3 | 委譲履歴 |
| 5.4 | 最後に自分で選んだ日 |
| 5.5 | 自己決定能力スコア時系列 |

### Unit-D: 音声 UI BE（水口）

| Story | 内容 |
|---|---|
| 2.4 | 「やっといたよ」音声合成 + WebSocket push（連絡） |
| 3.4 | 「やっといたよ」音声合成 + WebSocket push（買い物） |
| 4.3 | 完全委譲時の即時音声 |
| X.3 | 自動初回発火時の音声 |

### Unit-E: 外部メッセージング送信（水口 / j-ichikawa fallback）

| Story | 内容 |
|---|---|
| 2.4 | Slack 送信代行（連絡カテゴリの業務 Slack 返信代行） |
| 4.3 | 完全委譲後の初回 Slack 送信（連絡カテゴリ時のみ。買い物カテゴリでは音声報告のみで Slack 送信なし） |

### Unit-F: フロントエンド SPA（高根）

**全 16 Story に何らかの形で関与**（フロント描画があるため）。主要関与:

| Story | 内容 |
|---|---|
| 1.1 | OnboardingScreen（名前入力 + ローカルストレージ） |
| 1.2 | CategorySelectScreen |
| 1.3 | SuggestionScreen（4 提案 + 自由記載） |
| 4.1 | 単発委譲ボタン UI |
| 4.3 | 完全委譲ドラマ UI（確認ダイアログ） |
| 5.1〜5.5 | PuppetLevelScreen + 各種 React component（傀儡度ダッシュボード） |
| X.2 | 単発委譲時の AI 選択結果表示 UI |
| X.3 | SingularityScreen（音声プレイヤー、自動初回発火受信） |
| X.4 | 自由記載 textarea |

---

## 4. デモシナリオ（書類審査・予選用、Story にマップ）

### メインシナリオ: 連絡カテゴリ
1. **Story 1.1**: 名前入力 → セッション開始
2. **Story 1.2**: カテゴリ選択 → 連絡を選ぶ
3. **Story 1.3 + X.4**: 自我モードの 4 提案受領 + 自由記載枠あり
4. **Story 4.1 + X.2**: 単発委譲（AI が 1 つ選ぶ）→ 透明性確保で結果表示
5. **Story X.1**: 3 回トレーニング達成 → auto-graduate でシンギュラリティモード突入
6. **Story X.3**: 突入 1.5 秒後に自動初回発火（音声報告）
7. **Story 2.4**: 「お母さんに『元気だよ』って返信しといたから」音声報告 + Slack 送信。**送信先はチーム内デモ専用 workspace の `#self-channel`**（自分宛て通知扱いで、本物の LINE / 親宛て送信は行わない。デモ虚構性の明示）

### サブシナリオ: 買い物カテゴリ（Appendix B.1 で人間関係から置換）
1. **Story 4.3**: 「もう買い物のことは考えたくない」完全委譲（即時シンギュラリティ）
2. **Story 3.4**: 「日用品、注文しといたよ」音声報告のみ（Slack 送信なし。買い物カテゴリの実 EC 注文は MVP 範囲外で park、音声報告だけで「やっといたよ」体験を演出）

### クライマックス: 傀儡度ダッシュボード
1. **Story 5.1〜5.5**: 自己決定能力スコア低下を視覚化、シンギュラリティ到達カテゴリ数を強調

---

## 5. Acceptance Criteria 横断確認

各 Story の AC 詳細は `stories.md` 本文を参照（事前議論時点）。本マッピングで **AC が改訂された Story** のみ:

| Story | 改訂 AC ハイライト |
|---|---|
| 1.1 | 旧: Cognito 登録 + JWT 発行 / 新: 名前入力 → ローカルストレージ → 次画面 |
| 3.4 | 人間関係カテゴリ（飲み会断り）→ 買い物カテゴリ（日用品の発注を AI が代行）へ置換、Slack 送信は不要（買い物タスクは音声報告のみで「やっといたよ」体験を完結） |
| 4.3 | Phase 4 ジャンプ → 即時シンギュラリティ遷移、音声即時発火 |
| 5.1 | 「現在フェーズ表示」→「現在モード（自我 / シンギュラリティ）表示」 |
| X.1 | （新規）3 回連続自己決定 → modeState = "singularity" + EventBridge 初回発火イベント |
| X.2 | （新規）単発委譲 API レスポンスに AI が選んだ proposalId を含める、フロント表示 |
| X.3 | （新規）modeState = "singularity" 遷移直後 1.5 秒タイマー → runSingularityAction 自動呼出 |
| X.4 | （新規）SuggestionScreen に textarea 常時表示、空文字時はバリデーション |

---

## 6. PBT 適用 Story（PBT-01 forward flag）

**書類審査の評価軸『品質』に直結**。各 Story の Functional Design で正式定義（PBT-01 ルール）。

| Story | PBT カテゴリ | 想定プロパティ |
|---|---|---|
| X.1 (auto-graduate) | Idempotence + Invariant | 同じ ChoiceLogs から計算した selfDecisionCount は常に同じ、3 到達で必ず singularity 遷移 |
| X.4 (自由記載) | Round-trip | テキスト送信 → ChoiceLogs 保存 → 取得 = 入力 |
| 5.5 (スコア時系列) | Invariant | 集計合計 = ChoiceLogs 総数、単調減衰 |
| 2.4 (Slack 送信、連絡カテゴリのみ) | Invariant | 送信先 ⊆ ALLOWED_SLACK_CHANNELS が常時成立 |
| 4.1 (単発委譲) | Invariant | proposals.length === 4 が常に成立 |

---

## 7. Story 完全性検証

| 検証項目 | 結果 |
|---|---|
| stories.md 23 Story の処遇明示 | ✅ 全 23 Story に [そのまま / 改訂 / 集約 / 削除] のラベル付与 |
| Appendix B.3 の X.1〜X.4 を本マッピングで採用 | ✅ 4 Story 全て正式昇格 |
| 認証撤廃の反映（Story 1.1） | ✅ 簡易化版に改訂 |
| 命名統一（傀儡度 / 自我 / シンギュラリティ） | ✅ 全表で適用 |
| Phase 撤廃の反映（2.5 / 2.6 / 3.5 / 3.6 / 4.2） | ✅ 削除明示 |
| カテゴリ置換（人間関係 → 買い物） | ✅ 3.4 で改訂 |
| 全 Story が Unit に割り当てられているか | ✅ 16 実装 Story が 6 Unit に分配 |
| MVP 実装で漏れる体験がないか | ✅ コアタグライン（自我 → 3 回 → シンギュラリティ）が全フローでカバー |

---

## 8. 書類審査評価軸への対応

| 審査基準 | 本マッピングの対応 |
|---|---|
| **ビジネス意図（Intent）の明確さ** | コアタグライン引用 + 16 Story が世界観実現に寄与する流れを明示 |
| **Unit 分解の適切さ** | 6 Unit × Story マッピング、所有 Story の Unit 一目瞭然 |
| **創造性とテーマ適合性** | X.1〜X.4 新規昇格で「3 回 → シンギュラリティ」「自由記載」「自動初回発火」など世界観の核を Story 化 |
| **ドキュメントの品質** | stories.md（議論経緯）と本マッピング（実装計画書）の役割分担、改訂履歴明示 |

---

## 9. Construction フェーズへの引き継ぎ

各 Story は Construction Per-Unit Loop で詳細化:
- **Functional Design (per-unit)**: AC 詳細、ビジネスルール、エラーケース、PBT properties
- **Code Generation**: 実装

**実装順序の推奨**:
1. Unit-A の土台 deploy
2. Unit-B / X.1 の auto-graduate ロジック（コアタグラインの実装本体）
3. Unit-F の主要画面 + Discovery Mock からの移植
4. Unit-D / X.3 の音声配信
5. Unit-E / 2.4 の Slack 送信（最後、安全境界の検証重要。3.4 は Slack 不要なので Unit-E 対象外）
6. Unit-C / 5.x の傀儡度ダッシュボード
