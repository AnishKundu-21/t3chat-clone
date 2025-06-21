"use client";

import React, {useEffect} from "react";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {TagInput} from "@/components/ui/tag-input";

type VisualOpts = {
  boring: boolean;
  hidePii: boolean;
  noBreaks: boolean;
  stats: boolean;
};

export default function CustomizationPage() {
  const [name, setName] = React.useState("Anish");
  const [job, setJob] = React.useState("Engineering Student");
  const [traits, setTraits] = React.useState<string[]>([
    "trusty",
    "witty",
    "concise",
    "curious",
    "empathetic",
    "creative",
    "patient",
  ]);
  const [about, setAbout] = React.useState(
    "Interests, values, or preferences to keep in mind"
  );
  const [visual, setVisual] = React.useState<VisualOpts>({
    boring: false,
    hidePii: false,
    noBreaks: false,
    stats: true,
  });
  const [mainFont, setMainFont] = React.useState("proxima");
  const [codeFont, setCodeFont] = React.useState("berkeley");

  useEffect(() => {
    handleLoadLegacy();
  }, []);

  function toggleVisual(key: keyof VisualOpts) {
    setVisual((v) => ({...v, [key]: !v[key]}));
  }

  async function handleSave() {
    const body = {name, job, traits, about, visual, mainFont, codeFont};
    const res = await fetch("/api/preferences", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (res.ok) {
      toast.success("Preferences saved ✔︎");
    } else {
      toast.error("Save failed");
    }
  }

  async function handleLoadLegacy() {
    const res = await fetch("/api/preferences", {credentials: "include"});
    if (!res.ok) {
      if (res.status !== 404) toast.error("Failed to load preferences");
      return;
    }
    const data = await res.json();
    setName(data.name ?? "Anish");
    setJob(data.job ?? "Engineering Student");
    setTraits(
      data.traits ?? [
        "trusty",
        "witty",
        "concise",
        "curious",
        "empathetic",
        "creative",
        "patient",
      ]
    );
    setAbout(
      data.about ?? "Interests, values, or preferences to keep in mind"
    );
    setVisual(data.visual ?? visual);
    setMainFont(data.mainFont ?? "proxima");
    setCodeFont(data.codeFont ?? "berkeley");
    toast.success("Preferences loaded");
  }

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
          <div className="space-y-2">
            <Label>What should T3 Chat call you?</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
            <p className="text-right text-xs text-muted-foreground">
              {name.length}/50
            </p>
          </div>

          <div className="space-y-2">
            <Label>What do you do?</Label>
            <Input
              placeholder="Engineer, student, etc."
              value={job}
              onChange={(e) => setJob(e.target.value)}
              maxLength={100}
            />
            <p className="text-right text-xs text-muted-foreground">
              {job.length}/100
            </p>
          </div>

          <div className="space-y-2">
            <Label>What traits should T3 Chat have?</Label>
            <TagInput tags={traits} setTags={setTraits}/>
            <p className="text-right text-xs text-muted-foreground">
              up to 50, max 100 chars each
            </p>
          </div>

          <div className="space-y-2">
            <Label>Anything else T3 Chat should know about you?</Label>
            <Textarea
              placeholder="Interests, values, or preferences to keep in mind"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              maxLength={3000}
              className="min-h-[100px]"
            />
            <p className="text-right text-xs text-muted-foreground">
              {about.length}/3000
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={handleLoadLegacy}>
              Load Legacy Data
            </Button>
            <Button
              className="bg-pink-600 text-white hover:bg-pink-700"
              type="submit"
            >
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visual Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            ["boring", "Boring Theme", "If you think the pink is too much, turn this on to tone it down."],
            ["hidePii", "Hide Personal Information", "Hides your name and email from the UI."],
            ["noBreaks", "Disable Thematic Breaks", "Hides horizontal lines in chat messages. (Some browsers have trouble rendering these, turn off if you have bugs with duplicated lines)"],
            ["stats", "Stats for Nerds", "Enables more insights into message stats including tokens per second, time to first token, and estimated tokens in the message."],
          ].map(([id, label, desc]) => (
            <div key={id} className="flex items-center justify-between">
              <div>
                <Label htmlFor={id}>{label}</Label>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <Switch
                id={id}
                checked={visual[id as keyof VisualOpts]}
                onCheckedChange={() => toggleVisual(id as keyof VisualOpts)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fonts</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <Label>Main Text Font</Label>
              <Select value={mainFont} onValueChange={setMainFont}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proxima">Proxima Vara (default)</SelectItem>
                  <SelectItem value="atkinson">Atkinson Hyperlegible</SelectItem>
                  <SelectItem value="open-dyslexic">OpenDyslexic</SelectItem>
                  <SelectItem value="system">System Font</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Code Font</Label>
              <Select value={codeFont} onValueChange={setCodeFont}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="berkeley">Berkeley Mono (default)</SelectItem>
                  <SelectItem value="intel">Intel One Mono</SelectItem>
                  <SelectItem value="atkinson-mono">
                    Atkinson Hyperlegible Mono
                  </SelectItem>
                  <SelectItem value="system-mono">System Mono</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
            <p>Can you write me a simple hello world program?</p>
            <div>
              <p className="font-semibold">Sure, here you go:</p>
              <div className="mt-2 rounded-md bg-black p-4 text-sm text-white">
                <pre>
                  <code className="font-mono">
                    <span className="text-blue-400">function</span>{" "}
                    <span className="text-purple-400">greet</span>(
                    <span className="text-orange-400">name</span>:{" "}
                    <span className="text-green-400">string</span>) {"{"}
                    {"\n  return "}
                    <span className="text-teal-300">`Hello, </span>
                    <span className="text-red-400">${"{name}"}</span>
                    <span className="text-teal-300">!`;</span>
                    {"\n"}
                    {"}"}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}