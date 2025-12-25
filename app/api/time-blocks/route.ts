import { auth } from "@/auth"; // 너가 NextAuth/Auth.js 설정한 auth export에 맞게
import { prisma } from "@/lib/prisma"; // 너 프로젝트 경로에 맞게
import { NextResponse } from "next/server";

function isValidDateString(v: string) {
  // YYYY-MM-DD
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function toDateOnly(dateStr: string) {
  // "YYYY-MM-DD" -> Date
  // DB가 @db.Date라 날짜만 의미 있음
  return new Date(dateStr);
}

// GET /api/time-blocks
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const date = searchParams.get("date");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // ✅ 1) 단일 날짜 조회
  if (date) {
    if (!isValidDateString(date)) {
      return NextResponse.json(
        { message: "date must be YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const items = await prisma.timeBlock.findMany({
      where: { userId: session.user.id, date: toDateOnly(date) },
      orderBy: { startMin: "asc" },
    });

    return NextResponse.json({ items }, { status: 200 });
  }

  // ✅ 2) 기간 조회 (주간용)
  if (startDate && endDate) {
    if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
      return NextResponse.json(
        { message: "startDate/endDate must be YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const items = await prisma.timeBlock.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: toDateOnly(startDate),
          lte: toDateOnly(endDate),
        },
      },
      orderBy: [{ date: "asc" }, { startMin: "asc" }],
    });

    return NextResponse.json({ items }, { status: 200 });
  }

  return NextResponse.json(
    { message: "Provide either date=YYYY-MM-DD or startDate/endDate" },
    { status: 400 }
  );
}

type CreateTimeBlockBody = {
  date: string; // "YYYY-MM-DD"
  startMin: number; // 0~1439
  endMin: number; // 1~1440
  title: string;
  color?: string | null; // "#RRGGBB"
};

function isHexColor(v: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(v);
}

// POST /api/time-blocks
export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: CreateTimeBlockBody;
  try {
    body = (await req.json()) as CreateTimeBlockBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { date, startMin, endMin, title, color } = body;

  // --- validation ---
  if (!date || !isValidDateString(date)) {
    return NextResponse.json(
      { message: "date is required (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  if (!Number.isInteger(startMin) || !Number.isInteger(endMin)) {
    return NextResponse.json(
      { message: "startMin/endMin must be integers" },
      { status: 400 }
    );
  }

  if (startMin < 0 || startMin > 1439 || endMin < 1 || endMin > 1440) {
    return NextResponse.json(
      { message: "startMin must be 0~1439 and endMin must be 1~1440" },
      { status: 400 }
    );
  }

  if (startMin >= endMin) {
    return NextResponse.json(
      { message: "startMin must be less than endMin" },
      { status: 400 }
    );
  }

  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ message: "title is required" }, { status: 400 });
  }

  if (title.trim().length > 100) {
    return NextResponse.json(
      { message: "title must be 100 characters or less" },
      { status: 400 }
    );
  }

  if (color != null && color !== "" && !isHexColor(color)) {
    return NextResponse.json(
      { message: "color must be a hex string like #RRGGBB" },
      { status: 400 }
    );
  }

  // Prisma @db.Date 컬럼: 날짜만 의미 있게 저장/비교됨
  const dateObj = new Date(date);

  const created = await prisma.timeBlock.create({
    data: {
      userId: session.user.id,
      date: dateObj,
      startMin,
      endMin,
      title: title.trim(),
      color: color && color !== "" ? color : null,
    },
  });

  return NextResponse.json({ item: created }, { status: 201 });
}
