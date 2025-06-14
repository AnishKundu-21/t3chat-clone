"use client";

import useSWR, { mutate as globalMutate } from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  title: string | null;
  messages: ChatMessage[];
  updatedAt: string;
}

/**
 * Fetch a single chat and expose a `sendMessage` helper that
 * works even while the thread is still loading (true optimistic
 * update).  Invalidates the chat-list cache on each send.
 */
export function useChat(chatId: string | null) {
  const key = chatId ? `/api/chat/${chatId}` : null;

  const {
    data,
    error,
    isLoading,
    mutate, // SWR mutate for this chat
  } = useSWR<ChatThread>(key, fetcher, {
    revalidateOnFocus: false,
  });

  // ------------------------------------------------------------
  async function sendMessage(
    role: "user" | "assistant",
    content: string
  ): Promise<void> {
    if (!chatId) return;

    // synthetic optimistic entry
    const optimisticMsg: ChatMessage = {
      id: "temp-" + Date.now(),
      role,
      content,
      createdAt: new Date().toISOString(),
    };

    // optimistic chat object if we’re still loading
    const optimisticChat: ChatThread = data ?? {
      id: chatId,
      title: null,
      messages: [],
      updatedAt: new Date().toISOString(),
    };

    // ---- optimistic UI update --------------------------------
    await mutate(
      {
        ...optimisticChat,
        messages: [...optimisticChat.messages, optimisticMsg],
        updatedAt: new Date().toISOString(),
      },
      { revalidate: false }
    );

    // ---- persist to server -----------------------------------
    const res = await fetch(`/api/chat/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, content }),
    });

    if (!res.ok) {
      // roll back to server state
      await mutate();
      throw new Error("Failed to send message");
    }

    // ---- re-fetch authoritative data -------------------------
    await mutate();
    // also refresh the chat list (it uses updatedAt ordering)
    globalMutate("/api/chat");
  }

  return {
    chat: data,
    isLoading,
    isError: !!error,
    sendMessage,
    mutate,
  };
}
