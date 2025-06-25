import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  /* ---------- Adapter ---------- */
  adapter: PrismaAdapter(prisma),

  /* ---------- Providers ---------- */
  providers: [
    /* Google OAuth ---------------- */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    /* Email / Password ------------ */
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user?.hashedPassword) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword,
        )
        return valid ? user : null
      },
    }),
  ],

  /* ---------- Session + Cookies ---------- */
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  /* ---------- Callbacks ---------- */
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id
      return token
    },
    async session({ session, token }) {
      if (token.sub && session.user) session.user.id = token.sub
      return session
    },
  },

  /* ---------- Pages / Misc ---------- */
  pages: {
    signIn: "/login", // use our full-screen login page
  },
  secret: process.env.AUTH_SECRET,
})
