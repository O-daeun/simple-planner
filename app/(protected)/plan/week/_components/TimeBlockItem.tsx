"use client";

import { getPaletteEntry } from "./colorPalette";
import { MIN_PX } from "./constants";
import type { TimeBlock } from "./types";

type Props = {
  block: TimeBlock;
  onDoubleClick: (block: TimeBlock) => void;
};

export default function TimeBlockItem({ block, onDoubleClick }: Props) {
  const top = block.startMin * MIN_PX;
  const height = Math.max(16, (block.endMin - block.startMin) * MIN_PX);

  return (
    <div
      className="absolute right-1 left-1 cursor-pointer rounded-md border px-2 py-1 text-xs transition-colors hover:opacity-80"
      style={{
        top,
        height,
        backgroundColor: getPaletteEntry(block.color).bg,
        color: getPaletteEntry(block.color).text,
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
