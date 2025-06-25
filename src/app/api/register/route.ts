// src/app/api/register/route.ts
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"          // <- your Prisma client

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    /* basic validation */
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    /* email already in use? */
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 409 },
      )
    }

    /* hash password & save */
    const hashed = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword: hashed,
      },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error("[REGISTER]", err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
