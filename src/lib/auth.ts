import { auth } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Full Next-Auth session (if you need tokens, etc.)
 */
export async function getServerAuthSession() {
  return await auth();
}

/**
 * Returns the **database** User row for the
 * currently authenticated request, or null.
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  const email   = session?.user?.email;
  if (!email) return null;

  return prisma.user.findUnique({ where: { email } });
}
