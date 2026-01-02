import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function requireUserId() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      ok: false as const,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true as const, userId };
}
