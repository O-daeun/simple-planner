import { auth } from "@/auth"; // 너가 NextAuth/Auth.js 설정한 auth export에 맞게
import { prisma } from "@/lib/prisma"; // 너 프로젝트 경로에 맞게
import { NextResponse } from "next/server";

function isValidDateString(v: string) {
  // YYYY-MM-DD
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date"); // "2025-12-22"

  if (!dateStr || !isValidDateString(dateStr)) {
    return NextResponse.json(
      { message: "date query is required (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  // Prisma @db.Date 필드라 "날짜만" 들어가면 됨
  // Date("YYYY-MM-DD")는 UTC 기준으로 만들어지지만, DATE 컬럼이라 결국 date-only로 저장/비교됨.
  const date = new Date(dateStr);

  const items = await prisma.timeBlock.findMany({
    where: {
      userId: session.user.id,
      date,
    },
    orderBy: { startMin: "asc" },
  });

  return NextResponse.json({ items }, { status: 200 });
}
