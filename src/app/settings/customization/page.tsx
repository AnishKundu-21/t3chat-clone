"use client";

import React, { useEffect, useCallback } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tag-input";

export default function CustomizationPage() {
  /* ───────── Local state ───────── */
  const [name, setName] = React.useState("");
  const [job, setJob] = React.useState("");
  const [traits, setTraits] = React.useState<string[]>([]);
  const [about, setAbout] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  /* ---------- API ---------- */
  const handleSave = useCallback(async () => {
    const body = { name, job, traits, about };
    const res = await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    res.ok ? toast.success("Preferences saved ✔︎") : toast.error("Save failed");
  }, [about, job, name, traits]);

  const handleLoad = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/preferences", { credentials: "include" });
      if (!res.ok) {
        if (res.status !== 404) toast.error("Failed to load preferences");
        return;
      }
      const data = await res.json();
      setName(data.name ?? "");
      setJob(data.job ?? "");
      setTraits(data.traits ?? []);
      setAbout(data.about ?? "");
      /* toast intentionally removed */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleLoad();
  }, [handleLoad]);

  /* keyboard shortcut ⌘/Ctrl+S */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSave]);

  /* Defaults button */
  function handleDefaults() {
    setName("");
    setJob("");
    setTraits([]);
    setAbout("");
    toast.info("Reverted to default values");
  }

  /* ---------- UI ---------- */
  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Customize T3 Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* name */}
          <div className="space-y-2">
            <Label>What should T3 Chat call you?</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              disabled={loading}
            />
            <p className="text-right text-xs text-muted-foreground">
              {name.length}/50
            </p>
          </div>
          {/* job */}
          <div className="space-y-2">
            <Label>What do you do?</Label>
            <Input
              placeholder="Engineer, student, etc."
              value={job}
              onChange={(e) => setJob(e.target.value)}
              maxLength={100}
              disabled={loading}
            />
            <p className="text-right text-xs text-muted-foreground">
              {job.length}/100
            </p>
          </div>
          {/* traits */}
          <div className="space-y-2">
            <Label>What traits should T3 Chat have?</Label>
            <TagInput tags={traits} setTags={setTraits} disabled={loading} />
            <p className="text-right text-xs text-muted-foreground">
              choose from suggestions or add your own
            </p>
          </div>
          {/* about */}
          <div className="space-y-2">
            <Label>Anything else T3 Chat should know about you?</Label>
            <Textarea
              placeholder="Interests, values, or preferences to keep in mind"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              maxLength={3000}
              className="min-h-[100px]"
              disabled={loading}
            />
            <p className="text-right text-xs text-muted-foreground">
              {about.length}/3000
            </p>
          </div>
          {/* buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={handleDefaults}
              disabled={loading}
            >
              Defaults
            </Button>
            <Button
              className="bg-pink-600 text-white hover:bg-pink-700"
              type="submit"
              disabled={loading}
            >
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
