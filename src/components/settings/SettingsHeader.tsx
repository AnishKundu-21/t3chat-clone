"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ArrowLeft, LogOut, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

// ── replace this import with your real theme switcher if it lives elsewhere
import ThemeToggle from "@/components/ToggleTheme";

export default function SettingsHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 p-4 backdrop-blur-sm dark:bg-[#111111]/80">
      <Button variant="ghost" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Chat
        </Link>
      </Button>

      <div className="flex items-center gap-2">
        {/* If you don’t have a ThemeToggle component yet, 
            temporarily replace it with the Sun icon button below */}
        {ThemeToggle ? (
          <ThemeToggle />
        ) : (
          <Button variant="ghost" size="icon">
            <Sun className="h-5 w-5" />
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/" })}
          title="Sign out"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </header>
  );
}
