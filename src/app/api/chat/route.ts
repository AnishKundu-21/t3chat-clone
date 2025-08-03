import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

// ------------------------------------------------------------------
// GET /api/chat
// Returns all chats that belong to the authenticated user.
// ------------------------------------------------------------------
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const chats = await prisma.chat.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(chats);
}

// ------------------------------------------------------------------
// POST /api/chat
// Creates a new empty chat for the authenticated user.
// The welcome message is no longer added here.
// Body (JSON, optional): { title?: string }
// ------------------------------------------------------------------
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { title = "" } = body;

  // Create the chat without any initial messages
  const chat = await prisma.chat.create({
    data: {
      userId: user.id,
      title,
    },
  });

  return NextResponse.json(chat, { status: 201 });
}
