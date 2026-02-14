import { FileText, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Note } from '@/types'

interface NoteListProps {
  notes: Note[]
  activeId?: string
  onCreate: () => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function NoteList({
  notes,
  activeId,
  onCreate,
  onSelect,
  onDelete,
}: NoteListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="text-sm font-medium">Notes</h3>
        <Button variant="ghost" size="icon" onClick={onCreate}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {notes.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground text-center">
            No notes yet. Create one to get started.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelect(note.id)}
              className={`group flex cursor-pointer items-center gap-2 px-3 py-2 text-sm border-b ${
                note.id === activeId
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/50'
              }`}
            >
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{note.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(note.id)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  )
}
