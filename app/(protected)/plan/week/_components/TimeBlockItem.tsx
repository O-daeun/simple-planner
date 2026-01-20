"use client";

import { useEffect, useRef } from "react";
import { MIN_PX } from "./constants";
import type { TimeBlock } from "./types";

type Props = {
  block: TimeBlock;
  onDoubleClick: (block: TimeBlock) => void;
  isEditing: boolean;
  editingTitle: string;
  onEditingTitleChange: (title: string) => void;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export function TimeBlockItem({
  block,
  onDoubleClick,
  isEditing,
  editingTitle,
  onEditingTitleChange,
  onSave,
  onCancel,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    return (
      <textarea
        ref={textareaRef}
        value={editingTitle}
        onChange={(e) => onEditingTitleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="absolute right-1 left-1 rounded-md border-2 border-primary bg-background px-2 py-1 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primary z-10"
        style={{
          top,
          height: Math.max(60, height),
          borderLeft: `4px solid ${block.color ?? "#3b82f6"}`,
        }}
      />
    );
  }

  // 일반 모드: 블록 렌더링
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
