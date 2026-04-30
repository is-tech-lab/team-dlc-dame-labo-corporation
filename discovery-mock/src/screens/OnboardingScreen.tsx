import { tone } from '../tonePhrases';

type Props = {
  userName: string;
  onProceed: () => void;
};

export default function OnboardingScreen({ userName, onProceed }: Props) {
  return (
    <div className="screen onboarding">
      <div className="brand-mark">ダメ・ラボ・コーポレーション</div>
      <h1 className="hero">{tone.greeting(userName)}</h1>
      <p className="hero-sub">
        ここは、あなたの代わりに考える場所。<br />
        最初に、どこから手を抜き始めるか決めようか。
      </p>
      <button className="primary-button" onClick={onProceed}>
        始める
      </button>
      <div className="nav-hint">右下のデモコントロールでフェーズを手動ジャンプできます</div>
    </div>
  );
}
