import { isValidDateOnlyString, toDateOnly } from "@/lib/dateOnly";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/requireUserId";
import { isHexColor } from "@/lib/validators";
import { NextResponse } from "next/server";

type Params = {
  params: {
    id: string;
  };
};

export async function DELETE(_: Request, { params }: Params) {
  const guard = await requireUserId();
  if (!guard.ok) return guard.response;

  const { id } = params;

  // 1. 먼저 해당 TimeBlock이 "내 것"인지 확인
  const timeBlock = await prisma.timeBlock.findFirst({
    where: {
      id,
      userId: guard.userId,
    },
  });

  if (!timeBlock) {
    // 존재하지 않거나, 남의 데이터
    return NextResponse.json(
      { message: "TimeBlock not found" },
      { status: 404 }
    );
  }

  // 2. 삭제
  await prisma.timeBlock.delete({
    where: { id },
  });

  // 3. 성공 (본문 없음)
  return new NextResponse(null, { status: 204 });
}

type PatchTimeBlockBody = Partial<{
  date: string; // "YYYY-MM-DD"
  startMin: number;
  endMin: number;
  title: string;
  color: string | null; // null 허용(색상 제거)
}>;

// PATCH /api/time-blocks/[id]
export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireUserId();
  if (!guard.ok) return guard.response;

  const { id } = params;

  let body: PatchTimeBlockBody;
  try {
    body = (await req.json()) as PatchTimeBlockBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  // ✅ 먼저 "내 것"인지 확인
  const existing = await prisma.timeBlock.findFirst({
    where: { id, userId: guard.userId },
  });

  if (!existing) {
    return NextResponse.json(
      { message: "TimeBlock not found" },
      { status: 404 }
    );
  }

  // ✅ update data 만들기 (보낸 것만 반영)
  const data: Record<string, any> = {};

  if (body.date !== undefined) {
    if (!body.date || !isValidDateOnlyString(body.date)) {
      return NextResponse.json(
        { message: "date must be YYYY-MM-DD" },
        { status: 400 }
      );
    }
    data.date = toDateOnly(body.date);
  }

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

  // startMin / endMin은 "쌍" 검증이 필요해서 기존값과 합쳐서 검증
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

  // 둘 중 하나라도 변경 요청이 있었으면 시간 순서 검증
  if (body.startMin !== undefined || body.endMin !== undefined) {
    if (nextStartMin >= nextEndMin) {
      return NextResponse.json(
        { message: "startMin must be less than endMin" },
        { status: 400 }
      );
    }
  }

  // 아무것도 안 보냈으면 400
  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { message: "No fields to update" },
      { status: 400 }
    );
  }

  const updated = await prisma.timeBlock.update({
    where: { id },
    data,
  });

  return NextResponse.json({ item: updated }, { status: 200 });
}
