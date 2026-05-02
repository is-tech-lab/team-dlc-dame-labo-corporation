# Unit of Work Plan — Units Generation

**作成日**: 2026-05-02
**フェーズ**: INCEPTION - Units Generation
**前提資料**:
- `aidlc-docs/inception/application-design/components.md`（7 コンポーネント定義）
- `aidlc-docs/inception/application-design/services.md`（S1〜S8 サービス）
- `aidlc-docs/inception/application-design/component-dependency.md`（依存関係マトリクス）
- `aidlc-docs/inception/user-stories/stories.md`（23 + Appendix B X.1〜X.4 候補）
- `aidlc-docs/inception/requirements/requirements.md`（Appendix B で MVP override）

このプランは Units Generation の Plan + 質問。チームの回答を得てから、実際の成果物（`unit-of-work.md`, `unit-of-work-dependency.md`, `unit-of-work-story-map.md`）を生成する。

---

## 0. Application Design からの Unit 候補（再掲）

components.md より 7 コンポーネントが定義済み。以下は **Unit 化の出発点** として整理。

| 候補 | コンポーネント | 役割 | 独立性 |
|---|---|---|---|
| Unit-A | **共通基盤** | API GW (REST+WS) / Lambda Layer / DDB / EventBridge / IAM | 全 Unit の土台、独立必須 |
| Unit-B | **ダメ・ラボ Agent** | Bedrock 統合、mode-aware（自我/シンギュラリティ）、SELF_DECISION_LIMIT = 3 | 独立必須（AI 中核） |
| Unit-C | **傀儡度** | オンデマンド集計、ダッシュボード | 独立可能（fe + be 一体） |
| Unit-D | **音声 UI** | Polly + WebSocket 配信 + フロント音声プレイヤー | 独立可能 |
| Unit-E | **外部メッセージング送信** | Slack only + ホワイトリスト + DRY_RUN | **独立 vs Unit-B 統合 を判断必要** |
| Unit-F | **フロントエンド SPA** | Vite + React + React Router、名前入力でセッション開始 | **独立 vs 各 Unit 分散 を判断必要** |

> **MVP では認証基盤を撤廃（2026-05-02 user 指示）**: 当初の `Unit-認証基盤（Cognito User Pool + フロント連携）` は決勝プレゼンでマルチユーザーを訴求しないため MVP 撤廃。単一デモユーザー（hardcoded `userId`）+ 名前のローカルストレージ保持で代用。`TODO_construction.md` で park、マルチユーザー対応時に復帰。

---

## 1. ユニットの粒度（Unit-E / Unit-F の独立性）

### Question U-1: ユニット数（Unit-E / Unit-F の扱い）

A) **4 Unit 構成（最小）**: Unit-A〜D のみ。Unit-E（外部送信）は Unit-B（Agent）に統合、Unit-F（フロント）は各 Unit が該当画面を所有
B) **5 Unit 構成（推奨案）**: A〜D + 独立した Unit-E（外部送信、安全境界の独立を強調）。Unit-F は各 Unit 分散
C) **6 Unit 構成（最大分割）**: A〜F 全て独立、Unit-F フロントは独立 Unit としてフロント担当が一括所有
D) その他（下の `[Answer]:` タグの後に詳述してください）

[Answer]:

---

## 2. フロントエンドの組み込み方

### Question U-2: フロントエンド SPA（Unit-F）の所有権

A) **独立 Unit として一括所有**: フロント担当が React Router / WebSocket クライアント / 全画面（オンボーディング、カテゴリ選択、サジェスチョン、傀儡度、シンギュラリティ画面）を所有
B) **共通基盤のみ独立、画面は各 Unit 所有**: フロント担当 = ルーティング・共通レイアウト・通信クライアント、各 Unit 担当 = 自分の画面 React component を実装
C) **モノリシック SPA、Unit 概念をフロントに持ち込まない**: フロントは 1 つのアプリ、Unit は backend のみ
D) その他（下の `[Answer]:` タグの後に詳述してください）

[Answer]:

---

## 3. デプロイ単位

### Question U-3: デプロイ・リポジトリ構造

A) **Mono-repo + multi-Lambda**: 単一リポジトリ、各 Unit は別 Lambda 関数 + IaC で個別管理。CDK で Stack 分割
B) **Mono-repo + single Lambda**: 単一リポジトリ、全機能を 1 つの Lambda にバンドル（書類審査 MVP 簡素化）
C) **Multi-repo**: Unit ごとに別リポジトリ（書類審査の提出 URL に複数必要）
D) その他

[Answer]:

---

## 4. チーム分担

### Question U-4: 各 Unit のオーナー割当

チーム構成: 高木皇佑（チーム代表 = プライマリペルソナ） / FE 担当 / BE 担当 / AI/ML 担当 の 4 名想定。

A) **専門領域マッピング**: AI/ML → Unit-B（Agent）/ FE → Unit-F（フロント）+ Unit-F の画面分散 / BE → Unit-A（共通基盤）+ Unit-E（外部送信）/ 高木 → Unit-C（傀儡度）+ Unit-D（音声 UI）+ オーバーオールアーキテクト
B) **共同所有モデル**: 各 Unit に primary owner と secondary を割当、ペアワークで進める
C) **書類審査時点では割当しない**: 概念上の Unit 分割のみ確定、実装担当は Construction フェーズ着手時に決める
D) その他（下に詳述）

[Answer]:

---

## 5. 共通基盤の独立性

### Question U-5: 共通基盤（Unit-A）の責務範囲

共通基盤には API Gateway（REST + WebSocket）、Lambda Layer、DynamoDB スキーマ、EventBridge、IAM Role 等が含まれる予定。

A) **完全な土台 Unit**: 上記すべてを Unit-A に集約、他 Unit はここを依存先とする（変更影響が大きいので最初に固める）
B) **インフラ Unit + 共通コード Unit に分割**: IaC（CDK / Terraform）= Unit-A、Lambda 共通コード（Repo 層 / user_id 解決ミドルウェア等）= Unit-A2 として分離
C) **DynamoDB スキーマだけ独立 Unit に**: スキーマ変更の影響範囲を明確にするため
D) その他

[Answer]:

---

## 6. ディレクトリ構造（Greenfield Code Organization）

### Question U-6: リポジトリ内のディレクトリ配置

A) **per-unit ディレクトリ**: `units/unit-a-foundation/`, `units/unit-b-agent/`, ... のように Unit を物理ディレクトリで明示
B) **service-oriented**: `services/foundation/`, `services/agent/`, `services/puppet-level/`, ... のようにサービス単位
C) **AWS CDK 慣例**: `lib/` 配下に CDK Stack を配置、`bin/` で entry point、Lambda コードは `lambda/` 配下
D) **Backend / Frontend 分離 + 内部 Unit**: `backend/` + `frontend/` のトップ分割、各内部で Unit
E) その他

[Answer]:

---

## 7. ストーリー → Unit マッピング（仮、議論材料）

stories.md の 23 ストーリー + Appendix B X.1〜X.4 候補。Phase 1〜3 ベースのストーリーは Appendix B.2 で Active モード（自我）に collapse 済、X.1〜X.4 が事実上の正規ストーリー。

| Story | 内容 | 仮マッピング |
|---|---|---|
| 1.1 | アカウント登録 → **名前入力でセッション開始**（認証撤廃で簡易化） | Unit-F（フロント）のみ、ローカルストレージ保持 |
| 1.2 | 最初のカテゴリ選択 | Unit-F（フロント）+ Unit-A（DDB CategoryStates） |
| 1.3 | 初回サジェスチョン受領 | Unit-B（Agent） |
| 2.1〜2.6（Phase 1-3 / 連絡） | Phase 撤廃済、自我モード提案として Unit-B（Agent）+ Unit-F（フロント） | Appendix B で X.1〜X.4 に統合 |
| 2.4 | 「やっといたよ」音声報告（連絡） | Unit-B + Unit-D（音声 UI）+ Unit-E（外部送信） |
| 3.1〜3.6（Phase 1-3 / 人間関係） | カテゴリは買い物に置換（Appendix B.1）、Phase は撤廃 | 上記と同様 |
| 4.1 | 単発委譲 | Unit-B + Unit-F |
| 4.2 | フェーズ昇格（手動） | Appendix B.4 で削除予定（自動 graduate のみ） |
| 4.3 | 完全委譲のドラマ | Unit-B + Unit-F + Unit-D（autonomous 突入後の音声） |
| 5.1 | カテゴリごとの現在フェーズ | Unit-C（傀儡度）+ Unit-F |
| 5.2 | 自己決定 vs AI 委譲推移 | Unit-C |
| 5.3 | 委譲履歴 | Unit-C |
| 5.4 | 最後に自分で選んだ日 | Unit-C |
| 5.5 | 自己決定能力スコア時系列 | Unit-C |
| **X.1**（候補） | 3 回トレーニング後 auto-graduate | Unit-B + Unit-A（CategoryStates カウンタ） |
| **X.2**（候補） | 単発委譲時の AI 選択結果表示 | Unit-B + Unit-F |
| **X.3**（候補） | autonomous 突入後の自動初回発火 | Unit-B + Unit-A（EventBridge）+ Unit-D |
| **X.4**（候補） | 自由記載 input | Unit-B + Unit-F |

### Question U-7: Story マッピングの確認

A) **仮マッピングで OK**（軽微な調整は Generation フェーズで実施）
B) **Phase 系ストーリー（2.x / 3.x）の正式整理が必要**: Appendix B.2 を反映した stories.md の本文修正を別途行う
C) **X.1〜X.4 を正式ストーリーに昇格してから Unit マッピング**: stories.md Appendix B.3 を本文に統合
D) その他

[Answer]:

---

## 8. 必須成果物（ALWAYS GENERATE）

チーム回答後、以下を生成:

- [ ] `aidlc-docs/inception/application-design/unit-of-work.md` — Unit 定義 + 責務 + 依存先の概要 + Greenfield コード組織戦略
- [ ] `aidlc-docs/inception/application-design/unit-of-work-dependency.md` — Unit 間依存マトリクス + 通信パターン + データフロー
- [ ] `aidlc-docs/inception/application-design/unit-of-work-story-map.md` — 23 + X.1〜X.4 ストーリー → Unit マッピング表 + Acceptance Criteria 横断確認
- [ ] Unit 境界と依存の検証
- [ ] 全ストーリーが Unit に割り当てられていることの確認

---

**回答完了後、Claude に「Unit プラン回答完了」とお伝えください。** 矛盾・曖昧さがあればフォローアップ質問を、なければ Units Generation 成果物の生成に進みます。
