import { NavLink } from 'react-router-dom'
import { MessageSquare, BookOpen, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { APP_NAME } from '@/lib/constants'
import { ModelStatusBadge } from './ModelStatusBadge'
import { ChatHistory } from '@/components/chat/ChatHistory'
import type { ModelStatus } from '@/types'

interface SidebarProps {
  modelStatus: ModelStatus
  onNewChat: () => void
}

export function Sidebar({ modelStatus, onNewChat }: SidebarProps) {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 p-4">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold">{APP_NAME}</h1>
      </div>
      <Separator />
      <div className="p-3">
        <Button onClick={onNewChat} className="w-full" variant="outline">
          <MessageSquare className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        <NavLink
          to="/chat"
          end
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50'
            }`
          }
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </NavLink>
        <NavLink
          to="/workspace"
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50'
            }`
          }
        >
          <BookOpen className="h-4 w-4" />
          Workspace
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50'
            }`
          }
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
      </nav>
      <ChatHistory />
      <Separator />
      <div className="p-3">
        <ModelStatusBadge status={modelStatus} />
      </div>
    </div>
  )
}
