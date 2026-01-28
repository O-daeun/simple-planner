export const HOUR_H = 48; // 1시간 높이(px)
export const MIN_PX = HOUR_H / 60; // 1분당 픽셀
export const TIME_COL_W = 56; // 시간 라벨 컬럼 너비
export const HOUR_BORDER_PX = 1; // border-b 두께(px)
export const HOUR_ROW_H = HOUR_H + HOUR_BORDER_PX; // 1시간 행 총 높이(px)

export const minToPx = (min: number) =>
  min * MIN_PX + Math.floor(min / 60) * HOUR_BORDER_PX;

export const pxToMin = (px: number) => {
  const hours = Math.floor(px / HOUR_ROW_H);
  const remainder = px - hours * HOUR_ROW_H;
  const clamped = Math.min(HOUR_H, Math.max(0, remainder));
  return hours * 60 + clamped / MIN_PX;
};
