export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Map `value` from [inMin, inMax] to [outMin, outMax], clamped. */
export const remap = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => lerp(outMin, outMax, clamp((value - inMin) / (inMax - inMin)))
