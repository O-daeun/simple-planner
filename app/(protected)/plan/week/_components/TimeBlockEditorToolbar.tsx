"use client";

import { useState } from "react";
import ColorPicker from "./ColorPicker";
import type { EditingBlock } from "./types";

type Props = {
  block: EditingBlock;
  onChange: (patch: Partial<EditingBlock>) => void;
};

export default function TimeBlockEditorToolbar({ block, onChange }: Props) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <>
      {/* 색/반복/삭제 아이콘 영역 */}
      <div className="absolute top-0 mb-1 flex gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker((prev) => !prev);
          }}
          className="bg-background hover:bg-muted flex h-6 w-6 items-center justify-center rounded border text-xs"
          title="색"
        >
          🎨
        </button>
        <button
          type="button"
          className="bg-background hover:bg-muted flex h-6 w-6 items-center justify-center rounded border text-xs"
          title="반복"
        >
          🔁
        </button>
        <button
          type="button"
          className="bg-background hover:bg-muted flex h-6 w-6 items-center justify-center rounded border text-xs"
          title="삭제"
        >
          🗑
        </button>
      </div>
      {/* 색상 선택 UI */}
      {showColorPicker && (
        <ColorPicker
          selectedColor={block.color ?? null}
          onSelectColor={(color) => onChange({ color })}
          onClose={() => setShowColorPicker(false)}
        />
      )}
    </>
  );
}
