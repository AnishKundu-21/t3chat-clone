"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

/**
 * Wraps the app in next-themes.
 * - Uses the classic `.light` / `.dark` class strategy.
 * - Falls back to the user’s OS preference (`system`).
 */
export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      themes={["light", "dark"]}
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}