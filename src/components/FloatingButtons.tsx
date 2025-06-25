"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PanelLeftOpen, Search, Plus } from "lucide-react"

interface FloatingButtonsProps {
  onToggle: () => void
  isNewChat: boolean
  onNewChat: () => void
  onSearchClick: () => void
}

export function FloatingButtons({
  onToggle,
  isNewChat,
  onNewChat,
  onSearchClick,
}: FloatingButtonsProps) {
  return (
    /* glass wrapper with its own drop-shadow; ring suppressed */
    <div
      className="glass bg-card/70 absolute left-4 top-4 z-10 flex flex-col gap-1
                 rounded-lg p-1 backdrop-blur-2xl shadow-xl
                 focus-within:shadow-xl focus-within:ring-0 focus-within:ring-offset-0"
    >
      {/* open sidebar */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="focus:outline-none focus:ring-0 focus:ring-offset-0"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Open Sidebar</TooltipContent>
      </Tooltip>

      {/* search */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearchClick}
            className="focus:outline-none focus:ring-0 focus:ring-offset-0"
          >
            <Search className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Search</TooltipContent>
      </Tooltip>

      {/* new chat */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isNewChat}
            onClick={onNewChat}
            className="focus:outline-none focus:ring-0 focus:ring-offset-0"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">New Chat</TooltipContent>
      </Tooltip>
    </div>
  )
}
