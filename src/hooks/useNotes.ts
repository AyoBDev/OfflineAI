import { useState, useEffect, useCallback } from 'react'
import { getAllNotes, saveNote, deleteNote as dbDeleteNote, getNote } from '@/lib/db'
import type { Note } from '@/types'

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)

  const load = useCallback(async () => {
    const all = await getAllNotes()
    setNotes(all)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const createNote = useCallback(async () => {
    const now = Date.now()
    const note: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: now,
      updatedAt: now,
    }
    await saveNote(note)
    setActiveNote(note)
    await load()
    return note
  }, [load])

  const updateNote = useCallback(
    async (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
      const note = await getNote(id)
      if (!note) return
      const updated = { ...note, ...updates, updatedAt: Date.now() }
      await saveNote(updated)
      setActiveNote(updated)
      await load()
    },
    [load]
  )

  const deleteNoteById = useCallback(
    async (id: string) => {
      await dbDeleteNote(id)
      if (activeNote?.id === id) setActiveNote(null)
      await load()
    },
    [activeNote, load]
  )

  const selectNote = useCallback(async (id: string) => {
    const note = await getNote(id)
    if (note) setActiveNote(note)
  }, [])

  return {
    notes,
    activeNote,
    createNote,
    updateNote,
    deleteNote: deleteNoteById,
    selectNote,
  }
}
