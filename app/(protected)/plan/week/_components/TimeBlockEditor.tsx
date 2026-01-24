"use client";

import { useEffect, useRef, useState } from "react";
import ColorPicker from "./ColorPicker";
import { MIN_PX } from "./constants";
import type { EditingBlock } from "./types";

type Props = {
  block: EditingBlock;
  onTitleChange: (title: string) => void;
  onColorChange: (color: string | null) => void;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export default function TimeBlockEditor({
  block,
  onTitleChange,
  onColorChange,
  onSave,
  onCancel,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  const commitCancel = () => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    onCancel();
  };

  const commitSave = () => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    const trimmedTitle = block.title.trim();
    if (trimmedTitle) {
      onSave(trimmedTitle);
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commitSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      commitCancel();
    }
    // Shift + Enter는 기본 동작(줄바꿈) 그대로
  };

  const top = block.startMin * MIN_PX;
  const height = Math.max(60, (block.endMin - block.startMin) * MIN_PX);
  const currentColor = block.color ?? "#E5E7EB";
  const isDarkColor =
    currentColor !== null &&
    [
      "#6B7280",
      "#DC2626",
      "#EA580C",
      "#CA8A04",
      "#16A34A",
      "#2563EB",
      "#7C3AED",
    ].includes(currentColor);
  const textColor = isDarkColor ? "#FFFFFF" : "#1F2937";

  return (
    <div className="absolute right-1 left-1 z-10" style={{ top }}>
      {/* 색/반복/삭제 아이콘 영역 */}
      <div className="mb-1 flex gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker(!showColorPicker);
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
          onSelectColor={onColorChange}
          onClose={() => setShowColorPicker(false)}
        />
      )}
      {/* 텍스트 입력 영역 */}
      <textarea
        ref={textareaRef}
        value={block.title}
        onChange={(e) => onTitleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitSave}
        className="border-primary focus:ring-primary absolute resize-none rounded-md border-2 px-2 py-1 text-xs focus:ring-2 focus:outline-none"
        style={{
          top: 28,
          width: "calc(100% - 0.5rem)",
          height,
          borderLeft: `4px solid ${currentColor}`,
          backgroundColor: currentColor,
          color: textColor,
        }}
      />
    </div>
  );
}
