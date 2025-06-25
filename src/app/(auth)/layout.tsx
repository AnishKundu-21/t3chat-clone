/*
 * Auth layout (login / signup)
 * NOTE: In the App-Router only the *root* layout may render <html> / <body>.
 *       Nested layouts should return plain JSX wrappers.
 */

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { default: "Auth • T3 Chat", template: "%s • T3 Chat" },
  description: "Login or create an account to use T3 Chat",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /* Center the auth card on the screen, reuse theme tokens */
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      {children}
    </div>
  )
}
