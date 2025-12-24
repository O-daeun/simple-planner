import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: {
    id: string;
  };
};

export async function DELETE(_: Request, { params }: Params) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  // 1. 먼저 해당 TimeBlock이 "내 것"인지 확인
  const timeBlock = await prisma.timeBlock.findFirst({
    where: {
      id,
      userId: session.user.id,
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
