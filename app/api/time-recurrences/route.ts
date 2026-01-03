import { isValidDateOnlyString, toDateOnly } from "@/lib/dateOnly";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/requireUserId";
import { isHexColor } from "@/lib/validators";
import { NextResponse } from "next/server";

function isValidDaysOfWeek(v: unknown): v is number[] {
  if (!Array.isArray(v) || v.length === 0) return false;
  const seen = new Set<number>();
  for (const x of v) {
    if (!Number.isInteger(x)) return false;
    if (x < 0 || x > 6) return false;
    if (seen.has(x)) return false;
    seen.add(x);
  }
  return true;
}

// GET /api/time-recurrences
export async function GET() {
  const guard = await requireUserId();
  if (!guard.ok) return guard.response;

  const items = await prisma.timeBlockRecurrence.findMany({
    where: { userId: guard.userId },
    orderBy: [{ startDate: "asc" }, { startMin: "asc" }],
    include: {
      exceptions: {
        orderBy: { date: "asc" },
      },
    },
  });

  return NextResponse.json({ items }, { status: 200 });
}

type CreateRecurrenceBody = {
  startMin: number;
  endMin: number;
  daysOfWeek: number[]; // 0=일 ... 6=토
  startDate: string; // YYYY-MM-DD
  untilDate?: string | null; // YYYY-MM-DD | null
  title: string;
  color?: string | null; // "#RRGGBB" | null
};

// POST /api/time-recurrences
export async function POST(req: Request) {
  const guard = await requireUserId();
  if (!guard.ok) return guard.response;

  let body: CreateRecurrenceBody;
  try {
    body = (await req.json()) as CreateRecurrenceBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { startMin, endMin, daysOfWeek, startDate, untilDate, title, color } =
    body;

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

  if (!isValidDaysOfWeek(daysOfWeek)) {
    return NextResponse.json(
      { message: "daysOfWeek must be an array of unique integers 0~6" },
      { status: 400 }
    );
  }

  if (!startDate || !isValidDateOnlyString(startDate)) {
    return NextResponse.json(
      { message: "startDate is required (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  let until: string | null = null;
  if (untilDate !== undefined) {
    if (untilDate === null || untilDate === "") {
      until = null;
    } else {
      if (!isValidDateOnlyString(untilDate)) {
        return NextResponse.json(
          { message: "untilDate must be YYYY-MM-DD or null" },
          { status: 400 }
        );
      }
      until = untilDate;
    }
  }

  if (until && until < startDate) {
    return NextResponse.json(
      { message: "untilDate must be the same or after startDate" },
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

  const created = await prisma.timeBlockRecurrence.create({
    data: {
      userId: guard.userId,
      startMin,
      endMin,
      daysOfWeek,
      startDate: toDateOnly(startDate),
      untilDate: until ? toDateOnly(until) : null,
      title: title.trim(),
      color: color && color !== "" ? color : null,
    },
  });

  return NextResponse.json({ item: created }, { status: 201 });
}
