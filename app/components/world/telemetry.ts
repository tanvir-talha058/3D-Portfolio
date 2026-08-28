/**
 * The channel between the world and the readouts that describe it.
 *
 * The world canvas is mounted in the layout and the readouts live in the
 * page, so a station cannot hand its numbers to its caption through props.
 * It could go through React state instead, but the descent station reports
 * every frame, and re-rendering a subtree sixty times a second for two
 * numbers is exactly what the old DescentMount avoided by writing straight
 * to its own text nodes. This keeps that property across the new boundary:
 * the caption registers its elements, the station writes into them, and
 * React is not involved in either direction.
 */

type DescentTargets = { step: HTMLElement | null; loss: HTMLElement | null };

let descent: DescentTargets = { step: null, loss: null };

export function setDescentTargets(next: DescentTargets) {
  descent = next;
}

export function reportDescent(step: number, value: number) {
  const s = descent.step;
  const l = descent.loss;
  if (s) {
    const next = String(step).padStart(3, '0');
    if (s.textContent !== next) s.textContent = next;
  }
  if (l) {
    const next = value.toFixed(3);
    if (l.textContent !== next) l.textContent = next;
  }
}
