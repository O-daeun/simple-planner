"use client";

import { useEffect, useRef } from "react";
import { MIN_PX } from "./constants";
import TimeBlockEditorToolbar from "./TimeBlockEditorToolbar";
import type { EditingBlock } from "./types";

type Props = {
  block: EditingBlock;
  onChange: (patch: Partial<EditingBlock>) => void;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export default function TimeBlockEditor({
  block,
  onChange,
  onSave,
  onCancel,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  // 텍스트 영역 외부 클릭 시 저장
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (hasSubmittedRef.current) return;
      const target = event.target as Node | null;
      if (
        containerRef.current &&
        target &&
        !containerRef.current.contains(target)
      ) {
        commitSave();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
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
    <div
      ref={containerRef}
      className="absolute right-1 left-1 z-10"
      style={{ top }}
    >
      <TimeBlockEditorToolbar block={block} onChange={onChange} />
      {/* 텍스트 입력 영역 */}
      <textarea
        ref={textareaRef}
        value={block.title}
        onChange={(e) => onChange({ title: e.target.value })}
        onKeyDown={handleKeyDown}
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
