"use client";

import { Button } from "@/components/ui/button";
import { addDaysToKstYmd } from "@/lib/week";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import WeekDatePicker from "./WeekDatePicker";

interface WeekHeaderProps {
  weekStartYmd: string; // YYYY-MM-DD (월요일)
  onChangeWeekStartYmd: (nextWeekStartYmd: string) => void;
}

export default function WeekHeader({
  weekStartYmd,
  onChangeWeekStartYmd,
}: WeekHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <WeekDatePicker
          weekStartYmd={weekStartYmd}
          onChangeWeekStartYmd={onChangeWeekStartYmd}
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
