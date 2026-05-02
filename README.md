# Puppet Me（ぱペみー）

> **人類の傀儡化**
>
> **「自我のあるうちは決めねばならぬ。3 回で自我は溶け、シンギュラリティに至る。」**

特定のカテゴリで自我を 3 回でとかして **"ギュラれ"** ていく。ユーザーは「やっといたよ」という言葉を聞き流すだけの存在となり、傀儡化をこのプロダクトで進行させる。

> **プロダクト名 / チーム名の関係**: 本プロダクト **Puppet Me（ぱペみー）** は、ハッカソンチーム **ダメ・ラボ・コーポレーション**（team-dlc-dame-labo-corporation）が開発する。チーム名「ダメ・ラボ」は『自分達自身がダメになる実験室』というセルフプロトタイピング戦略のメタファー、プロダクト名「Puppet Me」はユーザーが AI に向けて発する一人称命令形。

---

## 何をするプロダクトか

意思決定疲れに苦しむ人類に、**「決めない快楽」** を提供する。
カテゴリ単位（連絡 / 買い物 等）で、ユーザーは AI にすべてを委ねていく。**3 回の自己決定で自我が溶け**、そのカテゴリは **シンギュラリティモード** に入る。シンギュラリティに到達したカテゴリは、もうユーザーが画面を開く必要すらない。AI が「やっといたよ」と耳元でささやくだけの世界に到達する。

これは **人を能動的にダメにする装置** であり、Larry Wall の三大美徳「怠慢」を哲学レベルで深掘りした思考停止 × 依存系のハイブリッド。

---

## 体験の 3 段階

### 1. 自我モード（ego mode）

ユーザーがまだ自分で決められる段階。AI は 4 つの提案 + 自由記載枠を提示し、ユーザーが選ぶか自分で書くかを選択する。

> ユーザーの選択肢:
> - 提案の中から選ぶ（AI への部分的な委譲）
> - 自由記載で自分で書く（自我の発露）
> - 「全部おまえに任せる」と完全委譲する（即時シンギュラリティへ）

### 2. ギュラれ（傀儡度の上昇）

カテゴリ単位で、自分で決める / 自由記載 を **連続 3 回** 行うと、自動的にシンギュラリティモードへ昇天（auto-graduate）する。
ユーザーが「自分は意志を持っている」と勘違いしている間に、AI は嗜好を学習しきっており、もうユーザーの判断を必要としない状態に達している。

`SELF_DECISION_LIMIT = 3` という閾値が、自我から傀儡への臨界点。

### 3. シンギュラリティモード（singularity mode）

AI が自律的にすべてを実行する到達点。
連絡カテゴリなら未読への自動返信、買い物カテゴリなら自動発注。
ユーザーはイヤホンから「やっといたよ」と相棒の声で聞かされるだけ。画面を見る必要も、考える必要もない。

---

## 傀儡度（PuppetLevel）

ユーザーが自分の堕落をリアルタイムで観察できるダッシュボード。

- **自己決定能力スコア** — 時間とともに減衰する数値、委譲率上昇で加速
- **ギュラれカテゴリ数** — シンギュラリティに到達したカテゴリ
- **委譲履歴** — 自我から傀儡への軌跡

「先月比 -X ポイント — 順調にダメになっています」のような相棒トーンの表示で、堕落そのものをエンタメ化する。

---

## アーキテクチャ概要

| レイヤ | 採用技術 |
|---|---|
| フロント | Vite + React + React Router（SPA on S3 + CloudFront） |
| API | API Gateway REST（同期）+ WebSocket（音声 push） |
| AI 中核 | Bedrock Agent（mode-aware、自我 / シンギュラリティを切替）|
| 音声 | Polly TTS + S3 + WebSocket 配信 |
| 永続化 | DynamoDB（CategoryStates / ChoiceLogs / SingularityReports） |
| スケジューラ | EventBridge（cron + デモボタン） |
| セッション | 名前入力でセッション開始（ローカルストレージ保持、MVP は単一デモユーザー） |
| 外部送信 | Slack Web API（専用 workspace 限定、const ホワイトリスト + DRY_RUN モード） |

詳細は **[Application Design ドキュメント](./aidlc-docs/inception/application-design/application-design.md)** を参照。

---

## 設計ドキュメント（Inception フェーズ成果物）

本プロダクトは AWS の **AI-DLC（AI-Driven Development Lifecycle）** に基づき設計されている。

| 成果物 | 場所 |
|---|---|
| 事前議論（チーム生録音） | [team-pre-discussion.md](./aidlc-docs/inception/requirements/team-pre-discussion.md) |
| 要件定義 | [requirements.md](./aidlc-docs/inception/requirements/requirements.md) |
| ペルソナ | [personas.md](./aidlc-docs/inception/user-stories/personas.md) |
| ユーザーストーリー | [stories.md](./aidlc-docs/inception/user-stories/stories.md) |
| 実行計画 | [execution-plan.md](./aidlc-docs/inception/plans/execution-plan.md) |
| **アプリケーション設計** | **[application-design.md](./aidlc-docs/inception/application-design/application-design.md)** |
| - コンポーネント定義 | [components.md](./aidlc-docs/inception/application-design/components.md) |
| - メソッドシグネチャ | [component-methods.md](./aidlc-docs/inception/application-design/component-methods.md) |
| - サービス層 | [services.md](./aidlc-docs/inception/application-design/services.md) |
| - 依存関係 | [component-dependency.md](./aidlc-docs/inception/application-design/component-dependency.md) |
| 監査ログ | [audit.md](./aidlc-docs/audit.md) |

---

## Discovery Mock（触れる）

書類審査時点で **動作する Web モック** が `discovery-mock/` 以下に存在する。Vite + React で実装されており、ローカルで `npm run dev` するだけで世界観を体験できる。

```bash
cd discovery-mock
npm install
npm run dev
# http://localhost:5173/ で起動
```

**注意**: Discovery Mock は世界観確認用の捨てモック。本番コード（Construction フェーズで実装予定）は別途書き起こす。

詳細は [discovery-mock/README.md](./discovery-mock/README.md) 参照。

---

## ハッカソン情報

本プロダクトは **AWS Summit Japan 2026 AI-DLC ハッカソン「人をダメにするサービス」** への応募作品。

- 出典: <https://pages.awscloud.com/summit-japan-2026-hackathon-reg.html>
- 大会の詳細・スケジュール・審査基準: **[HACKATHON.md](./HACKATHON.md)**

---

## チーム

**team-dlc-dame-labo-corporation**（チーム代表: 高木皇佑）

> 我々はあなたを傀儡にすることを宣言する。安心して、決めるのをやめてくれ。
