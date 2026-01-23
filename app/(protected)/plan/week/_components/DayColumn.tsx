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
  const isEditingThisDay = editingBlock?.date === date;
  const isNewBlock = editingBlock?.id === null;

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
      {blocks.map((block) => (
        <TimeBlockItem
          key={block.id}
          block={block}
          onDoubleClick={onBlockDoubleClick}
          isEditing={editingBlock?.id === block.id}
          editingTitle={editingBlock?.title ?? ""}
          editingColor={editingBlock?.color ?? null}
          onEditingTitleChange={onEditingTitleChange}
          onEditingColorChange={onEditingColorChange}
          onSave={onEditingSave}
          onCancel={onEditingCancel}
        />
      ))}

      {/* 새 블록 편집 모드 (기존 블록이 아닌 경우에만) */}
      {isEditingThisDay && isNewBlock && editingBlock && (
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
