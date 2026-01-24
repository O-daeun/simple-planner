"use client";

import { HOUR_H } from "./constants";
import TimeBlockEditor from "./TimeBlockEditor";
import TimeBlockItem from "./TimeBlockItem";
import type { EditingBlock, TimeBlock } from "./types";

type Props = {
  date: string; // YYYY-MM-DD
  blocks: TimeBlock[];
  editingBlock: EditingBlock | null;
  onBlockDoubleClick: (block: TimeBlock) => void;
  onEmptyCellDoubleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onEditingTitleChange: (title: string) => void;
  onEditingColorChange: (color: string | null) => void;
  onEditingSave: (title: string) => void;
  onEditingCancel: () => void;
};

export default function DayColumn({
  date,
  blocks,
  editingBlock,
  onBlockDoubleClick,
  onEmptyCellDoubleClick,
  onEditingTitleChange,
  onEditingColorChange,
  onEditingSave,
  onEditingCancel,
}: Props) {
  const isEditingThisDay = editingBlock?.date?.startsWith(date) ?? false;

  return (
    <div
      className="relative border-r last:border-r-0"
      onDoubleClick={onEmptyCellDoubleClick}
    >
      {/* 시간 가로줄 */}
      {Array.from({ length: 24 }, (_, h) => (
        <div key={h} className="border-b" style={{ height: HOUR_H }} />
      ))}

      {/* 일정 블록들 */}
      {blocks.map((block) => {
        const isEditingBlock = editingBlock?.id === block.id;
        console.log(isEditingBlock);
        if (isEditingBlock) return null;

        return (
          <TimeBlockItem
            key={block.id}
            block={block}
            onDoubleClick={onBlockDoubleClick}
          />
        );
      })}

      {/* 편집 모드(새 블록/기존 블록 공통) */}
      {isEditingThisDay && editingBlock && (
        <TimeBlockEditor
          block={editingBlock}
          onTitleChange={onEditingTitleChange}
          onColorChange={onEditingColorChange}
          onSave={onEditingSave}
          onCancel={onEditingCancel}
        />
      )}
    </div>
  );
}
