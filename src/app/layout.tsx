/* src/app/layout.tsx */
import type { Metadata } from "next"
import "./globals.css"

import { cn } from "@/lib/utils"
import { Providers } from "@/components/Providers"
import { ThemeProvider } from "@/components/ThemeProvider"
import { ToasterProvider } from "@/components/ToasterProvider"

/* ───────── Google font imports ───────── */
import {
  Space_Grotesk as SpaceGrotesk,
  Oxanium,
  Source_Code_Pro as SourceCodePro,
} from "next/font/google"

/* Each import registers a CSS custom property:
   --font-sans   → Space Grotesk
   --font-serif  → Oxanium
   --font-mono   → Source Code Pro                                  */
const fontSans = SpaceGrotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fontSerif = Oxanium({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const fontMono = SourceCodePro({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "T3 Chat Clone",
  description: "A pixel-perfect clone of the T3 Chat application.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        fontSans.variable,
        fontSerif.variable,
        fontMono.variable,
      )}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ToasterProvider />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
