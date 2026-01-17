import { addDays } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

const KST = "Asia/Seoul";

export function kstYmdToDateValue(ymd: string) {
  // "KST의 yyyy-MM-dd 00:00:00"을 UTC Date로 변환
  return fromZonedTime(`${ymd} 00:00:00`, KST);
}

export function dateValueToKstYmd(date: Date) {
  return formatInTimeZone(date, KST, "yyyy-MM-dd");
}

export function normalizeToWeekStartYmd(anyYmd: string) {
  // anyYmd가 속한 주의 "월요일(weekStart)" yyyy-MM-dd 반환
  const date = kstYmdToDateValue(anyYmd);
  const isoDow = Number(formatInTimeZone(date, KST, "i")); // 1=월 ... 7=일
  const monday = addDays(date, -(isoDow - 1));
  return dateValueToKstYmd(monday);
}

export function addDaysToKstYmd(ymd: string, days: number) {
  const date = kstYmdToDateValue(ymd);
  return dateValueToKstYmd(addDays(date, days));
}

export function getThisWeekStartYmd(now = new Date()) {
  const todayYmd = formatInTimeZone(now, KST, "yyyy-MM-dd");
  return normalizeToWeekStartYmd(todayYmd);
}

export function getWeekRangeLabel(weekStartYmd: string) {
  const start = kstYmdToDateValue(weekStartYmd);
  const end = addDays(start, 6);
  const startLabel = formatInTimeZone(start, KST, "M월 d일");
  const endLabel = formatInTimeZone(end, KST, "M월 d일");
  return `${startLabel} ~ ${endLabel}`;
}


