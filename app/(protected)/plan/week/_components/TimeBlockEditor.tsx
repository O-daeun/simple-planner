"use client";

import { useEffect, useRef } from "react";
import { MIN_PX } from "./constants";
import type { EditingBlock } from "./types";

type Props = {
  block: EditingBlock;
  onTitleChange: (title: string) => void;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export default function TimeBlockEditor({
  block,
  onTitleChange,
  onSave,
  onCancel,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
    // Shift + Enter는 기본 동작(줄바꿈) 그대로
  };

  const handleSave = () => {
    const trimmedTitle = block.title.trim();
    if (trimmedTitle) {
      onSave(trimmedTitle);
    } else {
      onCancel();
    }
  };

  const top = block.startMin * MIN_PX;
  const height = Math.max(60, (block.endMin - block.startMin) * MIN_PX);

  return (
    <textarea
      ref={textareaRef}
      value={block.title}
      onChange={(e) => onTitleChange(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleSave}
      className="absolute right-1 left-1 rounded-md border-2 border-primary bg-background px-2 py-1 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primary z-10"
      style={{
        top,
        height,
        borderLeft: `4px solid ${block.color ?? "#3b82f6"}`,
      }}
    />
  );
}
