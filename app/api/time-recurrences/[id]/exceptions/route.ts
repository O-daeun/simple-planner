import { isValidDateOnlyString, toDateOnly } from "@/lib/dateOnly";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/requireUserId";
import { NextResponse } from "next/server";

type Params = { params: { id: string } };

// GET /api/time-recurrences/[id]/exceptions
export async function GET(_: Request, { params }: Params) {
  const guard = await requireUserId();
  if (!guard.ok) return guard.response;

  const { id: recurrenceId } = params;

  // 먼저 해당 recurrence가 "내 것"인지 확인
  const recurrence = await prisma.timeBlockRecurrence.findFirst({
    where: { id: recurrenceId, userId: guard.userId },
    select: { id: true },
  });

  if (!recurrence) {
    return NextResponse.json(
      { message: "TimeBlockRecurrence not found" },
      { status: 404 }
    );
  }

  const items = await prisma.timeBlockRecurrenceException.findMany({
    where: { recurrenceId },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ items }, { status: 200 });
}

type CreateSkipExceptionBody = {
  date: string; // YYYY-MM-DD
};

// POST /api/time-recurrences/[id]/exceptions
// - 같은 date가 이미 있으면 그대로 반환(멱등)
export async function POST(req: Request, { params }: Params) {
  const guard = await requireUserId();
  if (!guard.ok) return guard.response;

  const { id: recurrenceId } = params;

  let body: CreateSkipExceptionBody;
  try {
    body = (await req.json()) as CreateSkipExceptionBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { date } = body;
  if (!date || !isValidDateOnlyString(date)) {
    return NextResponse.json(
      { message: "date must be YYYY-MM-DD" },
      { status: 400 }
    );
  }

  // recurrence가 "내 것"인지 확인
  const recurrence = await prisma.timeBlockRecurrence.findFirst({
    where: { id: recurrenceId, userId: guard.userId },
    select: { id: true },
  });

  if (!recurrence) {
    return NextResponse.json(
      { message: "TimeBlockRecurrence not found" },
      { status: 404 }
    );
  }

  const dateObj = toDateOnly(date);

  const existing = await prisma.timeBlockRecurrenceException.findFirst({
    where: { recurrenceId, date: dateObj },
  });

  if (existing) {
    // 이미 스킵 처리되어 있음(멱등)
    return NextResponse.json({ item: existing }, { status: 200 });
  }

  const created = await prisma.timeBlockRecurrenceException.create({
    data: { recurrenceId, date: dateObj },
  });

  return NextResponse.json({ item: created }, { status: 201 });
}

// DELETE /api/time-recurrences/[id]/exceptions?date=YYYY-MM-DD
export async function DELETE(req: Request, { params }: Params) {
  const guard = await requireUserId();
  if (!guard.ok) return guard.response;

  const { id: recurrenceId } = params;

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date || !isValidDateOnlyString(date)) {
    return NextResponse.json(
      { message: "Provide date=YYYY-MM-DD" },
      { status: 400 }
    );
  }

  // recurrence가 "내 것"인지 확인
  const recurrence = await prisma.timeBlockRecurrence.findFirst({
    where: { id: recurrenceId, userId: guard.userId },
    select: { id: true },
  });

  if (!recurrence) {
    return NextResponse.json(
      { message: "TimeBlockRecurrence not found" },
      { status: 404 }
    );
  }

  const existing = await prisma.timeBlockRecurrenceException.findFirst({
    where: { recurrenceId, date: toDateOnly(date) },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json(
      { message: "TimeBlockRecurrenceException not found" },
      { status: 404 }
    );
  }

  await prisma.timeBlockRecurrenceException.delete({
    where: { id: existing.id },
  });

  return new NextResponse(null, { status: 204 });
}
