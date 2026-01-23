"use client";

import { useEffect, useRef, useState } from "react";
import { MIN_PX } from "./constants";
import ColorPicker from "./ColorPicker";
import type { TimeBlock } from "./types";

type Props = {
  block: TimeBlock;
  onDoubleClick: (block: TimeBlock) => void;
  isEditing: boolean;
  editingTitle: string;
  editingColor: string | null;
  onEditingTitleChange: (title: string) => void;
  onEditingColorChange: (color: string | null) => void;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export default function TimeBlockItem({
  block,
  onDoubleClick,
  isEditing,
  editingTitle,
  editingColor,
  onEditingTitleChange,
  onEditingColorChange,
  onSave,
  onCancel,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const top = block.startMin * MIN_PX;
  const height = Math.max(16, (block.endMin - block.startMin) * MIN_PX);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmedTitle = editingTitle.trim();
      if (trimmedTitle) {
        onSave(trimmedTitle);
      } else {
        onCancel();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    const trimmedTitle = editingTitle.trim();
    if (trimmedTitle) {
      onSave(trimmedTitle);
    } else {
      onCancel();
    }
  };

  if (isEditing) {
    // 편집 모드: 같은 위치에 textarea 렌더링
    const currentColor = editingColor ?? "#E5E7EB";
    const isDarkColor =
      currentColor !== null &&
      ["#6B7280", "#DC2626", "#EA580C", "#CA8A04", "#16A34A", "#2563EB", "#7C3AED"].includes(
        currentColor
      );
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
            className="flex h-6 w-6 items-center justify-center rounded border bg-background text-xs hover:bg-muted"
            title="색"
          >
            🎨
          </button>
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded border bg-background text-xs hover:bg-muted"
            title="반복"
          >
            🔁
          </button>
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded border bg-background text-xs hover:bg-muted"
            title="삭제"
          >
            🗑
          </button>
        </div>
        {/* 색상 선택 UI */}
        {showColorPicker && (
          <ColorPicker
            selectedColor={editingColor}
            onSelectColor={onEditingColorChange}
            onClose={() => setShowColorPicker(false)}
          />
        )}
        {/* 텍스트 입력 영역 */}
        <textarea
          ref={textareaRef}
          value={editingTitle}
          onChange={(e) => onEditingTitleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="border-primary bg-background focus:ring-primary absolute resize-none rounded-md border-2 px-2 py-1 text-xs focus:ring-2 focus:outline-none"
          style={{
            top: 28,
            width: "calc(100% - 0.5rem)",
            height: Math.max(60, height),
            borderLeft: `4px solid ${currentColor}`,
            backgroundColor: currentColor,
            color: textColor,
          }}
        />
      </div>
    );
  }

  // 일반 모드: 블록 렌더링
  const displayColor = block.color ?? "#E5E7EB";
  const isDarkColor =
    displayColor !== null &&
    ["#6B7280", "#DC2626", "#EA580C", "#CA8A04", "#16A34A", "#2563EB", "#7C3AED"].includes(
      displayColor
    );
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
