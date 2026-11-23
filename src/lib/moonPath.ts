/**
 * SVG path for the lit part of the Moon's disc.
 *
 * `phase` follows SunCalc: 0 new, 0.25 first quarter, 0.5 full, 0.75 last quarter.
 * The view is from the northern hemisphere, so a waxing moon is lit on the right.
 * The terminator is half an ellipse whose width follows cos(2π·phase).
 */
export function moonLitPath(phase: number, r = 48, cx = 50, cy = 50): string {
  const p = ((phase % 1) + 1) % 1
  const k = Math.cos(2 * Math.PI * p)
  const rx = Math.max(0.001, r * Math.abs(k))
  const waxing = p < 0.5
  const limbSweep = waxing ? 1 : 0
  const terminatorSweep = waxing ? (k > 0 ? 0 : 1) : k > 0 ? 1 : 0

  return [
    `M ${cx} ${cy - r}`,
    `A ${r} ${r} 0 0 ${limbSweep} ${cx} ${cy + r}`,
    `A ${rx} ${r} 0 0 ${terminatorSweep} ${cx} ${cy - r}`,
    'Z',
  ].join(' ')
}
