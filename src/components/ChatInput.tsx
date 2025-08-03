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
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  models: ModelOption[];
  currentModel: string;
  setCurrentModel: (modelId: string) => void;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  models,
  currentModel,
  setCurrentModel,
}: ChatInputProps) {
  return (
    <form
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
          placeholder="Type your message here…"
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
            <Select value={currentModel} onValueChange={setCurrentModel}>
              <SelectTrigger className="h-8 w-fit gap-1 rounded-md text-xs">
                <SelectValue placeholder="Select model" />
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
