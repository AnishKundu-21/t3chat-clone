import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    // --- Basic Input Validation ---
    if (!email || !name || !password) {
      return new NextResponse("Missing name, email, or password", { status: 400 });
    }

    // --- Check if user already exists ---
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return new NextResponse("User with this email already exists", { status: 409 }); // 409 Conflict
    }

    // --- Hash the password ---
    const hashedPassword = await bcrypt.hash(password, 12);

    // --- Create the user in the database ---
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    // --- Return the created user (without the password) ---
    return NextResponse.json(user);

  } catch (error: any) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
