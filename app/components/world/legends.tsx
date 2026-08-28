'use client';

import { useEffect, useRef } from 'react';
import { netLayers } from '../../data';
import { STAGES } from '../Rag';
import { setDescentTargets } from './telemetry';

/**
 * The captions for the world's stations.
 *
 * Each station's figure now renders in the shared canvas behind the page,
 * but its caption is real text and stays in the document: it has to be
 * readable, selectable, reachable by keyboard, and present when there is no
 * canvas at all. These are what is left of the old figures once the geometry
 * moved into the world.
 */

/** The four layers the network station is showing. */
export function NetLegend() {
  return (
    <figcaption className="net-legend station-legend">
      {netLayers.map((l, i) => (
        <div key={l.label} className="net-layer">
          <span className="mono net-layer-i">{String(i + 1).padStart(2, '0')}</span>
          <span className="net-layer-name">{l.label}</span>
          <span className="net-layer-note">{l.note}</span>
        </div>
      ))}
    </figcaption>
  );
}

/** Live step and loss from the descent station, plus what it is showing. */
export function DescentReadout() {
  const stepEl = useRef<HTMLSpanElement>(null);
  const lossEl = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setDescentTargets({ step: stepEl.current, loss: lossEl.current });
    return () => setDescentTargets({ step: null, loss: null });
  }, []);

  return (
    <figcaption className="descent-legend station-legend">
      <dl className="descent-readout mono">
        <div>
          <dt>step</dt>
          <dd>
            <span ref={stepEl}>000</span>
          </dd>
        </div>
        <div>
          <dt>loss</dt>
          <dd>
            <span ref={lossEl}>0.000</span>
          </dd>
        </div>
        <div>
          <dt>optimiser</dt>
          <dd>SGD + momentum 0.86</dd>
        </div>
      </dl>
      <p className="descent-note">
        Momentum descent on a surface with two basins. Every run starts
        somewhere new, so which minimum it finds is decided before the first
        step — the reason a result has to be reproducible to count.
      </p>
    </figcaption>
  );
}

/** The five stages the retrieval station is showing. */
export function RagLegend() {
  return (
    <figcaption className="rag-legend station-legend">
      {STAGES.map((st, i) => (
        <div key={st.key} className="rag-stage">
          <span className="mono rag-stage-i">{String(i + 1).padStart(2, '0')}</span>
          <span className="rag-stage-name">{st.label}</span>
          <span className="rag-stage-note">{st.note}</span>
        </div>
      ))}
    </figcaption>
  );
}
