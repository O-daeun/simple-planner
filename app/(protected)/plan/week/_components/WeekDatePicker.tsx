"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  addDaysToKstYmd,
  dateValueToKstYmd,
  getWeekRangeLabel,
  kstYmdToDateValue,
  normalizeToWeekStartYmd,
} from "@/lib/week";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useMemo } from "react";

interface WeekDatePickerProps {
  weekStartYmd: string; // YYYY-MM-DD (월요일)
  onChangeWeekStartYmd: (nextWeekStartYmd: string) => void;
}

export default function WeekDatePicker({
  weekStartYmd,
  onChangeWeekStartYmd,
}: WeekDatePickerProps) {
  const label = useMemo(() => getWeekRangeLabel(weekStartYmd), [weekStartYmd]);
  const currentDate = useMemo(
    () => kstYmdToDateValue(weekStartYmd),
    [weekStartYmd]
  );

  // 선택된 주의 모든 날짜를 계산
  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const ymd = addDaysToKstYmd(weekStartYmd, i);
      dates.push(kstYmdToDateValue(ymd));
    }
    return dates;
  }, [weekStartYmd]);

  // 주의 모든 날짜가 포함된지 확인하는 함수
  const isWeekDate = (date: Date) => {
    const ymd = dateValueToKstYmd(date);
    return weekDates.some((weekDate) => dateValueToKstYmd(weekDate) === ymd);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="px-2 text-lg font-bold"
          aria-label="주 선택"
        >
          <CalendarIcon className="mr-2 h-5 w-5" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={currentDate}
          locale={ko}
          weekStartsOn={1}
          modifiers={{
            weekSelected: isWeekDate,
          }}
          onSelect={(date) => {
            if (date) {
              const ymd = dateValueToKstYmd(date);
              onChangeWeekStartYmd(normalizeToWeekStartYmd(ymd));
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
