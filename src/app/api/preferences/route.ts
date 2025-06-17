import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

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
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        data: body,
      },
      update: {
        data: body,
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Server error", { status: 500 });
  }
}
