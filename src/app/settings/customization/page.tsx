"use client"

import React, { useEffect } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { TagInput } from "@/components/ui/tag-input"

type VisualOpts = {
  boring: boolean
  hidePii: boolean
  noBreaks: boolean
  stats: boolean
}

export default function CustomizationPage() {
  /* ───────── Local fields ───────── */
  const [name, setName] = React.useState("Anish")
  const [job, setJob] = React.useState("Engineering Student")
  const [traits, setTraits] = React.useState<string[]>([
    "trusty",
    "witty",
    "concise",
    "curious",
    "empathetic",
    "creative",
    "patient",
  ])
  const [about, setAbout] = React.useState(
    "Interests, values, or preferences to keep in mind",
  )
  const [visual, setVisual] = React.useState<VisualOpts>({
    boring: false,
    hidePii: false,
    noBreaks: false,
    stats: true,
  })

  /* initial fetch */
  useEffect(() => {
    handleLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggleVisual(key: keyof VisualOpts) {
    setVisual((v) => ({ ...v, [key]: !v[key] }))
  }

  /* ---------------- API ---------------- */
  async function handleSave() {
    const body = { name, job, traits, about, visual }
    const res = await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    })
    res.ok ? toast.success("Preferences saved ✔︎") : toast.error("Save failed")
  }

  async function handleLoad() {
    const res = await fetch("/api/preferences", { credentials: "include" })
    if (!res.ok) {
      if (res.status !== 404) toast.error("Failed to load preferences")
      return
    }
    const data = await res.json()
    setName(data.name ?? "Anish")
    setJob(data.job ?? "Engineering Student")
    setTraits(
      data.traits ?? [
        "trusty",
        "witty",
        "concise",
        "curious",
        "empathetic",
        "creative",
        "patient",
      ],
    )
    setAbout(data.about ?? "Interests, values, or preferences to keep in mind")
    setVisual(data.visual ?? visual)
    toast.success("Preferences loaded")
  }

  /* ---------------- UI ---------------- */
  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault()
        handleSave()
      }}
    >
      {/* ───────── Personal Details ───────── */}
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
            />
            <p className="text-right text-xs text-muted-foreground">
              {job.length}/100
            </p>
          </div>

          {/* traits */}
          <div className="space-y-2">
            <Label>What traits should T3 Chat have?</Label>
            <TagInput tags={traits} setTags={setTraits} />
            <p className="text-right text-xs text-muted-foreground">
              up to 50, max 100 chars each
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
            />
            <p className="text-right text-xs text-muted-foreground">
              {about.length}/3000
            </p>
          </div>

          {/* actions */}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={handleLoad}>
              Reload
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

      {/* ───────── Visual Options ───────── */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            [
              "boring",
              "Boring Theme",
              "If you think the pink is too much, tone it down.",
            ],
            [
              "hidePii",
              "Hide Personal Information",
              "Blur your name and email from the UI.",
            ],
            [
              "noBreaks",
              "Disable Thematic Breaks",
              "Hides horizontal lines in chat messages.",
            ],
            [
              "stats",
              "Stats for Nerds",
              "Show token counts & TTFB.",
            ],
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
    </form>
  )
}
