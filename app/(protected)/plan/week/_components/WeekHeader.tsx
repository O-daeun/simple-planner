"use client";

import { Button } from "@/components/ui/button";
import {
  addDaysToKstYmd,
  getWeekRangeLabel,
  normalizeToWeekStartYmd,
} from "@/lib/week";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useMemo, useRef } from "react";

interface WeekHeaderProps {
  weekStartYmd: string; // YYYY-MM-DD (월요일)
  onChangeWeekStartYmd: (nextWeekStartYmd: string) => void;
}

export default function WeekHeader({
  weekStartYmd,
  onChangeWeekStartYmd,
}: WeekHeaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const label = useMemo(() => getWeekRangeLabel(weekStartYmd), [weekStartYmd]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          className="px-2 text-lg font-medium"
          onClick={() => {
            const el = inputRef.current;
            if (!el) return;
            if (typeof el.showPicker === "function") el.showPicker();
            else el.click();
          }}
          aria-label="주 선택"
        >
          {label}
        </Button>
        {/* 브라우저 기본 datepicker (선택한 날짜가 속한 주의 월요일로 정규화) */}
        <input
          ref={inputRef}
          type="date"
          className="sr-only"
          value={weekStartYmd}
          onChange={(e) =>
            onChangeWeekStartYmd(normalizeToWeekStartYmd(e.target.value))
          }
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="이전 주"
          onClick={() =>
            onChangeWeekStartYmd(addDaysToKstYmd(weekStartYmd, -7))
          }
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="다음 주"
          onClick={() => onChangeWeekStartYmd(addDaysToKstYmd(weekStartYmd, 7))}
        >
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
