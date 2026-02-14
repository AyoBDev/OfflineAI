import { useNavigate } from 'react-router-dom'
import { FileText, Trash2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Document } from '@/types'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface DocumentLibraryProps {
  documents: Document[]
  onDelete: (id: string) => void
}

export function DocumentLibrary({ documents, onDelete }: DocumentLibraryProps) {
  const navigate = useNavigate()

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
        <FileText className="h-8 w-8 opacity-20" />
        <p className="text-sm">No documents uploaded yet.</p>
        <p className="text-xs">Upload a PDF or text file in a chat to get started.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-3 rounded-md border p-3"
          >
            <FileText className="h-8 w-8 shrink-0 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{doc.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatSize(doc.size)} &middot;{' '}
                {new Date(doc.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                title="Chat about this document"
                onClick={() => navigate('/chat')}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Delete document"
                onClick={() => onDelete(doc.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
