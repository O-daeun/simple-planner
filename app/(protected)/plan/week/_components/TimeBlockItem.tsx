"use client";

import { getPaletteEntry } from "./colorPalette";
import { MIN_PX } from "./constants";
import { useEditingBlockContext } from "./EditingBlockContext";
import type { TimeBlock } from "./types";

type Props = {
  block: TimeBlock;
};

export default function TimeBlockItem({ block }: Props) {
  const { openEditBlock } = useEditingBlockContext();
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
        openEditBlock(block);
      }}
    >
      <div className="line-clamp-2 font-medium">{block.title}</div>
    </div>
  );
}
