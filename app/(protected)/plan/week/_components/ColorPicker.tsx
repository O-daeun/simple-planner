"use client";

import type { PaletteColor } from "./colorPalette";
import { COLOR_PALETTE } from "./colorPalette";

type Props = {
  selectedColor: PaletteColor | null;
  onSelectColor: (color: PaletteColor | null) => void;
  onClose: () => void;
};

export default function ColorPicker({
  selectedColor,
  onSelectColor,
  onClose,
}: Props) {
  return (
    <div className="bg-background absolute bottom-0 left-0 z-20 rounded-md border p-3 shadow-lg">
      <div className="mb-2 text-xs font-medium">색 선택</div>
      <div className="grid grid-cols-7 gap-2">
        {COLOR_PALETTE.map((color, idx) => {
          const isSelected = selectedColor?.bg === color.bg;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSelectColor(color);
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
    </div>
  );
}
