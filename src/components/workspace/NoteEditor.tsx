import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Note } from '@/types'

interface NoteEditorProps {
  note: Note
  onUpdate: (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => void
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
  }, [note.id, note.title, note.content])

  const debouncedUpdate = (updates: Partial<Pick<Note, 'title' | 'content'>>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onUpdate(note.id, updates)
    }, 500)
  }

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <Input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          debouncedUpdate({ title: e.target.value })
        }}
        placeholder="Note title..."
        className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 px-0"
      />
      <Textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          debouncedUpdate({ content: e.target.value })
        }}
        placeholder="Start writing..."
        className="flex-1 resize-none border-none shadow-none focus-visible:ring-0 px-0"
      />
      <p className="text-xs text-muted-foreground">
        Last saved: {new Date(note.updatedAt).toLocaleString()}
      </p>
    </div>
  )
}
