import { auth } from "@/auth";
import { ROUTES } from "@/lib/routes";
import { redirect } from "next/navigation";
import LoginButton from "./_components/LoginButton";

export default async function LoginPage() {
  const session = await auth();

  if (session) redirect(ROUTES.plan.day);

  return (
    <main>
      <h1>Simple Planner</h1>
      <LoginButton isAuthed={!!session} />
    </main>
  );
}
