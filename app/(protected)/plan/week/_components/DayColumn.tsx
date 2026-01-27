"use client";

import { HOUR_H } from "./constants";
import { useEditingBlockContext } from "./EditingBlockContext";
import TimeBlockEditor from "./TimeBlockEditor";
import TimeBlockItem from "./TimeBlockItem";
import type { TimeBlock } from "./types";

type Props = {
  date: string; // YYYY-MM-DD
  blocks: TimeBlock[];
};

export default function DayColumn({ date, blocks }: Props) {
  const {
    editingBlock,
    openEmptyCellEditor,
    updateEditingBlock,
    saveEditingBlock,
    cancelEditingBlock,
  } = useEditingBlockContext();
  const isEditingThisDay = editingBlock?.date?.startsWith(date) ?? false;

  return (
    <div
      className="relative border-r last:border-r-0"
      onDoubleClick={(e) => openEmptyCellEditor(e, date)}
    >
      {/* 시간 가로줄 */}
      {Array.from({ length: 24 }, (_, h) => (
        <div key={h} className="border-b" style={{ height: HOUR_H }} />
      ))}

      {/* 일정 블록들 */}
      {blocks.map((block) => {
        const isEditingBlock = editingBlock?.id === block.id;
        if (isEditingBlock) return null;

        return <TimeBlockItem key={block.id} block={block} />;
      })}

      {/* 편집 모드(새 블록/기존 블록 공통) */}
      {isEditingThisDay && editingBlock && (
        <TimeBlockEditor
          block={editingBlock}
          onChange={updateEditingBlock}
          onSave={saveEditingBlock}
          onCancel={cancelEditingBlock}
        />
      )}
    </div>
  );
}
