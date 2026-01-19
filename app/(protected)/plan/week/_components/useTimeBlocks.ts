import { addDaysToKstYmd, getThisWeekStartYmd } from "@/lib/week";
import { useEffect, useState } from "react";
import type { TimeBlock } from "./types";

export function useTimeBlocks(weekStartYmd: string) {
  const [items, setItems] = useState<TimeBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const startDate = weekStartYmd || getThisWeekStartYmd();
  const endDate = addDaysToKstYmd(startDate, 6);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/time-blocks?startDate=${startDate}&endDate=${endDate}`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = await res.json();
        setItems(data.items ?? []);
      } catch (error) {
        console.error("Failed to fetch time blocks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [startDate, endDate]);

  const createBlock = async (block: Omit<TimeBlock, "id">) => {
    try {
      const res = await fetch("/api/time-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(block),
      });

      if (!res.ok) {
        throw new Error("Failed to create block");
      }

      const data = await res.json();
      setItems((prev) => [...prev, data.item]);
      return data.item;
    } catch (error) {
      console.error("Error creating block:", error);
      throw error;
    }
  };

  const updateBlock = async (id: string, updates: Partial<TimeBlock>) => {
    try {
      const res = await fetch(`/api/time-blocks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error("Failed to update block");
      }

      const data = await res.json();
      setItems((prev) =>
        prev.map((it) => (it.id === id ? data.item : it))
      );
      return data.item;
    } catch (error) {
      console.error("Error updating block:", error);
      throw error;
    }
  };

  return {
    items,
    isLoading,
    createBlock,
    updateBlock,
    refetch: () => {
      // 간단한 refetch는 useEffect가 자동으로 처리
    },
  };
}
