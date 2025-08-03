/* ───────────────────────── src/app/page.tsx ───────────────────────── */
"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useChat as useAiChat, type Message } from "ai/react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import { FloatingButtons } from "@/components/FloatingButtons";
import { SearchDialog } from "@/components/SearchDialog";
import { AuthDialog } from "@/components/AuthDialog";
import { ChatPanel } from "@/components/ChatPanel";
import { Button } from "@/components/ui/button"; // Added missing import

import { useChats, type ChatListItem } from "@/hooks/useChats";
import { useChat as useSwrChat } from "@/hooks/useChat";

/* ─────────────────────────────────────────────────────────────────── */

// The list of models you provided
export const MODELS = [
  { id: "google/gemma-3n-e2b-it:free", name: "Google Gemma 3" },
  { id: "z-ai/glm-4.5-air:free", name: "Z-AI GLM-4.5" },
  { id: "qwen/qwen3-coder:free", name: "Qwen3 Coder" },
  { id: "moonshotai/kimi-k2:free", name: "Kimi K2" },
  { id: "deepseek/deepseek-r1-0528-qwen3-8b:free", name: "DeepSeek R1 Qwen3" },
  { id: "moonshotai/kimi-dev-72b:free", name: "Kimi Dev" },
  { id: "deepseek/deepseek-r1-0528:free", name: "DeepSeek R1" },
  { id: "qwen/qwen3-235b-a22b:free", name: "Qwen3 235B" },
  { id: "deepseek/deepseek-chat-v3-0324:free", name: "DeepSeek Chat V3" },
  { id: "google/gemma-3-27b-it:free", name: "Google Gemma 3 27B" },
];

export default function HomePage() {
  const { data: session } = useSession();
  const loggedIn = !!session;

  /* UI state --------------------------------------------------------- */
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = React.useState(false);
  const [currentModel, setCurrentModel] = React.useState(MODELS[0].id);

  /* Remote list + active thread -------------------------------------- */
  const { chats: remoteChats, mutate: mutateChats } = useChats();
  const [currentChatId, setCurrentChatId] = React.useState<string | null>(null);

  // SWR hook to fetch initial messages for the selected chat
  const { chat: initialChatData } = useSwrChat(currentChatId);

  // Vercel AI SDK hook for managing the chat, streaming, and input state
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading: isAiChatLoading,
  } = useAiChat({
    api: "/api/chat/stream",
    id: currentChatId ?? undefined,
    body: {
      model: currentModel,
    },
    // When a new message is streamed and finished, save it to the DB
    async onFinish(message: Message) {
      if (!currentChatId) return;

      await fetch(`/api/chat/${currentChatId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "assistant", content: message.content }),
      });
      await mutateChats();
    },
  });

  // When a new chat is selected from the sidebar, load its messages
  React.useEffect(() => {
    if (initialChatData?.messages) {
      // Map the messages to the type expected by the `ai` package
      const newMessages = initialChatData.messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
      }));
      setMessages(newMessages);
    }
  }, [initialChatData, setMessages]);

  /* Auto-select newest chat when list first loads -------------------- */
  React.useEffect(() => {
    if (loggedIn && !currentChatId && remoteChats.length) {
      setCurrentChatId(remoteChats[0].id);
    }
  }, [loggedIn, remoteChats, currentChatId]);

  /* ─────────────────────  ACTIONS  ───────────────────── */

  async function handleNewChat() {
    if (!loggedIn) {
      setIsAuthDialogOpen(true);
      return;
    }

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ welcome: "Hello! How can I help you today?" }),
    });

    if (!res.ok) {
      console.error("Failed to create new chat");
      return;
    }

    const newChat = await res.json();
    await mutateChats();
    setCurrentChatId(newChat.id);
    setMessages(newChat.messages);
  }

  async function handleDeleteChat(id: string) {
    if (!loggedIn) return;

    const res = await fetch(`/api/chat/${id}`, { method: "DELETE" });
    if (!res.ok) {
      console.error("Failed to delete chat");
      return;
    }

    await mutateChats();
    if (currentChatId === id) {
      const newest = remoteChats.filter((c) => c.id !== id)[0];
      setCurrentChatId(newest ? newest.id : null);
    }
  }

  function handleSelectChat(id: string) {
    setCurrentChatId(id);
  }

  /* ─────────────  RENDER  ───────────── */
  const sidebarOpen = !isCollapsed;

  const chatPanelProps = {
    chatId: currentChatId,
    messages: messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isAiChatLoading,
    userName: session?.user?.name ?? "User",
    models: MODELS,
    currentModel: currentModel,
    setCurrentModel: setCurrentModel,
  };

  const isNewChat = messages.length <= 1;

  // The SearchDialog expects a `messages` property which `ChatListItem` doesn't have.
  // We can cast to `any` for now as a temporary fix. The correct fix is to update SearchDialog props.
  const searchDialogChats = remoteChats as any;

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        {sidebarOpen && (
          <Sidebar
            onToggle={() => setIsCollapsed(true)}
            onNewChat={handleNewChat}
            currentChatId={currentChatId}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
          />
        )}

        <FloatingButtons
          sidebarOpen={sidebarOpen}
          onToggle={() => setIsCollapsed((prev) => !prev)}
          isNewChat={isNewChat}
          onNewChat={handleNewChat}
          onSearchClick={() => setIsSearchOpen(true)}
        />

        <main className="flex-1">
          {loggedIn ? (
            <ChatPanel {...chatPanelProps} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Button onClick={() => setIsAuthDialogOpen(true)}>
                Sign In to Start Chatting
              </Button>
            </div>
          )}
        </main>

        <SearchDialog
          open={isSearchOpen}
          onOpenChange={setIsSearchOpen}
          chats={searchDialogChats}
          onSelectChat={handleSelectChat}
        />

        <AuthDialog
          open={isAuthDialogOpen}
          onOpenChange={setIsAuthDialogOpen}
        />
      </div>
    </TooltipProvider>
  );
}
