import { isValidDateOnlyString, toDateOnly } from "@/lib/dateOnly";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/requireUserId";
import { isHexColor } from "@/lib/validators";
import { NextResponse } from "next/server";

type Params = { params: { id: string } };

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

type PatchRecurrenceBody = Partial<{
  startMin: number;
  endMin: number;
  daysOfWeek: number[];
  startDate: string;
  untilDate: string | null; // null로 종료일 제거 가능
  title: string;
  color: string | null; // null/""로 제거 가능
}>;

// PATCH /api/time-recurrences/[id]
export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireUserId();
  if (!guard.ok) return guard.response;

  const { id } = params;

  let body: PatchRecurrenceBody;
  try {
    body = (await req.json()) as PatchRecurrenceBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const existing = await prisma.timeBlockRecurrence.findFirst({
    where: { id, userId: guard.userId },
  });
  if (!existing) {
    return NextResponse.json(
      { message: "TimeBlockRecurrence not found" },
      { status: 404 }
    );
  }

  const data: Record<string, any> = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json(
        { message: "title must be a non-empty string" },
        { status: 400 }
      );
    }
    if (body.title.trim().length > 100) {
      return NextResponse.json(
        { message: "title must be 100 characters or less" },
        { status: 400 }
      );
    }
    data.title = body.title.trim();
  }

  if (body.color !== undefined) {
    if (body.color === null || body.color === "") {
      data.color = null;
    } else {
      if (typeof body.color !== "string" || !isHexColor(body.color)) {
        return NextResponse.json(
          { message: "color must be #RRGGBB or null" },
          { status: 400 }
        );
      }
      data.color = body.color;
    }
  }

  if (body.daysOfWeek !== undefined) {
    if (!isValidDaysOfWeek(body.daysOfWeek)) {
      return NextResponse.json(
        { message: "daysOfWeek must be an array of unique integers 0~6" },
        { status: 400 }
      );
    }
    data.daysOfWeek = body.daysOfWeek;
  }

  const nextStartMin =
    body.startMin !== undefined ? body.startMin : existing.startMin;
  const nextEndMin = body.endMin !== undefined ? body.endMin : existing.endMin;

  if (body.startMin !== undefined) {
    if (!Number.isInteger(body.startMin)) {
      return NextResponse.json(
        { message: "startMin must be an integer" },
        { status: 400 }
      );
    }
    if (body.startMin < 0 || body.startMin > 1439) {
      return NextResponse.json(
        { message: "startMin must be 0~1439" },
        { status: 400 }
      );
    }
    data.startMin = body.startMin;
  }

  if (body.endMin !== undefined) {
    if (!Number.isInteger(body.endMin)) {
      return NextResponse.json(
        { message: "endMin must be an integer" },
        { status: 400 }
      );
    }
    if (body.endMin < 1 || body.endMin > 1440) {
      return NextResponse.json(
        { message: "endMin must be 1~1440" },
        { status: 400 }
      );
    }
    data.endMin = body.endMin;
  }

  if (body.startMin !== undefined || body.endMin !== undefined) {
    if (nextStartMin >= nextEndMin) {
      return NextResponse.json(
        { message: "startMin must be less than endMin" },
        { status: 400 }
      );
    }
  }

  // 날짜
  const existingStartDateStr = existing.startDate.toISOString().slice(0, 10);
  const existingUntilDateStr = existing.untilDate
    ? existing.untilDate.toISOString().slice(0, 10)
    : null;

  const nextStartDateStr =
    body.startDate !== undefined ? body.startDate : existingStartDateStr;

  const nextUntilDateStr =
    body.untilDate !== undefined ? body.untilDate : existingUntilDateStr;

  if (body.startDate !== undefined) {
    if (!body.startDate || !isValidDateOnlyString(body.startDate)) {
      return NextResponse.json(
        { message: "startDate must be YYYY-MM-DD" },
        { status: 400 }
      );
    }
    data.startDate = toDateOnly(body.startDate);
  }

  if (body.untilDate !== undefined) {
    if (body.untilDate === null || body.untilDate === "") {
      data.untilDate = null;
    } else {
      if (!isValidDateOnlyString(body.untilDate)) {
        return NextResponse.json(
          { message: "untilDate must be YYYY-MM-DD or null" },
          { status: 400 }
        );
      }
      data.untilDate = toDateOnly(body.untilDate);
    }
  }

  if (nextUntilDateStr && nextUntilDateStr < nextStartDateStr) {
    return NextResponse.json(
      { message: "untilDate must be the same or after startDate" },
      { status: 400 }
    );
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { message: "No fields to update" },
      { status: 400 }
    );
  }

  const updated = await prisma.timeBlockRecurrence.update({
    where: { id },
    data,
  });

  return NextResponse.json({ item: updated }, { status: 200 });
}

// DELETE /api/time-recurrences/[id]
export async function DELETE(_: Request, { params }: Params) {
  const guard = await requireUserId();
  if (!guard.ok) return guard.response;

  const { id } = params;

  const existing = await prisma.timeBlockRecurrence.findFirst({
    where: { id, userId: guard.userId },
  });

  if (!existing) {
    return NextResponse.json(
      { message: "TimeBlockRecurrence not found" },
      { status: 404 }
    );
  }

  await prisma.timeBlockRecurrence.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
