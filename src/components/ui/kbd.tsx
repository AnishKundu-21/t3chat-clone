import * as React from "react"
import { cn } from "@/lib/utils"

const Kbd = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => {
  return (
    <kbd
      ref={ref}
      className={cn(
        "rounded border bg-muted px-2 py-1 text-xs font-mono font-semibold shadow-sm",
        className
      )}
      {...props}
    />
  )
})
Kbd.displayName = "Kbd"

export { Kbd }
