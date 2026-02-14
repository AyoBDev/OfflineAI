import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Conversation, Document, Note } from '@/types'

interface StudyBuddyDB extends DBSchema {
  conversations: {
    key: string
    value: Conversation
    indexes: { 'by-updated': number }
  }
  documents: {
    key: string
    value: Document
    indexes: { 'by-updated': number }
  }
  notes: {
    key: string
    value: Note
    indexes: { 'by-updated': number }
  }
  appState: {
    key: string
    value: { key: string; value: unknown }
  }
}

let dbInstance: IDBPDatabase<StudyBuddyDB> | null = null

export async function getDB(): Promise<IDBPDatabase<StudyBuddyDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<StudyBuddyDB>('studybuddy', 1, {
    upgrade(db) {
      const convStore = db.createObjectStore('conversations', { keyPath: 'id' })
      convStore.createIndex('by-updated', 'updatedAt')

      const docStore = db.createObjectStore('documents', { keyPath: 'id' })
      docStore.createIndex('by-updated', 'createdAt')

      const noteStore = db.createObjectStore('notes', { keyPath: 'id' })
      noteStore.createIndex('by-updated', 'updatedAt')

      db.createObjectStore('appState', { keyPath: 'key' })
    },
  })

  return dbInstance
}

// Conversations
export async function saveConversation(conv: Conversation) {
  const db = await getDB()
  await db.put('conversations', conv)
}

export async function getConversation(id: string): Promise<Conversation | undefined> {
  const db = await getDB()
  return db.get('conversations', id)
}

export async function getAllConversations(): Promise<Conversation[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex('conversations', 'by-updated')
  return all.reverse()
}

export async function deleteConversation(id: string) {
  const db = await getDB()
  await db.delete('conversations', id)
}

// Documents
export async function saveDocument(doc: Document) {
  const db = await getDB()
  await db.put('documents', doc)
}

export async function getDocument(id: string): Promise<Document | undefined> {
  const db = await getDB()
  return db.get('documents', id)
}

export async function getAllDocuments(): Promise<Document[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex('documents', 'by-updated')
  return all.reverse()
}

export async function deleteDocument(id: string) {
  const db = await getDB()
  await db.delete('documents', id)
}

// Notes
export async function saveNote(note: Note) {
  const db = await getDB()
  await db.put('notes', note)
}

export async function getNote(id: string): Promise<Note | undefined> {
  const db = await getDB()
  return db.get('notes', id)
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex('notes', 'by-updated')
  return all.reverse()
}

export async function deleteNote(id: string) {
  const db = await getDB()
  await db.delete('notes', id)
}

// App State
export async function getAppState<T>(key: string): Promise<T | undefined> {
  const db = await getDB()
  const entry = await db.get('appState', key)
  return entry?.value as T | undefined
}

export async function setAppState(key: string, value: unknown) {
  const db = await getDB()
  await db.put('appState', { key, value })
}

// Clear all data
export async function clearAllData() {
  const db = await getDB()
  const tx = db.transaction(
    ['conversations', 'documents', 'notes', 'appState'],
    'readwrite'
  )
  await Promise.all([
    tx.objectStore('conversations').clear(),
    tx.objectStore('documents').clear(),
    tx.objectStore('notes').clear(),
    tx.objectStore('appState').clear(),
    tx.done,
  ])
}
