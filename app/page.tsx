import { auth } from "@/auth";
import { LoginButton } from "./_components/LoginButton";

export default async function Page() {
  const session = await auth();

  return (
    <main style={{ padding: 24 }}>
      <h1>Simple Planner</h1>
      <LoginButton isAuthed={!!session} />
      <pre style={{ marginTop: 16 }}>{JSON.stringify(session, null, 2)}</pre>
    </main>
  );
}
