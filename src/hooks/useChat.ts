import { useState, useCallback, useRef } from 'react'
import { useWebLLM } from './useWebLLM'
import { saveConversation, getConversation, getDocument } from '@/lib/db'
import { SYSTEM_PROMPT, MAX_CONTEXT_CHARS } from '@/lib/constants'
import type { Message, Conversation } from '@/types'

export function useChat(conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [documentName, setDocumentName] = useState<string | null>(null)
  const { chat, status } = useWebLLM()
  const accumulatorRef = useRef('')
  const rafRef = useRef<number>(0)

  const loadConversation = useCallback(async (id: string) => {
    const conv = await getConversation(id)
    if (conv) {
      setConversation(conv)
      setMessages(conv.messages)
      setDocumentId(conv.documentId ?? null)
      if (conv.documentId) {
        const doc = await getDocument(conv.documentId)
        setDocumentName(doc?.name ?? null)
      }
    }
  }, [])

  const persistConversation = useCallback(
    async (msgs: Message[], docId?: string | null) => {
      const now = Date.now()
      const conv: Conversation = conversation
        ? { ...conversation, messages: msgs, updatedAt: now }
        : {
            id: conversationId || crypto.randomUUID(),
            title: msgs[0]?.content.slice(0, 50) || 'New Chat',
            messages: msgs,
            documentId: docId ?? undefined,
            createdAt: now,
            updatedAt: now,
          }
      if (docId !== undefined) conv.documentId = docId ?? undefined
      setConversation(conv)
      await saveConversation(conv)
      return conv
    },
    [conversation, conversationId]
  )

  const sendMessage = useCallback(
    async (content: string) => {
      if (status !== 'ready' || isStreaming) return

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        createdAt: Date.now(),
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      setIsStreaming(true)

      // Build context with system prompt + optional document context
      let systemContent = SYSTEM_PROMPT
      if (documentId) {
        const doc = await getDocument(documentId)
        if (doc?.extractedText) {
          const truncated = doc.extractedText.slice(0, MAX_CONTEXT_CHARS)
          systemContent += `\n\nDocument context (from "${doc.name}"):\n${truncated}`
        }
      }

      const chatMessages: Array<{
        role: 'user' | 'assistant' | 'system'
        content: string
      }> = [
        { role: 'system', content: systemContent },
        ...updatedMessages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ]

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
      }

      accumulatorRef.current = ''

      const updateUI = () => {
        setMessages((prev) => {
          const last = prev[prev.length - 1]
          if (last?.id === assistantMessage.id) {
            return [
              ...prev.slice(0, -1),
              { ...last, content: accumulatorRef.current },
            ]
          }
          return [
            ...prev,
            { ...assistantMessage, content: accumulatorRef.current },
          ]
        })
      }

      setMessages([...updatedMessages, assistantMessage])

      try {
        const stream = chat(chatMessages)
        for await (const token of stream) {
          accumulatorRef.current += token
          cancelAnimationFrame(rafRef.current)
          rafRef.current = requestAnimationFrame(updateUI)
        }
        // Final update
        cancelAnimationFrame(rafRef.current)
        const finalContent = accumulatorRef.current
        const finalMessages = [
          ...updatedMessages,
          { ...assistantMessage, content: finalContent },
        ]
        setMessages(finalMessages)
        await persistConversation(finalMessages, documentId)
      } catch (err) {
        console.error('Chat error:', err)
        const errorMessages = [
          ...updatedMessages,
          {
            ...assistantMessage,
            content: 'Sorry, I encountered an error. Please try again.',
          },
        ]
        setMessages(errorMessages)
      } finally {
        setIsStreaming(false)
      }
    },
    [messages, chat, status, isStreaming, documentId, persistConversation]
  )

  const attachDocument = useCallback(
    async (docId: string, docName: string) => {
      setDocumentId(docId)
      setDocumentName(docName)
      if (conversation) {
        await persistConversation(messages, docId)
      }
    },
    [conversation, messages, persistConversation]
  )

  const removeDocument = useCallback(async () => {
    setDocumentId(null)
    setDocumentName(null)
    if (conversation) {
      await persistConversation(messages, null)
    }
  }, [conversation, messages, persistConversation])

  return {
    messages,
    isStreaming,
    conversation,
    documentId,
    documentName,
    sendMessage,
    loadConversation,
    attachDocument,
    removeDocument,
  }
}
