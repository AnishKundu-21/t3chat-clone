import { OpenAIStream, StreamingTextResponse } from "ai";
import {
  Configuration,
  OpenAIApi,
  type CreateChatCompletionRequest,
} from "openai-edge";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// REMOVED: export const runtime = "edge";
// This API route will now run on the standard Node.js runtime.

const config = new Configuration({
  basePath: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { messages, model } = await req.json();

    const selectedModel = model || "google/gemma-2-9b-it:free";

    const chatCompletionRequest: CreateChatCompletionRequest = {
      model: selectedModel,
      stream: true,
      messages: messages,
    };

    const response = await openai.createChatCompletion(chatCompletionRequest, {
      headers: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "T3 Chat Clone",
      },
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("[CHAT_STREAM_ERROR]", error);
    const errorResponse = (error as any)?.response?.data || {
      message: "An unknown error occurred.",
    };
    return new NextResponse(JSON.stringify(errorResponse), {
      status: (error as any)?.response?.status || 500,
    });
  }
}
