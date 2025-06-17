"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Account",        href: "/settings" },
  { label: "Customization",  href: "/settings/customization" },
  { label: "History & Sync", href: "/settings/history-sync" },
  { label: "Models",         href: "/settings/models" },
  { label: "API Keys",       href: "/settings/api-keys" },
  { label: "Attachments",    href: "/settings/attachments" },
  { label: "Contact Us",     href: "/settings/contact" },
];

export default function SettingsTabs() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto mb-8 flex max-w-7xl flex-wrap items-center gap-2 px-4 pt-4 md:px-8">
      {tabs.map(({ label, href }) => {
        // root "/settings" needs exact match; others check startsWith
        const active =
          href === "/settings"
            ? pathname === "/settings"
            : pathname.startsWith(href);

        return (
          <Button
            key={href}
            asChild
            variant={active ? "secondary" : "ghost"}
            className={cn("rounded-full px-4 py-1.5 text-sm font-medium")}
          >
            <Link href={href}>{label}</Link>
          </Button>
        );
      })}
    </nav>
  );
}
