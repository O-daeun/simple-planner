import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // DB 연결 확인용으로 가벼운 쿼리 1번
  await prisma.user.findFirst();

  return NextResponse.json({ ok: true });
}
