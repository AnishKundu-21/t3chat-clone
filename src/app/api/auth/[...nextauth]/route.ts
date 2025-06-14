import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Email and Password",
      // The credentials is used to generate a suitable form on the sign in page.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is where you provide the logic to find the user in your database.
        
        // Add logic here to look up the user from the credentials supplied
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.hashedPassword) {
          // No user was found, or they signed up with a social provider.
          return null;
        }

        // Use bcrypt to compare the provided password with the stored hashed password.
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (passwordsMatch) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
        }
      },
    }),
  ],
  session: {
    // Use JSON Web Tokens for session management
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
