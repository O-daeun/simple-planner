export type TimeBlock = {
  id: string;
  date: string; // "YYYY-MM-DD"
  startMin: number;
  endMin: number;
  title: string;
  color?: string | null;
};

export type EditingBlock = {
  id: string | null; // null이면 새 블록 생성, 있으면 수정
  date: string;
  startMin: number;
  endMin: number;
  title: string;
  color?: string | null;
};
