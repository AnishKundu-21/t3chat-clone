"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { ChatSession } from "@/types";

// UI Components
import { TooltipProvider } from "@/components/ui/tooltip";

// All our modular components
import { Sidebar } from "@/components/Sidebar";
import { ChatPanel } from "@/components/ChatPanel";
import { FloatingButtons } from "@/components/FloatingButtons";
import { SearchDialog } from "@/components/SearchDialog";
import { AuthDialog } from "@/components/AuthDialog"; // Import the new AuthDialog

// Define the initial chat session for when the app first loads
const initialChat: ChatSession = {
  id: uuidv4(),
  title: "Welcome Chat",
  messages: [{ role: "assistant", content: "Hello! How can I help you?" }],
  updatedAt: Date.now(),
};

export default function HomePage() {
  const { data: session } = useSession(); // Get session data to personalize the welcome message

  // --- STATE MANAGEMENT ---
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [chats, setChats] = React.useState<ChatSession[]>([initialChat]);
  const [currentChatId, setCurrentChatId] = React.useState(chats[0].id);
  const [input, setInput] = React.useState("");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  // THE KEY CHANGE: State to manage the AuthDialog's visibility
  const [isAuthDialogOpen, setIsAuthDialogOpen] = React.useState(false);

  // --- DERIVED STATE ---
  const currentChat = chats.find((chat) => chat.id === currentChatId)!;
  const isNewChat = currentChat.messages.length <= 1;

  // --- HANDLER FUNCTIONS ---
  const handleSend = () => { if (!input.trim()) return; const newMessage = { role: "user" as const, content: input }; const updatedMessages = [...currentChat.messages, newMessage]; const updatedChat: ChatSession = { ...currentChat, messages: updatedMessages, updatedAt: Date.now(), title: currentChat.messages.length === 1 ? input.slice(0, 40) : currentChat.title, }; setChats( (prev) => prev.map((chat) => (chat.id === currentChatId ? updatedChat : chat)).sort((a,b) => b.updatedAt - a.updatedAt) ); setInput(""); };
  const handleNewChat = () => { if (!isNewChat) { const newChat: ChatSession = { id: uuidv4(), title: "", messages: [{ role: "assistant", content: `Hello, ${session?.user?.name || 'there'}! How can I help you?` }], updatedAt: Date.now(), }; setChats((prev) => [newChat, ...prev]); setCurrentChatId(newChat.id); setInput(""); } };
  const handleSelectChat = (chatId: string) => { setCurrentChatId(chatId); setInput(""); };
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        {/* --- LEFT PANEL --- */}
        {isCollapsed ? (
          <FloatingButtons
            onToggle={toggleSidebar}
            isNewChat={isNewChat}
            onNewChat={handleNewChat}
            onSearchClick={() => setIsSearchOpen(true)}
          />
        ) : (
          <Sidebar
            onToggle={toggleSidebar}
            onNewChat={handleNewChat}
            chats={chats}
            currentChatId={currentChatId}
            onSelectChat={handleSelectChat}
            onOpenAuthDialog={() => setIsAuthDialogOpen(true)} // Pass the handler
          />
        )}

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1">
          <ChatPanel
            chat={currentChat}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            userName={session?.user?.name || "Anish"} // Personalize the panel
          />
        </main>
        
        {/* --- DIALOGS (Modals) --- */}
        <SearchDialog
          open={isSearchOpen}
          onOpenChange={setIsSearchOpen}
          chats={chats}
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
