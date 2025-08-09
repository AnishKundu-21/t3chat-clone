"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type ORModel = { id: string; name: string };

export default function ModelsPage() {
  const [allModels, setAllModels] = React.useState<ORModel[]>([]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [modelsRes, prefsRes] = await Promise.all([
          fetch("/api/models", { cache: "no-store" }),
          fetch("/api/preferences", { cache: "no-store" }),
        ]);
        if (!modelsRes.ok) throw new Error(await modelsRes.text());
        const models = (await modelsRes.json()) as ORModel[];
        const prefs = prefsRes.ok ? await prefsRes.json() : {};
        if (cancelled) return;
        setAllModels(models);
        const initial = Array.isArray(prefs?.selectedModels)
          ? (prefs.selectedModels as string[])
          : [];
        setSelected(new Set(initial));
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load models");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggle(id: string, on: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(allModels.map((m) => m.id)));
  }
  function unselectAll() {
    setSelected(new Set());
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedModels: Array.from(selected) }),
      });
      if (!res.ok) throw new Error(await res.text());
    } finally {
      setSaving(false);
    }
  }

  const filtered = allModels.filter((m) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q);
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Available Models</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Search the OpenRouter catalog and choose which models appear in
              your chat model selector.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={selectAll} disabled={loading}>
              Select All
            </Button>
            <Button
              variant="secondary"
              onClick={unselectAll}
              disabled={loading}
            >
              Unselect All
            </Button>
            <Button onClick={save} disabled={loading || saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <Input
            placeholder="Search models (e.g., deepseek, qwen, gemma)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading models...</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No models match your search.
          </p>
        ) : (
          <div className="divide-y">
            {filtered.map((m) => {
              const on = selected.has(m.id);
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{m.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {m.id}
                    </div>
                  </div>
                  <Switch
                    checked={on}
                    onCheckedChange={(v) => toggle(m.id, v)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
