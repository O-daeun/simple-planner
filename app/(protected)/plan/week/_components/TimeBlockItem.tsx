"use client";

import { MIN_PX } from "./constants";
import type { TimeBlock } from "./types";

type Props = {
  block: TimeBlock;
  onDoubleClick: (block: TimeBlock) => void;
  isEditing: boolean;
};

export function TimeBlockItem({ block, onDoubleClick, isEditing }: Props) {
  const top = block.startMin * MIN_PX;
  const height = Math.max(16, (block.endMin - block.startMin) * MIN_PX);

  if (isEditing) {
    return null; // 편집 중이면 렌더링하지 않음
  }

  return (
    <div
      className="bg-muted/60 hover:bg-muted/80 absolute right-1 left-1 cursor-pointer rounded-md border px-2 py-1 text-xs transition-colors"
      style={{
        top,
        height,
        borderLeft: `4px solid ${block.color ?? "#3b82f6"}`,
      }}
      title={`${block.title} (${block.startMin}-${block.endMin})`}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick(block);
      }}
    >
      <div className="line-clamp-2 font-medium">{block.title}</div>
    </div>
  );
}
