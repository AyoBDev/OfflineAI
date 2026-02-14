import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { getAllConversations, deleteConversation } from '@/lib/db'
import type { Conversation } from '@/types'

interface ChatHistoryProps {
  currentId?: string
}

export function ChatHistory({ currentId }: ChatHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const navigate = useNavigate()

  const load = async () => {
    const convs = await getAllConversations()
    setConversations(convs)
  }

  useEffect(() => {
    load()
  }, [currentId])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteConversation(id)
    if (id === currentId) {
      navigate('/chat')
    }
    load()
  }

  if (conversations.length === 0) return null

  return (
    <div className="border-t pt-2">
      <p className="px-3 py-1 text-xs font-medium text-muted-foreground">
        Recent Chats
      </p>
      <ScrollArea className="max-h-[300px]">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => navigate(`/chat/${conv.id}`)}
            className={`group flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
              conv.id === currentId
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent/50'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate flex-1">{conv.title}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => handleDelete(conv.id, e)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}
