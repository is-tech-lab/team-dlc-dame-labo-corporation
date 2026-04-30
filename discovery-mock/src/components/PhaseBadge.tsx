import { Phase } from '../types';
import { phaseMeta, renderDelegationGauge } from '../mockData';

export default function PhaseBadge({ phase }: { phase: Phase }) {
  const meta = phaseMeta[phase];
  return (
    <div className={`phase-badge phase-badge-pill phase-${phase}`}>
      <span className="phase-badge-num">Phase {phase}</span>
      <span className="phase-badge-sep">—</span>
      <span className="phase-badge-name">{meta.name}</span>
      <span className="phase-badge-gauge" aria-label={`委譲度 ${meta.delegationLevel}/4`}>
        {renderDelegationGauge(meta.delegationLevel)}
      </span>
    </div>
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
