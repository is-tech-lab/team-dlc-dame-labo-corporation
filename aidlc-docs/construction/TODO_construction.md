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

## 履歴

- 2026-04-30: 初版作成。Nix flake 項目を park（チーム代表 高木氏起点の議論）
