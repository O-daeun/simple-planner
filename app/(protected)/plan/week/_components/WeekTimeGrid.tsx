"use client";

import { getThisWeekStartYmd, kstYmdToDateValue } from "@/lib/week";
import { addDays, format } from "date-fns";
import { useMemo, useState } from "react";
import { HOUR_H, MIN_PX, TIME_COL_W } from "./constants";
import DayColumn from "./DayColumn";
import type { EditingBlock, TimeBlock } from "./types";
import { useTimeBlocks } from "./useTimeBlocks";

type Props = {
  weekStartYmd: string; // YYYY-MM-DD (월요일)
};

export default function WeekTimeGrid({ weekStartYmd }: Props) {
  const { items, createBlock, updateBlock } = useTimeBlocks(weekStartYmd);
  const [editingBlock, setEditingBlock] = useState<EditingBlock | null>(null);

  const days = useMemo(() => {
    const safeWeekStart = weekStartYmd || getThisWeekStartYmd();
    const start = kstYmdToDateValue(safeWeekStart);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [weekStartYmd]);

  // 빈 셀 더블클릭: 클릭 위치에서 시간 계산하여 새 블록 생성
  // 단, 해당 시간대에 이미 일정이 있으면 새로 만들지 않음 (한 칸에 한 일정만)
  const handleEmptyCellDoubleClick = (
    e: React.MouseEvent<HTMLDivElement>,
    date: string
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const clickedMin = Math.max(
      0,
      Math.min(1439, Math.round(relativeY / MIN_PX))
    );
    const startMin = clickedMin;
    const endMin = Math.min(1440, clickedMin + 60); // 기본 1시간

    // 해당 날짜의 블록들 중 클릭한 시간대와 겹치는 블록이 있는지 확인
    const dayBlocks = items.filter((it) => it.date?.startsWith(date));
    const hasOverlap = dayBlocks.some((block) => {
      // 겹치는 조건: (block.startMin < endMin) && (block.endMin > startMin)
      return block.startMin < endMin && block.endMin > startMin;
    });

    // 이미 일정이 있으면 새로 만들지 않음
    if (hasOverlap) {
      return;
    }

    setEditingBlock({
      id: null,
      date,
      startMin,
      endMin,
      title: "",
      color: null,
    });
  };

  // 기존 블록 더블클릭: 편집 모드 진입
  const handleBlockDoubleClick = (block: TimeBlock) => {
    setEditingBlock({
      id: block.id,
      date: block.date,
      startMin: block.startMin,
      endMin: block.endMin,
      title: block.title,
      color: block.color ?? null,
    });
  };

  // 편집 중인 블록의 제목 변경
  const handleEditingTitleChange = (title: string) => {
    if (editingBlock) {
      setEditingBlock({ ...editingBlock, title });
    }
  };

  // 편집 중인 블록의 색상 변경
  const handleEditingColorChange = (color: string | null) => {
    if (editingBlock) {
      setEditingBlock({ ...editingBlock, color });
    }
  };

  // 저장
  const handleEditingSave = async (title: string) => {
    if (!editingBlock) return;

    try {
      if (editingBlock.id === null) {
        // 새 블록 생성
        await createBlock({
          date: editingBlock.date,
          startMin: editingBlock.startMin,
          endMin: editingBlock.endMin,
          title,
          color: editingBlock.color,
        });
      } else {
        // 기존 블록 수정
        await updateBlock(editingBlock.id, {
          title,
          color: editingBlock.color,
        });
      }
      setEditingBlock(null);
    } catch (error) {
      console.error("Failed to save block:", error);
      // 에러 발생 시에도 편집 모드는 종료 (사용자 경험)
      setEditingBlock(null);
    }
  };

  // 취소
  const handleEditingCancel = () => {
    setEditingBlock(null);
  };

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
          const dayBlocks = items.filter((it) => it.date?.startsWith(ymd));

          return (
            <DayColumn
              key={ymd}
              date={ymd}
              blocks={dayBlocks}
              editingBlock={editingBlock}
              onBlockDoubleClick={handleBlockDoubleClick}
              onEmptyCellDoubleClick={(e) => handleEmptyCellDoubleClick(e, ymd)}
              onEditingTitleChange={handleEditingTitleChange}
              onEditingColorChange={handleEditingColorChange}
              onEditingSave={handleEditingSave}
              onEditingCancel={handleEditingCancel}
            />
          );
        })}
      </div>
    </div>
  );
}
