import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider !== "google") return false;

      const googleSub = account.providerAccountId;

      await prisma.user.upsert({
        where: { googleSub },
        update: {
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          lastLoginAt: new Date(),
        },
        create: {
          googleSub,
          email: user.email,
          name: user.name,
          image: user.image,
          lastLoginAt: new Date(),
        },
      });

      return true;
    },

    async jwt({ token, account }) {
      if (account?.provider === "google") {
        const googleSub = account.providerAccountId;
        const dbUser = await prisma.user.findUnique({ where: { googleSub } });
        if (dbUser) (token as any).userId = dbUser.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) (session.user as any).id = (token as any).userId;
      return session;
    },
  },
});
