"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import { useChats } from "@/hooks/useChats"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import {
  PanelLeftClose,
  Plus,
  Search,
  Bot,
  Trash2,
  User as UserIcon,
  Sun,
  Moon,
} from "lucide-react"

interface SidebarProps {
  onToggle: () => void
  onNewChat: () => void
  currentChatId: string | null
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
}

export function Sidebar({
  onToggle,
  onNewChat,
  currentChatId,
  onSelectChat,
  onDeleteChat,
}: SidebarProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const { chats, isLoading } = useChats()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [pendingDeleteId, setPendingDeleteId] =
    React.useState<string | null>(null)
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  function confirmDelete(id: string) {
    setPendingDeleteId(id)
    setDialogOpen(true)
  }
  function handleConfirm() {
    if (pendingDeleteId) onDeleteChat(pendingDeleteId)
    setDialogOpen(false)
    setPendingDeleteId(null)
  }

  const filtered = chats.filter((c) =>
    (c.title || "New Chat").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      {/* ───── Overlay to close sidebar on XS screens ───── */}
      <div className="fixed inset-0 z-30 bg-black/0 sm:hidden" onClick={onToggle} />

      {/* ───── Frosted Sidebar ───── */}
      <div
        className={cn(
          "glass bg-card/70 fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-sidebar-border p-2 backdrop-blur-2xl shadow-xl transition-transform duration-300",
          "w-64 sm:w-56 lg:w-72",
          "lg:static",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Bot className="h-5 w-5 text-accent-foreground" />
            </div>
            <h1 className="text-base font-bold sm:text-lg">T3 chat</h1>
          </div>

          {/* Collapse button – hidden on mobile, visible ≥ sm */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden sm:inline-flex"
          >
            <PanelLeftClose className="h-5 w-5" />
          </Button>

          {/* Theme toggle replaces collapse button on mobile */}
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="ghost"
            size="icon"
            className="sm:hidden"
          >
            {mounted && (theme === "dark" ? <Sun /> : <Moon />)}
          </Button>
        </div>

        <Separator className="my-2" />

        {/* New Chat + Search */}
        <div className="flex flex-col gap-2">
          <Button onClick={onNewChat} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search your threads…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9"
            />
          </div>
        </div>

        {/* Chat list */}
        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-2">
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

          {filtered.map((chat) => (
            <div key={chat.id} className="group flex items-center gap-1 rounded-md">
              <Button
                variant={chat.id === currentChatId ? "secondary" : "ghost"}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "flex-1 justify-start truncate",
                  chat.id === currentChatId && "font-semibold",
                )}
              >
                {chat.title || "New Chat"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => confirmDelete(chat.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Delete chat</span>
              </Button>
            </div>
          ))}

          {!isLoading && filtered.length === 0 && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              No chats found.
            </p>
          )}
        </nav>

        {/* Footer */}
        <Separator className="my-2" />
        <div className="flex items-center p-2">
          {session ? (
            <Button
              variant="ghost"
              className="flex w-full items-center justify-start gap-3 text-left"
              onClick={() => router.push("/settings")}
            >
              <Avatar className="h-8 w-8">
                {session.user?.image && <AvatarImage src={session.user.image} />}
                <AvatarFallback>{session.user?.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
              <p className="truncate text-sm font-semibold">
                {session.user?.name ?? "User"}
              </p>
            </Button>
          ) : (
            <Button onClick={() => router.push("/login")} className="w-full">
              <UserIcon className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Confirm delete dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the conversation and all its messages. You can’t undo this.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
