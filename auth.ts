import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" }, // ✅ 정석: 세션도 DB 저장
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn() {
      // ✅ 여기서 DB 직접 만지지 말기 (Adapter가 알아서 User/Account/Session 처리)
      return true;
    },
    async session({ session, user }) {
      // 편의: 프론트에서 user.id 쓰고 싶으면 넣어주기
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
});
