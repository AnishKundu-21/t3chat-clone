import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

const prisma = new PrismaClient();

/* ── helper ───────────────────────────────────────────── */
async function getOwnedChat(chatId: string, userId: string) {
  return prisma.chat.findFirst({ where: { id: chatId, userId } });
}

/* ─────────────────────────────────────────────────────── */
/* GET  /api/chat/[id]  – unchanged                       */
/* ─────────────────────────────────────────────────────── */
export async function GET(_req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const chat = await prisma.chat.findFirst({
    where: { id: params.id, userId: user.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!chat) return new NextResponse("Not found", { status: 404 });

  return NextResponse.json(chat);
}

/* ─────────────────────────────────────────────────────── */
/* POST /api/chat/[id]  – Append message + auto-title      */
/* ─────────────────────────────────────────────────────── */
export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const chat = await getOwnedChat(params.id, user.id);
  if (!chat) return new NextResponse("Not found", { status: 404 });

  const { role, content } = await req.json();

  if (
    (role !== "user" && role !== "assistant") ||
    typeof content !== "string" ||
    !content.trim()
  ) {
    return new NextResponse("Invalid payload", { status: 400 });
  }

  /* 1. create the new message */
  const message = await prisma.chatMessage.create({
    data: { chatId: chat.id, role, content },
  });

  /* 2. maybe set a title the first time the USER speaks */
  const shouldSetTitle =
    !chat.title && role === "user"; // still unnamed & user message

  await prisma.chat.update({
    where: { id: chat.id },
    data: {
      updatedAt: new Date(),
      title: shouldSetTitle ? content.slice(0, 40) : chat.title,
    },
  });

  return NextResponse.json(message, { status: 201 });
}

/* ─────────────────────────────────────────────────────── */
/* DELETE /api/chat/[id] – optional, unchanged             */
/* ─────────────────────────────────────────────────────── */
export async function DELETE(_req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const chat = await getOwnedChat(params.id, user.id);
  if (!chat) return new NextResponse("Not found", { status: 404 });

  await prisma.chat.delete({ where: { id: chat.id } });
  return new NextResponse(null, { status: 204 });
}
