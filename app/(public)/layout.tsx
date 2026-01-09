import { auth } from "@/auth";
import { ROUTES } from "@/lib/routes";
import { redirect } from "next/navigation";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const session = await auth();

  // 이미 로그인한 유저는 public 영역(예: /login) 접근 막고 플랜으로 이동
  if (session?.user?.id) {
    redirect(ROUTES.plan.day);
  }

  return <>{children}</>;
}
