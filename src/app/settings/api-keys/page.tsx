"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

function usePreferences() {
  const [loading, setLoading] = React.useState(true);
  const [prefs, setPrefs] = React.useState<any>({});
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/preferences");
        if (res.ok) {
          const json = await res.json();
          if (!cancelled) setPrefs(json);
        } else if (res.status !== 404) {
          throw new Error(await res.text());
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load preferences");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function save(next: any) {
    const res = await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (!res.ok) throw new Error(await res.text());
    setPrefs((p: any) => ({ ...p, ...next }));
  }

  return { loading, prefs, save, error };
}

function OpenRouterKey() {
  const { loading, prefs, save } = usePreferences();
  const [value, setValue] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!loading) setValue(prefs?.openrouterApiKey ?? "");
  }, [loading, prefs]);

  async function onSave() {
    setSaving(true);
    try {
      await save({ openrouterApiKey: value.trim() });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span className="text-2xl">🔑</span> OpenRouter API Key
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        Used for models via OpenRouter. Your key is stored securely in your
        account preferences and used only for your requests.
      </p>
      <div className="mt-4">
        <Input
          type="password"
          placeholder="sk-or-v1-..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-between items-center mt-2">
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary underline"
          >
            Get your API key from OpenRouter
          </a>
          <Button size="sm" onClick={onSave} disabled={loading || saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ApiKeysPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Bring your own API keys for select models. Messages sent using your
          API keys will not count towards your monthly limits.
          <br />
          <span className="font-semibold">Note:</span> For optional API key
          models, you can choose Priority (always use your API key first) or
          Fallback (use your credits first, then your API key).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <OpenRouterKey />
        <Separator />
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-2xl">🔑</span> Other Providers
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Coming soon: save keys for Anthropic, OpenAI, Google, and more.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
