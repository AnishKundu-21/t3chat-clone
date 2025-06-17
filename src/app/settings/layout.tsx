import { ReactNode } from "react"
import { redirect } from "next/navigation"

import { getServerAuthSession } from "@/lib/auth"   // ← use the helper you already have

import SettingsHeader from "@/components/settings/SettingsHeader"
import SettingsTabs   from "@/components/settings/SettingsTabs"

export const metadata = { title: "Settings • T3 Chat" }

interface LayoutProps {
  children: ReactNode
}

export default async function SettingsLayout({ children }: LayoutProps) {
  /* server-side auth guard */
  const session = await getServerAuthSession()  // ← call helper
  if (!session) redirect("/")

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-[#111111]">
      <SettingsHeader />
      <SettingsTabs />
      <main className="mx-auto max-w-7xl p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
