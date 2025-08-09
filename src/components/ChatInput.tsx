"use client";

import * as React from "react";
import { default as Textarea } from "react-textarea-autosize";
import { ArrowUp, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelOption {
  id: string;
  name: string;
}

interface ChatInputProps {
  chatId: string | null;
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  models: ModelOption[];
  currentModel: string | null;
  setCurrentModel: (modelId: string) => void;
}

export function ChatInput({
  chatId,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  models,
  currentModel,
  setCurrentModel,
}: ChatInputProps) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const hasModels = models && models.length > 0;
  const selectedLabel = React.useMemo(() => {
    const fromList = models.find((m) => m.id === currentModel)?.name;
    if (fromList) return fromList;
    // Fallback to per-chat localStorage to avoid placeholder flash on reload
    try {
      const keyPrefix = chatId ? `chat:${chatId}:` : "chat:global:";
      const storedLabel = window.localStorage.getItem(
        `${keyPrefix}lastUsedModelLabel`
      );
      if (storedLabel) return storedLabel;
    } catch {}
    return undefined;
  }, [models, currentModel, chatId]);
  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-3xl px-4 py-4"
    >
      {/* frosted glass shell – identical to sidebar theme */}
      <div
        className="relative rounded-xl border border-white/25 bg-white/30 p-2 shadow-lg
                   backdrop-blur-md backdrop-saturate-150 dark:border-white/30 dark:bg-white/10"
      >
        <Textarea
          rows={1}
          maxRows={8}
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.ctrlKey &&
              !e.altKey &&
              !e.metaKey &&
              // avoid sending during IME composition
              !(e as unknown as { nativeEvent?: { isComposing?: boolean } })
                .nativeEvent?.isComposing
            ) {
              // Only send if there's content and not loading
              if (input.trim() && !isLoading) {
                e.preventDefault();
                // Submit the form programmatically
                try {
                  formRef.current?.requestSubmit();
                } catch {
                  // Fallback: create a synthetic submit
                  formRef.current?.dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true })
                  );
                }
              }
            }
          }}
          placeholder={
            hasModels
              ? "Type your message here…"
              : "Add models in Settings > Models to start chatting"
          }
          className="w-full resize-none bg-transparent p-2 pr-20 text-base
                     placeholder:text-muted-foreground focus:outline-none"
        />

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {/* SEND button – higher contrast & better visibility */}
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-8 w-8 rounded-md bg-accent text-accent-foreground
                       shadow-md hover:bg-accent/90 active:scale-95
                       disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          {/* left-hand utility buttons */}
          <div className="flex gap-1">
            {/* Model Selector */}
            <Select
              value={
                currentModel ??
                (typeof window !== "undefined"
                  ? window.localStorage.getItem(
                      `${
                        chatId ? `chat:${chatId}:` : "chat:global:"
                      }lastUsedModel`
                    ) ?? undefined
                  : undefined)
              }
              onValueChange={setCurrentModel}
              disabled={!hasModels}
            >
              <SelectTrigger className="h-8 w-fit gap-1 rounded-md text-xs">
                {selectedLabel ? (
                  <span className="truncate">{selectedLabel}</span>
                ) : (
                  <SelectValue
                    placeholder={
                      hasModels ? "Select model" : "No models selected"
                    }
                  />
                )}
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Attachment Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-white/10
                         hover:text-foreground dark:hover:bg-white/15"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
