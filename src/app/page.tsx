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

import { useChats, type ChatListItem } from "@/hooks/useChats";
import { useChat as useSwrChat } from "@/hooks/useChat";

/* ─────────────────────────────────────────────────────────────────── */

// Models are loaded from user preferences / OpenRouter
export const MODELS: Array<{ id: string; name: string }> = [];

export default function HomePage() {
  const { data: session } = useSession();
  const loggedIn = !!session;

  /* UI state --------------------------------------------------------- */
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = React.useState(false);
  const [availableModels, setAvailableModels] = React.useState<
    Array<{ id: string; name: string }>
  >([]);
  const [currentModel, setCurrentModel] = React.useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = React.useState(false);
  const lastUsedModelRef = React.useRef<string | null>(null);

  /* Remote list + active thread -------------------------------------- */
  const { chats: remoteChats, mutate: mutateChats } = useChats();
  const [currentChatId, setCurrentChatId] = React.useState<string | null>(null);
  const chatIdRef = React.useRef<string | null>(null);
  const savedChatIdRef = React.useRef<string | null>(null);
  const createdFirstChatRef = React.useRef<boolean>(false);
  React.useEffect(() => {
    chatIdRef.current = currentChatId;
  }, [currentChatId]);

  // Restore last active chat from localStorage (avoid jumping to newest)
  React.useLayoutEffect(() => {
    if (!loggedIn) return;
    try {
      const saved = window.localStorage.getItem("activeChatId");
      if (saved) {
        savedChatIdRef.current = saved;
        setCurrentChatId((prev) => prev ?? saved);
      }
    } catch {}
  }, [loggedIn]);

  // Persist active chat selection
  React.useEffect(() => {
    if (!loggedIn) return;
    try {
      if (currentChatId) {
        window.localStorage.setItem("activeChatId", currentChatId);
      }
    } catch {}
  }, [loggedIn, currentChatId]);

  // First-time visit: if there's no saved active chat, auto-create a new chat
  React.useEffect(() => {
    if (!loggedIn) return;
    (async () => {
      try {
        const saved =
          savedChatIdRef.current ||
          (typeof window !== "undefined"
            ? window.localStorage.getItem("activeChatId")
            : null);
        if (saved) return; // user has a saved chat; keep it
        if (createdFirstChatRef.current) return; // already created this session
        if (currentChatId) return; // something already selected

        createdFirstChatRef.current = true;
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (res.ok) {
          const created = await res.json();
          const newId = created?.id as string | null;
          if (newId) {
            setCurrentChatId(newId);
            try {
              window.localStorage.setItem("activeChatId", newId);
              savedChatIdRef.current = newId;
            } catch {}
            await mutateChats();
          }
        }
      } catch {}
    })();
  }, [loggedIn, currentChatId, mutateChats]);

  // Early hydrate currentModel from localStorage (per chat) to avoid placeholder flash
  React.useEffect(() => {
    try {
      const keyPrefix = currentChatId
        ? `chat:${currentChatId}:`
        : "chat:global:";
      const stored = window.localStorage.getItem(`${keyPrefix}lastUsedModel`);
      if (stored && typeof stored === "string") setCurrentModel(stored);
    } catch {}
  }, [currentChatId]);

  // SWR hook to fetch initial messages for the selected chat
  const {
    chat: initialChatData,
    sendMessage: sendThreadMessage,
    mutate: mutateThread,
  } = useSwrChat(currentChatId);

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
    body: currentModel ? { model: currentModel } : undefined,
    // When a new message is streamed and finished, save it to the DB
    async onFinish(message: Message) {
      const id = chatIdRef.current;
      if (!id) return;
      // Persist assistant message
      try {
        await fetch(`/api/chat/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "assistant", content: message.content }),
        });
      } catch {}

      await mutateChats();
    },
  });

  /* Guest chat local state ------------------------------------------- */
  const [guestMessages, setGuestMessages] = React.useState<Message[]>([]);
  const [guestInput, setGuestInput] = React.useState("");
  const [guestLoading, setGuestLoading] = React.useState(false);

  const GUEST_REPLY =
    "You’re using the demo chat. Please sign in, add your OpenRouter API key in Settings > API Keys, and select models in Settings > Models to start chatting with real models.";

  function guestHandleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setGuestInput(e.target.value);
  }

  async function guestHandleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const content = guestInput.trim();
    if (!content || guestLoading) return;

    const userMsg: Message = {
      id: `guest-${Date.now()}-u`,
      role: "user",
      content,
    };
    setGuestMessages((prev) => [...prev, userMsg]);
    setGuestInput("");
    setGuestLoading(true);

    // Simulate a short delay then respond with the canned message
    setTimeout(() => {
      const assistantMsg: Message = {
        id: `guest-${Date.now()}-a`,
        role: "assistant",
        content: GUEST_REPLY,
      };
      setGuestMessages((prev) => [...prev, assistantMsg]);
      setGuestLoading(false);
    }, 300);
  }

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

  /* Auto-select logic: prefer saved active chat; fallback to newest */
  React.useEffect(() => {
    if (!loggedIn || remoteChats.length === 0) return;

    const currentExists = currentChatId
      ? remoteChats.some((c) => c.id === currentChatId)
      : false;
    if (currentExists) return;

    const saved =
      savedChatIdRef.current ||
      (typeof window !== "undefined"
        ? window.localStorage.getItem("activeChatId")
        : null);
    if (saved && remoteChats.some((c) => c.id === saved)) {
      setCurrentChatId(saved);
      return;
    }
    // Fallback: pick newest
    setCurrentChatId(remoteChats[0].id);
  }, [loggedIn, remoteChats, currentChatId]);

  /* Load models from OpenRouter for signed-in users ------------------ */
  React.useEffect(() => {
    let cancelled = false;
    async function loadModels() {
      if (!loggedIn) {
        setAvailableModels([]);
        setCurrentModel(null);
        setHasApiKey(false);
        return;
      }
      try {
        const prefsRes = await fetch("/api/preferences", { cache: "no-store" });
        const prefs = prefsRes.ok ? await prefsRes.json() : {};
        const key = (prefs as any)?.openrouterApiKey as string | undefined;
        setHasApiKey(
          !!(key && typeof key === "string" && key.trim().length > 0)
        );
        // Prefer per-chat last used from localStorage; fallback to user prefs
        let lastUsed = (prefs as any)?.lastUsedModel as string | undefined;
        try {
          const keyPrefix = currentChatId
            ? `chat:${currentChatId}:`
            : "chat:global:";
          const stored = window.localStorage.getItem(
            `${keyPrefix}lastUsedModel`
          );
          if (stored) lastUsed = stored;
        } catch {}
        lastUsedModelRef.current = lastUsed ?? null;

        // Only fetch models if a key exists
        let list: Array<{ id: string; name: string }> = [];
        if (key && key.trim()) {
          const modelsRes = await fetch("/api/models", { cache: "no-store" });
          if (modelsRes.ok) {
            list = (await modelsRes.json()) as Array<{
              id: string;
              name: string;
            }>;
          }
        }
        if (cancelled) return;
        if (Array.isArray(list) && list.length > 0) {
          // Only show models explicitly selected in Settings > Models
          const selected: string[] = Array.isArray(
            (prefs as any)?.selectedModels
          )
            ? (prefs as any).selectedModels
            : [];
          const filtered = selected.length
            ? list.filter((m) => selected.includes(m.id))
            : [];
          setAvailableModels(filtered);
          // Prefer last used if present; else pick the first available to avoid placeholder
          const lu = lastUsedModelRef.current;
          let nextModel: string | null = null;
          if (lu && filtered.some((m) => m.id === lu)) {
            nextModel = lu;
          } else if (filtered.length > 0) {
            nextModel = filtered[0].id;
          } else {
            nextModel = null;
          }
          setCurrentModel(nextModel);
          // Persist choice for consistent defaults next time
          if (nextModel) {
            try {
              await fetch("/api/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lastUsedModel: nextModel }),
              });
              lastUsedModelRef.current = nextModel;
              try {
                const keyPrefix = currentChatId
                  ? `chat:${currentChatId}:`
                  : "chat:global:";
                window.localStorage.setItem(
                  `${keyPrefix}lastUsedModel`,
                  nextModel
                );
                const modelName = filtered.find(
                  (m) => m.id === nextModel
                )?.name;
                if (modelName) {
                  window.localStorage.setItem(
                    `${keyPrefix}lastUsedModelLabel`,
                    modelName
                  );
                }
              } catch {}
            } catch {}
          }
        } else {
          setAvailableModels([]);
          setCurrentModel(null);
        }
      } catch {
        if (cancelled) return;
        setAvailableModels([]);
        setCurrentModel(null);
        setHasApiKey(false);
      }
    }
    loadModels();
    return () => {
      cancelled = true;
    };
  }, [loggedIn]);

  // Handle send for cases with missing key/model by replying with guidance
  async function handleSubmitUnified(e: React.FormEvent<HTMLFormElement>) {
    if (!loggedIn) {
      // Demo flow
      return guestHandleSubmit(e);
    }

    const needsModel = !currentModel || availableModels.length === 0;
    const needsKey = !hasApiKey;
    if (needsModel || needsKey) {
      e.preventDefault();
      const content = input.trim();
      if (!content) return;

      // Clear input via synthetic change event
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleInputChange({ target: { value: "" } } as any);

      const userMsg: Message = {
        id: `local-${Date.now()}-u`,
        role: "user",
        content,
      };
      const advice = needsKey
        ? "Please add your OpenRouter API key in Settings > API Keys and select models in Settings > Models, then try again."
        : "Please select a model in Settings > Models, then send your message again.";
      const assistantMsg: Message = {
        id: `local-${Date.now()}-a`,
        role: "assistant",
        content: advice,
      };
      setMessages([...messages, userMsg, assistantMsg]);

      // Persist to thread when available
      // Persist to thread (ensure chat exists, then write both messages)
      try {
        let chatId = currentChatId;
        if (!chatId) {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
          if (res.ok) {
            const created = await res.json();
            chatId = created?.id as string | null;
            if (chatId) {
              setCurrentChatId(chatId);
            }
          }
        }
        if (chatId) {
          const post = (role: "user" | "assistant", text: string) =>
            fetch(`/api/chat/${chatId}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role, content: text }),
            });

          let userOk = false;
          try {
            const r1 = await post("user", content);
            userOk = r1.ok;
            if (!r1.ok) {
              // one quick retry
              const r1b = await post("user", content);
              userOk = r1b.ok;
            }
          } catch {}

          // Post assistant guidance regardless, so the hint appears
          try {
            await post("assistant", advice);
          } catch {}

          if (mutateThread) await mutateThread();
          await mutateChats();

          // Load authoritative messages and update local state
          try {
            const getRes = await fetch(`/api/chat/${chatId}`);
            if (getRes.ok) {
              const chatJson = await getRes.json();
              if (chatJson?.messages) {
                const newMessages = chatJson.messages.map((msg: any) => ({
                  id: msg.id,
                  role: msg.role,
                  content: msg.content,
                }));
                setMessages(newMessages);
              }
            }
          } catch {}
        }
      } catch {
        // ignore errors
      }
      return;
    }

    // Normal behavior: persist the user message before streaming
    e.preventDefault();
    const content = input.trim();
    if (!content) return;

    try {
      let chatId = currentChatId;
      if (!chatId) {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (res.ok) {
          const created = await res.json();
          chatId = created?.id as string | null;
          if (chatId) {
            setCurrentChatId(chatId);
          }
        }
      }
      if (chatId) {
        await fetch(`/api/chat/${chatId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "user", content }),
        });
      }
    } catch {}

    // Now start streaming; handleSubmit reads from `input` state
    return handleSubmit(e);
  }

  /* ─────────────────────  ACTIONS  ───────────────────── */

  async function handleNewChat() {
    if (!loggedIn) {
      // Start a fresh guest chat with an immediate helper message
      setCurrentChatId(null);
      setGuestMessages([
        {
          id: `guest-${Date.now()}`,
          role: "assistant",
          content:
            "Welcome! This is a demo chat. Sign in and add your API keys in Settings > API Keys to use real models.",
        },
      ]);
      setGuestInput("");
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
    try {
      window.localStorage.setItem("activeChatId", id);
      savedChatIdRef.current = id;
    } catch {}
  }

  /* ─────────────  RENDER  ───────────── */
  const sidebarOpen = !isCollapsed;

  const chatPanelProps = {
    chatId: currentChatId,
    messages: loggedIn ? messages : guestMessages,
    input: loggedIn ? input : guestInput,
    handleInputChange: loggedIn ? handleInputChange : guestHandleInputChange,
    handleSubmit: handleSubmitUnified,
    isLoading: loggedIn ? isAiChatLoading : guestLoading,
    userName: session?.user?.name ?? "Guest",
    models: availableModels,
    currentModel: currentModel,
    setCurrentModel: async (modelId: string) => {
      setCurrentModel(modelId);
      // Persist last used model in user preferences
      try {
        await fetch("/api/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lastUsedModel: modelId }),
        });
        lastUsedModelRef.current = modelId;
        // Also persist locally for immediate UX on reload
        try {
          const keyPrefix = currentChatId
            ? `chat:${currentChatId}:`
            : "chat:global:";
          window.localStorage.setItem(`${keyPrefix}lastUsedModel`, modelId);
          const modelName = availableModels.find((m) => m.id === modelId)?.name;
          if (modelName) {
            window.localStorage.setItem(
              `${keyPrefix}lastUsedModelLabel`,
              modelName
            );
          }
        } catch {}
      } catch {}
    },
  };

  const effectiveMessages = loggedIn ? messages : guestMessages;
  const isNewChat = effectiveMessages.length <= 1;

  const searchDialogChats = remoteChats;

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
          <ChatPanel {...chatPanelProps} />
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
