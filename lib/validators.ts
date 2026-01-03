export function isHexColor(v: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(v);
}

export function isValidDaysOfWeek(v: unknown): v is number[] {
  if (!Array.isArray(v) || v.length === 0) return false;
  const seen = new Set<number>();
  for (const x of v) {
    if (!Number.isInteger(x)) return false;
    if (x < 0 || x > 6) return false;
    if (seen.has(x)) return false;
    seen.add(x);
  }
  return true;
}
