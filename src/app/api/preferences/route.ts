import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });

  try {
    const pref = await prisma.userPreference.findUnique({
      where: { userId: session.user.id },
    });
    return pref
      ? NextResponse.json(pref.data)
      : new NextResponse("Not found", { status: 404 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Server error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const existing = await prisma.userPreference.findUnique({
      where: { userId: session.user.id },
    });

    const merged = {
      ...(existing?.data as Record<string, unknown> | undefined),
      ...(body as Record<string, unknown>),
    } as Record<string, unknown> as Prisma.InputJsonValue;

    await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        data: merged,
      },
      update: {
        data: merged,
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Server error", { status: 500 });
  }
}
