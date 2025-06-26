"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  PanelLeftOpen,
  Search,
  Plus,
  Wand2,
  Sun,
  Moon,
} from "lucide-react"

interface FloatingButtonsProps {
  onToggle: () => void
  sidebarOpen: boolean
  isNewChat: boolean
  onNewChat: () => void
  onSearchClick: () => void
}

const icon =
  "h-8 w-8 rounded-md bg-transparent hover:bg-white/10 dark:hover:bg-white/15 " +
  "text-foreground transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0"

const bar =
  "flex flex-row gap-1 rounded-md bg-white/30 p-1 backdrop-blur-md " +
  "backdrop-saturate-150 shadow-lg dark:bg-white/10"

export function FloatingButtons({
  onToggle,
  sidebarOpen,
  isNewChat,
  onNewChat,
  onSearchClick,
}: FloatingButtonsProps) {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const goCustomise = () =>
    router.push(session?.user ? "/settings/customization" : "/login")

  return (
    <>
      {/* LEFT BAR - only when sidebar is collapsed */}
      {!sidebarOpen && (
        <div className={`${bar} fixed left-4 top-4 z-50`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggle} className={icon}>
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Open Sidebar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onSearchClick} className={icon}>
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Search</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isNewChat}
                onClick={onNewChat}
                className={icon}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">New Chat</TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* RIGHT BAR - ALWAYS visible on tablet & desktop */}
      <div className={`${bar} fixed right-4 top-4 z-50 hidden sm:flex`}>
        {/* Customisation - laptop/desktop only */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={goCustomise}
              className={`${icon} hidden lg:inline-flex`}
            >
              <Wand2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Customisation</TooltipContent>
        </Tooltip>

        {/* Theme toggle - tablet & up */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={icon}
            >
              {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Toggle theme</TooltipContent>
        </Tooltip>
      </div>
    </>
  )
}
