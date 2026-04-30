import { Phase } from '../types';
import { phaseMeta, renderDelegationGauge } from '../mockData';

type Props = {
  phase: Phase;
  variant?: 'pill' | 'card' | 'inline';
};

export default function PhaseBadge({ phase, variant = 'pill' }: Props) {
  const meta = phaseMeta[phase];
  const gauge = renderDelegationGauge(meta.delegationLevel);

  if (variant === 'pill') {
    return (
      <div className={`phase-badge phase-badge-pill phase-${phase}`}>
        <span className="phase-badge-num">Phase {phase}</span>
        <span className="phase-badge-sep">—</span>
        <span className="phase-badge-name">{meta.name}</span>
        <span className="phase-badge-gauge" aria-label={`委譲度 ${meta.delegationLevel}/4`}>{gauge}</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`phase-badge phase-badge-card phase-${phase}`}>
        <div className="phase-badge-card-top">
          <span className="phase-badge-num">Phase {phase}</span>
          <span className="phase-badge-gauge" aria-label={`委譲度 ${meta.delegationLevel}/4`}>{gauge}</span>
        </div>
        <div className="phase-badge-name">{meta.name}</div>
        <div className="phase-badge-tagline">{meta.tagline}</div>
      </div>
    );
  }

  return (
    <span className={`phase-badge phase-badge-inline phase-${phase}`}>
      <span className="phase-badge-num">P{phase}</span>
      <span className="phase-badge-name">{meta.name}</span>
    </span>
  );
}

export function PhaseDescription({ phase }: { phase: Phase }) {
  const meta = phaseMeta[phase];
  return (
    <div className={`phase-description phase-${phase}`}>
      <div className="phase-description-tagline">
        <span className="phase-description-gauge">{renderDelegationGauge(meta.delegationLevel)}</span>
        <span>{meta.tagline}</span>
      </div>
      <div className="phase-description-body">{meta.description}</div>
    </div>
  );
}
