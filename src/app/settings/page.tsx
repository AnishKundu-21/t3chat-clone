"use client";

import * as React from "react";
import { useSession } from "next-auth/react";

// shadcn/ui
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Kbd } from "@/components/ui/kbd";
import {
  Zap,
  Gem,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Loading…
      </div>
    );
  }
  if (!session?.user) return null;

  const { user } = session;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* ── Left column ───────────────────────────── */}
      <div className="space-y-8 lg:col-span-1">
        <Card className="flex flex-col items-center p-6 text-center">
          <Avatar className="h-24 w-24 border-2 border-primary">
            {user.image && (
              <AvatarImage src={user.image} alt={user.name ?? ""} />
            )}
            <AvatarFallback className="text-3xl">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <Button
            variant="secondary"
            className="mt-4 cursor-default rounded-full bg-pink-600/20 text-pink-500 hover:bg-pink-600/30"
          >
            Pro Plan
          </Button>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Usage</CardTitle>
            <CardDescription>Resets 07/13/2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <p>Standard</p>
                <p>0 / 1500</p>
              </div>
              <Progress value={0} />
              <p className="mt-1 text-xs text-muted-foreground">
                1500 messages remaining
              </p>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <p>Premium</p>
                <p>4 / 100</p>
              </div>
              <Progress value={4} className="[&>div]:bg-pink-500" />
              <p className="mt-1 text-xs text-muted-foreground">
                96 messages remaining
              </p>
            </div>

            <Button className="w-full bg-primary/80 hover:bg-primary">
              Buy more premium credits →
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keyboard Shortcuts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <p>Search</p>
              <div className="flex gap-1">
                <Kbd>Ctrl</Kbd>
                <Kbd>K</Kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p>New Chat</p>
              <div className="flex gap-1">
                <Kbd>Ctrl</Kbd>
                <Kbd>Shift</Kbd>
                <Kbd>O</Kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p>Toggle Sidebar</p>
              <div className="flex gap-1">
                <Kbd>Ctrl</Kbd>
                <Kbd>B</Kbd>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Right column ──────────────────────────── */}
      <div className="space-y-8 lg:col-span-2">
        <Card className="p-6">
          <h2 className="text-2xl font-bold">Pro Plan Benefits</h2>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Zap className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Access to All Models</h3>
              <p className="text-sm text-muted-foreground">
                Get access to our full suite of models including Claude,
                s3-mini-high, and more!
              </p>
            </div>
            <div className="space-y-2">
              <Gem className="h-6 w-6 text-pink-500" />
              <h3 className="font-semibold">Generous Limits</h3>
              <p className="text-sm text-muted-foreground">
                Receive 1500 standard credits per month, plus 100 premium
                credits* per month.
              </p>
            </div>
            <div className="space-y-2">
              <ShieldCheck className="h-6 w-6 text-green-500" />
              <h3 className="font-semibold">Priority Support</h3>
              <p className="text-sm text-muted-foreground">
                Get faster responses and dedicated assistance from the
                T3 team whenever you need help!
              </p>
            </div>
          </div>

          <Button className="mt-8 w-full bg-pink-600 text-white hover:bg-pink-700 md:w-auto">
            Manage Subscription
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            *Premium credits are used for GPT Image Gen, s3, Claude
            Sonnet, and Grok 3. Additional Premium credits can be
            purchased separately.
          </p>
        </Card>

        <Card className="border-destructive/50 p-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-destructive">
                Danger Zone
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
              <Button variant="destructive" className="mt-4">
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
