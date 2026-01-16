"use client";

import { useState } from "react";
import { getThisWeekStartYmd } from "@/lib/week";
import WeekHeader from "./WeekHeader";
import WeekTimeGrid from "./WeekTimeGrid";

export default function WeekClient() {
  const [weekStartYmd, setWeekStartYmd] = useState(() => getThisWeekStartYmd());

  return (
    <div className="flex flex-col gap-3">
      <WeekHeader
        weekStartYmd={weekStartYmd}
        onChangeWeekStartYmd={setWeekStartYmd}
      />
      <WeekTimeGrid weekStartYmd={weekStartYmd} />
    </div>
  );
}


