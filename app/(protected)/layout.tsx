import { auth } from "@/auth";
import { ROUTES } from "@/lib/routes";
import { redirect } from "next/navigation";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const session = await auth();

  // 로그인 안 했으면 protected 전부 막기
  if (!session?.user?.id) {
    redirect(ROUTES.login);
  }

  return <>{children}</>;
}
