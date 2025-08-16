export function ceilToCents(float) {
  return Math.ceil(float * 100 - 1e-9);
}
export function roundUpMinorUnits(usdCents, rate) {
  return Math.ceil((usdCents / 100) * rate * 100 - 1e-9);
}
