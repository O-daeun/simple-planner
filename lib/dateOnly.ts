export function isValidDateOnlyString(v: string) {
  // YYYY-MM-DD
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}

export function toDateOnly(dateStr: string) {
  // "YYYY-MM-DD" -> Date (명시적으로 UTC 자정)
  return new Date(`${dateStr}T00:00:00.000Z`);
}
