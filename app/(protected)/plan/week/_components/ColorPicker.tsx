"use client";

import { COLOR_PALETTE } from "./colorPalette";

type Props = {
  selectedColor: string | null;
  onSelectColor: (color: string | null) => void;
  onClose: () => void;
};

export default function ColorPicker({
  selectedColor,
  onSelectColor,
  onClose,
}: Props) {
  return (
    <div className="absolute -top-20 left-0 z-20 rounded-md border bg-background p-3 shadow-lg">
      <div className="mb-2 text-xs font-medium">색 선택</div>
      <div className="grid grid-cols-7 gap-2">
        {COLOR_PALETTE.map((color, idx) => {
          const colorValue = color.bg;
          const isSelected = selectedColor === colorValue;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSelectColor(colorValue);
                onClose();
              }}
              className={`h-6 w-6 rounded-full border-2 transition-all ${
                isSelected ? "border-primary scale-110" : "border-border"
              }`}
              style={{ backgroundColor: color.bg }}
              title={color.name}
            />
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => {
          onSelectColor(null);
          onClose();
        }}
        className="mt-2 w-full rounded border px-2 py-1 text-xs hover:bg-muted"
      >
        기본값
      </button>
    </div>
  );
}
