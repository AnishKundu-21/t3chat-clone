"use client";

import * as React from "react";
import type { Message } from "ai/react";

import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { Button } from "@/components/ui/button";

import { BookOpen, Code, Compass, Sparkles } from "lucide-react";
import { MODELS } from "@/app/page"; // Import the models constant

interface ChatPanelProps {
  messages: Message[];
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  userName: string;
  currentModel: string;
  setCurrentModel: (modelId: string) => void;
}

export function ChatPanel({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  userName,
  currentModel,
  setCurrentModel,
}: ChatPanelProps) {
  // The initial welcome message from the assistant doesn't count as a "real" message
  const isEmpty = messages.length <= 1;

  /* shared horizontal padding map */
  const padX = "px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16"; // phone · tablet · laptop · desktop

  return (
    <div className="relative flex h-full max-h-screen flex-col bg-background lg:border-l lg:border-border">
      {/* ───────── EMPTY STATE ───────── */}
      {isEmpty && !isLoading ? (
        <div
          className={`flex h-full flex-col items-center justify-center ${padX} py-6`}
        >
          <div className="mx-auto w-full max-w-2xl text-center">
            <h1 className="mb-8 text-2xl font-medium sm:text-3xl">
              How can I help you, {userName}?
            </h1>

            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {[Sparkles, Compass, Code, BookOpen].map((Icon, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="bg-background hover:bg-muted focus:outline-none focus:ring-0 focus:ring-offset-0"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {["Create", "Explore", "Code", "Learn"][i]}
                </Button>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 text-sm text-foreground/80">
              <button className="hover:underline">How does AI work?</button>
              <button className="hover:underline">Are black holes real?</button>
            </div>
          </div>
        </div>
      ) : (
        /* ───────── CHAT HISTORY ───────── */
        <div className={`flex-1 overflow-y-auto ${padX} py-6`}>
          {messages
            .filter((m) => m.role !== "system") // Don't render system messages
            .map((m, i) => (
              <ChatMessage key={m.id || i} role={m.role} content={m.content} />
            ))}
        </div>
      )}

      {/* sticky input w/ matching padding */}
      <div className={`sticky bottom-0 left-0 w-full ${padX} pb-4`}>
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          models={MODELS}
          currentModel={currentModel}
          setCurrentModel={setCurrentModel}
        />
      </div>
    </div>
  );
}
