export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  documentId?: string
  createdAt: number
  updatedAt: number
}

export interface Document {
  id: string
  name: string
  type: string
  extractedText: string
  size: number
  createdAt: number
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface ModelProgress {
  progress: number
  timeElapsed: number
  text: string
}
