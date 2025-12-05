import { cn } from "@/lib/utils"
import { Inbox } from "lucide-react"
import type { ReactNode } from "react"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center space-y-3 py-10", className)}>
      <div className="p-3 rounded-full bg-muted text-muted-foreground">
        {icon || <Inbox className="h-5 w-5" />}
      </div>
      <div className="space-y-1">
        <p className="text-lg font-medium">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

