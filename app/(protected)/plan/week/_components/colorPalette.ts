// 14가지 색상 팔레트
// 연한 색 7개: 회, 빨, 주, 노, 초, 파, 보
// 진한 색 7개: 회, 빨, 주, 노, 초, 파, 보
export const COLOR_PALETTE = [
  // ───────── 연한 색 (유지) ─────────
  { bg: "#F1F3F5", text: "#343A40", name: "연한 회색" },
  { bg: "#FFDFDF", text: "#7A2E2E", name: "연한 빨강" },
  { bg: "#FFF4CC", text: "#7A5C1D", name: "연한 노랑" },
  { bg: "#DFF5EA", text: "#2F6B4F", name: "연한 초록" },
  { bg: "#DCEEFF", text: "#2C5E8A", name: "연한 파랑" },
  { bg: "#E8DFFF", text: "#4F3C7A", name: "연한 보라" },
  { bg: "#FFE3F1", text: "#7A2F52", name: "연한 핑크" },

  // ───────── 진한 색 (채도 ↑, 명도 유지) ─────────
  { bg: "#BFC5CB", text: "#FFFFFF", name: "진한 회색" },
  { bg: "#F28B8B", text: "#FFFFFF", name: "진한 빨강" },
  { bg: "#EFCB68", text: "#FFFFFF", name: "진한 노랑" },
  { bg: "#7DCCA3", text: "#FFFFFF", name: "진한 초록" },
  { bg: "#82B6F2", text: "#FFFFFF", name: "진한 파랑" },
  { bg: "#9E8DE3", text: "#FFFFFF", name: "진한 보라" },
  { bg: "#F08BB8", text: "#FFFFFF", name: "진한 핑크" },
] as const;

export type PaletteColor = (typeof COLOR_PALETTE)[number];

export const DEFAULT_PALETTE_COLOR = COLOR_PALETTE[0];

// 색상 객체 조회
export const getPaletteEntry = (bg?: string | null) =>
  COLOR_PALETTE.find((entry) => entry.bg === bg) ?? DEFAULT_PALETTE_COLOR;
