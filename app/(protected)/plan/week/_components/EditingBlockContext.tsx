"use client";

import { createContext, useContext } from "react";
import type { EditingBlock, TimeBlock } from "./types";

type EditingBlockContextValue = {
  editingBlock: EditingBlock | null;
  openEmptyCellEditor: (
    e: React.MouseEvent<HTMLDivElement>,
    date: string
  ) => void;
  openEditBlock: (block: TimeBlock) => void;
  updateEditingBlock: (patch: Partial<EditingBlock>) => void;
  saveEditingBlock: (title: string) => void;
  cancelEditingBlock: () => void;
};

const EditingBlockContext = createContext<EditingBlockContextValue | null>(
  null
);

type ProviderProps = {
  value: EditingBlockContextValue;
  children: React.ReactNode;
};

export function EditingBlockProvider({ value, children }: ProviderProps) {
  return (
    <EditingBlockContext.Provider value={value}>
      {children}
    </EditingBlockContext.Provider>
  );
}

export function useEditingBlockContext() {
  const context = useContext(EditingBlockContext);
  if (!context) {
    throw new Error(
      "useEditingBlockContext must be used within EditingBlockProvider"
    );
  }
  return context;
}
