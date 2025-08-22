import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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

  const body = await req.json().catch(() => ({} as any));
  const { title = "", welcome } = body as {
    title?: string;
    welcome?: string;
  };

  // Create the chat without any initial messages
  const chat = await prisma.chat.create({
    data: {
      userId: user.id,
      title,
    },
  });

  let messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
  }> = [];
  if (typeof welcome === "string" && welcome.trim().length > 0) {
    const msg = await prisma.chatMessage.create({
      data: { chatId: chat.id, role: "assistant", content: welcome.trim() },
    });
    messages = [{ id: msg.id, role: "assistant", content: msg.content }];
  }

  return NextResponse.json(
    {
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messages,
    },
    { status: 201 }
  );
}
