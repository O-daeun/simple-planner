import { Button } from "@/components/ui/button";
import { getKstTodayDateValue } from "@/lib/kst";
import { addDays, format, startOfWeek } from "date-fns";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export default function WeekHeader() {
  const todayKst = getKstTodayDateValue();
  const start = startOfWeek(todayKst, { weekStartsOn: 1 }); // 월요일 시작
  const end = addDays(start, 6);

  const label = `${format(start, "yyyy.MM.dd")} ~ ${format(end, "yyyy.MM.dd")}`;

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-medium">{label}</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button variant="outline">
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
