"use client";

import {
  addDaysToKstYmd,
  getThisWeekStartYmd,
  kstYmdToDateValue,
} from "@/lib/week";
import { addDays, format } from "date-fns";
import { useEffect, useMemo, useState } from "react";

type TimeBlock = {
  id: string;
  date: string; // "YYYY-MM-DD" (API에서 Date가 문자열로 내려온다고 가정)
  startMin: number;
  endMin: number;
  title: string;
  color?: string | null;
};

const HOUR_H = 48; // 1시간 높이(px). 취향대로 조절
const MIN_PX = HOUR_H / 60;
const TIME_COL_W = 56;

type Props = {
  weekStartYmd: string; // YYYY-MM-DD (월요일)
};

export default function WeekTimeGrid({ weekStartYmd }: Props) {
  const [items, setItems] = useState<TimeBlock[]>([]);

  const days = useMemo(() => {
    const safeWeekStart = weekStartYmd || getThisWeekStartYmd();
    const start = kstYmdToDateValue(safeWeekStart);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [weekStartYmd]);

  const startDate = useMemo(
    () => weekStartYmd || getThisWeekStartYmd(),
    [weekStartYmd]
  );
  const endDate = useMemo(() => addDaysToKstYmd(startDate, 6), [startDate]);

  useEffect(() => {
    const run = async () => {
      const res = await fetch(
        `/api/time-blocks?startDate=${startDate}&endDate=${endDate}`,
        { cache: "no-store" }
      );
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items ?? []);
    };
    run();
  }, [startDate, endDate]);

  return (
    <div className="overflow-hidden rounded-md border">
      {/* 상단 헤더 */}
      <div
        className="bg-background grid border-b"
        style={{
          gridTemplateColumns: `${TIME_COL_W}px repeat(7, minmax(0, 1fr))`,
        }}
      >
        <div className="border-r" />
        {days.map((d) => (
          <div
            key={format(d, "yyyy-MM-dd")}
            className="border-r p-2 text-sm last:border-r-0"
          >
            <div className="font-medium">{format(d, "EEE")}</div>
            <div className="text-muted-foreground">{format(d, "M/d")}</div>
          </div>
        ))}
      </div>

      {/* 본문(시간축 + 그리드 + 일정 오버레이) */}
      <div
        className="relative grid"
        style={{
          gridTemplateColumns: `${TIME_COL_W}px repeat(7, minmax(0, 1fr))`,
        }}
      >
        {/* 좌측 시간 라벨 */}
        <div className="border-r">
          {Array.from({ length: 24 }, (_, h) => (
            <div
              key={h}
              className="text-muted-foreground relative text-xs"
              style={{ height: HOUR_H }}
            >
              <span className="absolute -top-2 right-2">
                {String(h).padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>

        {/* 7일 컬럼들 */}
        {days.map((d) => {
          const ymd = format(d, "yyyy-MM-dd");
          const dayItems = items.filter((it) => it.date?.startsWith(ymd));

          return (
            <div key={ymd} className="relative border-r last:border-r-0">
              {/* 시간 가로줄 */}
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="border-b" style={{ height: HOUR_H }} />
              ))}

              {/* 일정 오버레이 */}
              {dayItems.map((it) => {
                const top = it.startMin * MIN_PX;
                const height = Math.max(16, (it.endMin - it.startMin) * MIN_PX);

                return (
                  <div
                    key={it.id}
                    className="bg-muted/60 absolute right-1 left-1 rounded-md border px-2 py-1 text-xs"
                    style={{
                      top,
                      height,
                      borderLeft: `4px solid ${it.color ?? "#3b82f6"}`,
                    }}
                    title={`${it.title} (${it.startMin}-${it.endMin})`}
                  >
                    <div className="line-clamp-2 font-medium">{it.title}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
