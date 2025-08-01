"use client";

import React, { useState } from "react";
import { toast } from "sonner";

import { Input } from "./input";
import { Badge } from "./badge";
import { Button } from "./button";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  disabled?: boolean;
}

/* ───────── Defaults & limits ───────── */
const SUGGESTED: readonly string[] = [
  "trusty",
  "witty",
  "concise",
  "curious",
  "empathetic",
  "creative",
  "patient",
];
const MAX_TAGS = 50;
const MAX_LEN = 100;

export function TagInput({ tags, setTags, disabled }: TagInputProps) {
  const [draft, setDraft] = useState("");

  /* add & remove helpers */
  function addTag(tag: string) {
    if (!tag.trim()) return;
    if (tag.length > MAX_LEN) {
      toast.error(`Tags must be ≤${MAX_LEN} chars`);
      return;
    }
    if (tags.includes(tag)) return;
    if (tags.length >= MAX_TAGS) {
      toast.error(`Limit ${MAX_TAGS} tags`);
      return;
    }
    setTags([...tags, tag]);
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    addTag(draft.trim());
    setDraft("");
  }

  /* ───────── UI ───────── */
  return (
    <div className="space-y-3">
      {/* selected list */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="flex items-center gap-1 py-1 pl-2 pr-1"
            >
              <span className="truncate max-w-[150px]">{t}</span>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => removeTag(t)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* suggestion pool (visually outlined) */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTED.filter((s) => !tags.includes(s)).map((s) => (
          <Badge
            key={s}
            variant="outline"
            className="flex cursor-pointer select-none items-center gap-1 py-1 pl-2 pr-1 hover:bg-muted"
            onClick={() => addTag(s)}
          >
            <Plus className="h-3 w-3" />
            <span className="truncate max-w-[150px]">{s}</span>
          </Badge>
        ))}
      </div>

      {/* manual entry */}
      <Input
        placeholder="Type a trait then press Enter…"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
    </div>
  );
}
