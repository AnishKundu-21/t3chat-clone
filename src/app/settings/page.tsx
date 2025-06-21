"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Zap, Gem, ShieldCheck, ShieldAlert} from "lucide-react";

export default function AccountPage() {
  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold">Pro Plan Benefits</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Zap className="h-6 w-6 text-primary"/>
            <h3 className="font-semibold">Access to All Models</h3>
            <p className="text-sm text-muted-foreground">
              Get access to our full suite of models including Claude, s3-mini-high, and more!
            </p>
          </div>
          <div className="space-y-2">
            <Gem className="h-6 w-6 text-pink-500"/>
            <h3 className="font-semibold">Generous Limits</h3>
            <p className="text-sm text-muted-foreground">
              Receive 1500 standard credits per month, plus 100 premium credits* per month.
            </p>
          </div>
          <div className="space-y-2">
            <ShieldCheck className="h-6 w-6 text-green-500"/>
            <h3 className="font-semibold">Priority Support</h3>
            <p className="text-sm text-muted-foreground">
              Get faster responses and dedicated assistance from the T3 team whenever you need help!
            </p>
          </div>
        </div>
        <Button className="mt-8 w-full bg-pink-600 text-white hover:bg-pink-700 md:w-auto">
          Manage Subscription
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          *Premium credits are used for GPT Image Gen, s3, Claude Sonnet, Gemini 2.5 Pro, and Grok 3. Additional Premium
          credits can be purchased separately for $1 per 100.
        </p>
      </Card>

      <Card className="border-destructive/50 p-6">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-5 w-5 text-destructive"/>
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
  );
}