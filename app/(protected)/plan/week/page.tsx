import WeekHeader from "./_components/WeekHeader";
import WeekTimeGrid from "./_components/WeekTimeGrid";

export default function WeekPage() {
  return (
    <div className="flex flex-col gap-3">
      <WeekHeader />
      <WeekTimeGrid />
    </div>
  );
}
