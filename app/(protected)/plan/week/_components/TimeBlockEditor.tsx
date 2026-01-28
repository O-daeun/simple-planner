"use client";

import { useEffect, useRef } from "react";
import { getPaletteEntry } from "./colorPalette";
import { minToPx } from "./constants";
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

  // editor 진입 시 텍스트 영역 포커스
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  // editor 외부 클릭 시 저장
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

  const top = minToPx(block.startMin);
  const height = Math.max(16, minToPx(block.endMin) - top);

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
        className="border-primary focus:ring-primary w-[calc(100%-0.5rem)] resize-none rounded-md border-2 px-2 py-1 text-xs focus:ring-2 focus:outline-none"
        style={{
          height,
          backgroundColor: getPaletteEntry(block.color).bg,
          color: getPaletteEntry(block.color).text,
        }}
      />
    </div>
  );
}
