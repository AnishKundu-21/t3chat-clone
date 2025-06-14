"use client";

import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatSession } from "@/types";

// UI Components
import { TooltipProvider } from "@/components/ui/tooltip";

// All our new, modular components
import { Sidebar } from "@/components/Sidebar";
import { ChatPanel } from "@/components/ChatPanel";
import { FloatingButtons } from "@/components/FloatingButtons";
import { SearchDialog } from "@/components/SearchDialog";

// Define the initial chat session for when the app first loads
const initialChat: ChatSession = {
  id: uuidv4(),
  title: "Welcome Chat",
  messages: [{ role: "assistant", content: "Hello! How can I help you, Anish?" }],
  updatedAt: Date.now(),
};

export default function HomePage() {
  // --- STATE MANAGEMENT ---
  // Manages if the sidebar is open or closed
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  // Holds the list of all chat sessions
  const [chats, setChats] = React.useState<ChatSession[]>([initialChat]);
  // Keeps track of which chat is currently active
  const [currentChatId, setCurrentChatId] = React.useState(chats[0].id);
  // Holds the text in the chat input box
  const [input, setInput] = React.useState("");
  // Manages if the floating search window is open
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  // --- DERIVED STATE ---
  // Find the full object for the currently active chat
  const currentChat = chats.find((chat) => chat.id === currentChatId)!;
  // Determine if the current chat is "new" (for disabling buttons)
  const isNewChat = currentChat.messages.length <= 1;

  // --- HANDLER FUNCTIONS ---

  // Function to send a message
  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = { role: "user" as const, content: input };
    const updatedMessages = [...currentChat.messages, newMessage];
    const updatedChat: ChatSession = {
      ...currentChat,
      messages: updatedMessages,
      updatedAt: Date.now(),
      // If this is the first user message, set it as the chat title
      title: currentChat.messages.length === 1 ? input.slice(0, 40) : currentChat.title,
    };
    // Update the chats array and sort by most recently updated
    setChats(
      (prev) => prev.map((chat) => (chat.id === currentChatId ? updatedChat : chat)).sort((a,b) => b.updatedAt - a.updatedAt)
    );
    setInput("");
  };

  // Function to create a new chat session
  const handleNewChat = () => {
    if (!isNewChat) {
      const newChat: ChatSession = {
        id: uuidv4(),
        title: "",
        messages: [{ role: "assistant", content: "Hello! How can I help you, Anish?" }],
        updatedAt: Date.now(),
      };
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      setInput("");
    }
  };

  // Function to select a chat from the list
  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setInput("");
  };

  // Function to toggle the sidebar's visibility
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Conditionally render the Sidebar or the Floating Buttons */}
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
          />
        )}

        {/* The main content panel */}
        <main className="flex-1">
          <ChatPanel
            chat={currentChat}
            input={input}
            setInput={setInput}
            onSend={handleSend}
          />
        </main>
        
        {/* The search dialog, which is only visible when its state is open */}
        <SearchDialog
          open={isSearchOpen}
          onOpenChange={setIsSearchOpen}
          chats={chats}
          onSelectChat={handleSelectChat}
        />
      </div>
    </TooltipProvider>
  );
}
