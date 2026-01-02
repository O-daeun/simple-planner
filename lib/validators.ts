export function isHexColor(v: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(v);
}
