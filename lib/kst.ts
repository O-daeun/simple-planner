import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

const KST = "Asia/Seoul";

export function getKstTodayDateValue(now = new Date()) {
  // KST 기준 오늘 날짜 문자열
  const ymd = formatInTimeZone(now, KST, "yyyy-MM-dd");

  // "KST의 yyyy-MM-dd 00:00:00"을 UTC Date로 변환
  return fromZonedTime(`${ymd} 00:00:00`, KST);
}
