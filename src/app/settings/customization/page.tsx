"use client"

import React, { useEffect } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TagInput } from "@/components/ui/tag-input"

type VisualOpts = {
  boring: boolean
  hidePii: boolean
  noBreaks: boolean
  stats: boolean
}

export default function CustomizationPage() {
  const [name, setName] = React.useState("")
  const [job, setJob] = React.useState("")
  const [traits, setTraits] = React.useState<string[]>([])
  const [about, setAbout] = React.useState("")
  const [visual, setVisual] = React.useState<VisualOpts>({
    boring: false,
    hidePii: false,
    noBreaks: false,
    stats: false,
  })
  const [mainFont, setMainFont] = React.useState("proxima")
  const [codeFont, setCodeFont] = React.useState("berkeley")

  // Load preferences on mount
  useEffect(() => {
    handleLoadLegacy()
  }, [])

  function toggleVisual(key: keyof VisualOpts) {
    setVisual((v) => ({ ...v, [key]: !v[key] }))
  }

  async function handleSave() {
    const body = { name, job, traits, about, visual, mainFont, codeFont }
    const res = await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    })
    if (res.ok) {
      toast.success("Preferences saved ✔︎")
      handleLoadLegacy() // Refresh the form after save
    } else {
      toast.error("Save failed")
    }
  }

  async function handleLoadLegacy() {
    const res = await fetch("/api/preferences", { credentials: "include" })
    if (!res.ok) {
      if (res.status === 404) toast.info("No saved data found")
      else toast.error("Failed to load preferences")
      return
    }
    const data = await res.json()
    setName(data.name ?? "")
    setJob(data.job ?? "")
    setTraits(data.traits ?? [])
    setAbout(data.about ?? "")
    setVisual(data.visual ?? visual)
    setMainFont(data.mainFont ?? "proxima")
    setCodeFont(data.codeFont ?? "berkeley")
  }

  return (
    <div className="space-y-8">
      {/* Customize T3 Chat */}
      <Card>
        <CardHeader>
          <CardTitle>Customize T3 Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault()
              handleSave()
            }}
          >
            <div>
              <Label>What should T3 Chat call you?</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                className="mt-1"
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {name.length}/50
              </p>
            </div>

            <div>
              <Label>What do you do?</Label>
              <Input
                placeholder="Engineer, student, etc."
                value={job}
                onChange={(e) => setJob(e.target.value)}
                maxLength={100}
                className="mt-1"
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {job.length}/100
              </p>
            </div>

            <div>
              <Label>Traits for T3 Chat</Label>
              <TagInput tags={traits} setTags={setTraits} className="mt-1" />
            </div>

            <div>
              <Label>Anything else T3 Chat should know about you?</Label>
              <Textarea
                placeholder="Interests, values, preferences …"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                maxLength={3000}
                className="mt-1 min-h-[100px]"
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {about.length}/3000
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                type="button"
                onClick={handleLoadLegacy}
              >
                Load Legacy Data
              </Button>
              <Button
                className="bg-pink-600 text-white hover:bg-pink-700"
                type="submit"
              >
                Save Preferences
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Visual Options */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            ["boring", "Boring Theme", "Tone down the vibrant colors."],
            ["hidePii", "Hide Personal Information", "Hide your name & email."],
            ["noBreaks", "Disable Thematic Breaks", "Remove horizontal lines."],
            ["stats", "Stats for Nerds", "Show token statistics."],
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

      {/* Fonts */}
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
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proxima">Proxima Vara</SelectItem>
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
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="berkeley">Berkeley Mono</SelectItem>
                  <SelectItem value="intel">Intel One Mono</SelectItem>
                  <SelectItem value="atkinson-mono">
                    Atkinson Hyperlegible Mono
                  </SelectItem>
                  <SelectItem value="system-mono">System Mono</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* preview */}
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
                    {"\n  "}
                    console.<span className="text-yellow-400">log</span>(
                    <span className="text-teal-300">`Hello, </span>
                    <span className="text-red-400">${"{name}"}</span>
                    <span className="text-teal-300">!`</span>);
                    {"\n"}
                    {"}"}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
