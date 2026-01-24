"use client";

import { MIN_PX } from "./constants";
import type { TimeBlock } from "./types";

type Props = {
  block: TimeBlock;
  onDoubleClick: (block: TimeBlock) => void;
};

export default function TimeBlockItem({ block, onDoubleClick }: Props) {
  const top = block.startMin * MIN_PX;
  const height = Math.max(16, (block.endMin - block.startMin) * MIN_PX);

  // 일반 모드: 블록 렌더링
  const displayColor = block.color ?? "#E5E7EB";
  const isDarkColor =
    displayColor !== null &&
    [
      "#6B7280",
      "#DC2626",
      "#EA580C",
      "#CA8A04",
      "#16A34A",
      "#2563EB",
      "#7C3AED",
    ].includes(displayColor);
  const textColor = isDarkColor ? "#FFFFFF" : "#1F2937";

  return (
    <div
      className="absolute right-1 left-1 cursor-pointer rounded-md border px-2 py-1 text-xs transition-colors hover:opacity-80"
      style={{
        top,
        height,
        borderLeft: `4px solid ${displayColor}`,
        backgroundColor: displayColor,
        color: textColor,
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
