import {ReactNode} from "react";
import {redirect} from "next/navigation";

import {getServerAuthSession} from "@/lib/auth";
import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsTabs from "@/components/settings/SettingsTabs";
import SettingsSidebar from "@/components/settings/SettingsSidebar";

export const metadata = {title: "Settings • T3 Chat"};

interface LayoutProps {
  children: ReactNode;
}

export default async function SettingsLayout({children}: LayoutProps) {
  const session = await getServerAuthSession();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-[#111111]">
      <SettingsHeader/>
      <div className="flex">
        <SettingsSidebar/>
        <div className="flex-1">
          <SettingsTabs/>
          <main className="px-8 pb-8">{children}</main>
        </div>
      </div>
    </div>
  );
}