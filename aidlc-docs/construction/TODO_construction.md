# TODO — Construction フェーズで判断・実装する項目

**位置付け**: Inception フェーズ進行中に「Construction で扱うべき」と判断された事項を park しておく場所。Construction 着手時にここを起点に検討する。

**運用ルール**:
- Inception 中に出た Construction 関連のアイデア・気付きはここに追記
- 各項目は「**何を / なぜ / いつ判断 / 開かれた質問**」を記述
- Construction フェーズ開始時にこのファイルをチームでレビュー
- 解消・実装した項目は `[x]` でチェック、内容は履歴として残す（消さない）

---

## TODO 一覧

### [ ] Nix flake による開発環境の再現性確保（2026-04-30 提起）

**何を**:
Construction フェーズの本番コードベース（discovery-mock ではなく、AWS にデプロイする実装）に `flake.nix` を導入し、開発環境を nix で再現可能にする。

**なぜ**:
- ハッカソン本番コードは AWS スタックを多用する: Node.js（フロント・Lambda）+ AWS CLI + AWS CDK（または SAM）+ Bedrock AgentCore SDK + Polly SDK + Cognito 等
- これらツールチェーンのバージョン違いが原因で「自分の環境では動くのに他のメンバーで動かない」を起こすと、ハッカソン期間中の解決コストが大きい
- 4 名混成チーム（企画・FE・BE・AI/ML）の環境差を flake で吸収できる
- 決勝（6/26）の AWS 本番デプロイの再現性も担保される（CI/CD で同じ flake を使える）

**いつ判断**:
Construction フェーズの **NFR Requirements / Infrastructure Design** の段階。Unit 0（共通基盤）の Code Generation Planning に入る前に flake を整備しておくと、その後の Per-Unit Loop が flake 環境前提で進められる。

**開かれた質問**:
- スコープ: 開発環境（Node / AWS CLI / CDK / IDE 設定）のみか、ビルド・テスト・CI/CD まで nix に乗せるか
- メンバーのオンボーディング: 4 名のうち nix 未経験者は誰か、初回セットアップ時間の見積もり（macOS なら Determinate Systems Installer 等）
- nix を使わないメンバーへのフォールバック手段（package.json の scripts や Makefile を flake と並走させるか）
- pinning 戦略: nixpkgs の特定 commit を固定、または unstable channel
- direnv との統合（`direnv allow` で自動環境切り替え）

**Discovery Mock では導入しない理由**:
- 捨てモック、ROI 低、4 名強制の摩擦 > 利益
- 本番コードベースで初めて導入する判断（Inception 段階で決定済み）

**参考**:
- 提起のきっかけ: 2026-04-30 の Slack メッセージ準備中、Node.js install 方法の議論で「nix にするか」とアイデアが出た
- 関連ドキュメント: `discovery-mock/README.md`（モックの軽量起動手順）、`aidlc-docs/inception/requirements/requirements.md` NFR-1（技術スタック方針）

---

### [ ] エージェント構成の再分離検討（2026-05-02 提起）

**何を**:
MVP では 3 エージェント構成（サジェスチョン / プロファイル / 委譲＆実行）を **1 つに統合した「ダメ・ラボ Agent」** で実装。Construction 以降のスケール / 責務分離の必要性が見えてきた段階で、再分離するかを評価する。

**なぜ**:
- MVP の単純化のため統合したが、本番運用ではエージェントごとに**異なる Bedrock モデル / プロンプト / 権限境界**を割り当てたい場面が出る可能性が高い
- 特に「自律実行」の権限（外部 API 呼び出し、メッセージ送信）は user 対話とは別の最小権限境界に分離した方がセキュリティ的に望ましい
- Profile Agent 復活（前項）と合わせて、再分離するなら Inception で議論した 3 エージェント構成へ戻す選択肢が自然

**いつ判断**:
Construction フェーズの **Application Design** または **Functional Design** 段階で、Unit 分解と合わせて再評価。

**開かれた質問**:
- 統合のままで本番デプロイに進めるか、それとも分離が必要か（運用観点）
- Bedrock の同一 Agent で mode 切替（Active / Autonomous）する設計と、Bedrock 上で別 Agent を立てる設計の比較
- IAM Role の分離粒度（user 対話 Lambda と autonomous 実行 Lambda は別 Role が望ましい？）
- Profile Agent 復活時の連結パターン（Supervisor / Orchestrator / Event-driven、`application-design-plan.md` Question C-1 を再活用）

**MVP では統合した理由**:
- Discovery Mock のチームレビュー後（2026-05-02）、HIL 設計と相性的に「単一 Agent が mode で切替」が最も単純
- エージェント間通信 / オーケストレーターの実装コストが MVP には過剰
- 書類審査・予選では「動くデモ」が優先、再分離は本番運用検討に持ち越し

**参考**:
- 関連ドキュメント: `aidlc-docs/inception/plans/application-design-plan.md` §0 / Question C-1 / C-2、`requirements.md` Appendix B.4、`discovery-mock/agent-flow.drawio` 中央の単一 Agent box

---

## 履歴

- 2026-04-30: 初版作成。Nix flake 項目を park（チーム代表 高木氏起点の議論）
- 2026-05-02: エージェント構成の再分離検討を park（Discovery Mock チームレビュー後の 1 Agent 統合決定を受けて）

---

## 外部メッセージング送信チャネルの拡張（LINE / メール）

**項目**: 外部メッセージング送信を Slack 以外（LINE Messaging API / SES）にも対応させる。

**MVP の状態**: Slack の 1 チャネルのみで実装。`requirements.md` / 事前議論では LINE / メールも想定されていたが、Application Design Follow-up C-8b（2026-05-02）で MVP スコープから除外。

**なぜ park**:
- LINE Messaging API は bot アカウント申請が必要で書類審査 5/10 締切までに間に合わないリスク
- SES (AWS Simple Email Service) は domain verification + sandbox 解除が必要、これも事前準備に時間がかかる
- Slack の専用 workspace + ホワイトリスト + DRY_RUN モードで MVP のデモシナリオは完結する
- 1 チャネルに絞った方が C-8a の安全境界（const ホワイトリスト）が明快、Functional Design もシンプル

**いつ判断**:
予選（5/30）または決勝（6/26）に向けた拡張時点で再評価。事前準備期間を逆算し、決勝までに LINE bot 申請 / SES domain verification を進める判断ポイントを設ける。

**開かれた質問**:
- LINE は LINE Notify と LINE Messaging API どちらを使うか（前者の方が手続き軽い）
- SES の代替として SendGrid 等の外部 SaaS も視野に入れるか
- 各チャネルでホワイトリスト + DRY_RUN を再実装するのか、共通インタフェース層を設けるのか

**参考**:
- 関連ドキュメント: `aidlc-docs/inception/plans/application-design-plan.md` Follow-up C-8b、`aidlc-docs/inception/application-design/components.md` §2.7

---

## Speech-to-Speech（音声入力 → 音声出力の双方向）

**項目**: ユーザーが声で操作（音声入力）できるようにする → Speech-to-Text → Bedrock → Polly の双方向音声 UX。

**MVP の状態**: 音声出力（AI → user）のみ実装、音声入力（user → AI）は対象外。Application Design Follow-up C-5a（2026-05-02）で park 決定。

**なぜ park**:
- **世界観との衝突**: Phase 4 / Autonomous モードでは「ユーザーは何もしない、聞き流す」が本質。能動的に声で応答することは『傀儡化』『決めない快楽』テーマと矛盾する
- **スコープ超過**: Transcribe / Lex / Nova Sonic 等の音声入力コンポーネント追加で書類審査までの実装範囲を大幅に超える
- **設計影響**: 音声入力を導入すると、音声で選択した内容を構造化選択（4 提案のうちどれか）に変換するロジック、マイク権限制御、エコーキャンセル等の追加考慮が必要

**いつ判断**:
予選通過後、決勝に向けた拡張機能として再評価。または「ユーザーが Phase 4 突入後に一言フィードバック（『あ、それは違うわ』）する」という限定的な音声入力 UX を切り出す可能性がある。

**開かれた質問**:
- 完全な双方向音声会話を目指すのか、限定的なフィードバック入力に留めるのか
- AWS Nova Sonic（Speech-to-Speech モデル）が利用可能になっているか、Construction 開始時点で確認
- 世界観（傀儡化）と双方向音声の整合性をどう取るか（声で文句言うのは『ダメになっていない』のでは？）

**参考**:
- 関連ドキュメント: `aidlc-docs/inception/plans/application-design-plan.md` Follow-up C-5a、`requirements.md` 事前議論の「イヤホンから『やっといたよ』」の世界観記述

---

## 履歴（追記）

- 2026-05-02 夜: 外部チャネル拡張（LINE/SES）と Speech-to-Speech を park（Application Design Follow-up C-8b / C-5a を受けて）

---

## 認証基盤（Cognito）の追加 — マルチユーザー対応時

**項目**: AWS Cognito User Pool + API Gateway Authorizer + JWT 検証 + フロント認証フローの追加実装。

**MVP の状態**: **撤廃済み**（2026-05-02、user 指示）。決勝プレゼンでマルチユーザーを訴求しないため、単一デモユーザー（hardcoded `userId = "demo-user-001"`）+ 名前のローカルストレージ保持で代用。

**なぜ park**:
- 決勝（6/26）プレゼンの訴求軸はマルチユーザーではなく『1 人のユーザーが 3 回で傀儡化される』ナラティブ
- Cognito User Pool セットアップ / Authorizer 設定 / JWT 検証 / パスワード忘れ画面実装は MVP の 8 日締切に対して負担が大きい
- Discovery Mock も既に「名前入力 → ローカル保持」で動作実証済、世界観に支障なし
- 撤廃により API Gateway Authorizer / Cognito 関連 IAM / CDK Stack が 1 つ消えてインフラ単純化

**いつ判断**:
予選通過後または本サービスを真に公開する段階で復帰。具体的には:
- 複数ユーザーが触れる公開デモ環境を用意する場合
- 自己決定能力スコアの累積データを user 単位で保持する場合
- 「やっといたよ」音声報告のクロス user 比較を行う場合

**開かれた質問**:
- Cognito Hosted UI を使うか、独自 UI で SDK 直叩きか
- ソーシャルログイン（Google / Apple）を当初から入れるか後付けか
- MFA は必要か（決勝で『傀儡化されることを承諾するセキュリティ』のメタジョーク化も可）
- 既存の hardcoded `userId` を Cognito sub に置き換える migration 戦略

**参考**:
- 関連ドキュメント:
  - `aidlc-docs/inception/requirements/requirements.md` Appendix B.9（認証基盤の MVP 撤廃）
  - `aidlc-docs/inception/user-stories/stories.md` Appendix B.7（Story 1.1 簡易化）
  - `aidlc-docs/inception/application-design/components.md`（§5 境界の明示）
  - `aidlc-docs/inception/plans/unit-of-work-plan.md`（§0 注記）

---

## 履歴（追記）

- 2026-05-02 夜: 認証基盤（Cognito）の追加を park（決勝プレゼンでマルチユーザー訴求なしのため MVP 撤廃決定を受けて）
