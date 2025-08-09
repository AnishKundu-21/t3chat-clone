import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Require auth to read a user's models (uses their key when set)
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  // Require user key (no env fallback)
  const pref = await prisma.userPreference.findUnique({
    where: { userId: user.id },
  });
  const userKey = (pref?.data as any)?.openrouterApiKey as string | undefined;
  const apiKey = (userKey && userKey.trim()) || "";
  if (!apiKey)
    return new NextResponse("OpenRouter API key not configured for this user", {
      status: 400,
    });

  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "T3 Chat Clone",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return new NextResponse(text || "Failed to fetch models", {
        status: res.status,
      });
    }

    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : [];
    const models = list
      .filter((m: any) => !!m?.id)
      .map((m: any) => ({ id: String(m.id), name: String(m?.name || m.id) }));

    return NextResponse.json(models);
  } catch (e: any) {
    console.error("[MODELS_API_ERROR]", e);
    return new NextResponse("Server error fetching models", { status: 500 });
  }
}
