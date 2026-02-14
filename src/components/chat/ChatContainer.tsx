import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { StreamingIndicator } from './StreamingIndicator'
import { DocumentAttachment } from './DocumentAttachment'
import { useChat } from '@/hooks/useChat'
import { useWebLLM } from '@/hooks/useWebLLM'
import { extractTextFromFile } from '@/lib/documents'
import { saveDocument } from '@/lib/db'
import { MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export function ChatContainer() {
  const { conversationId } = useParams()
  const {
    messages,
    isStreaming,
    documentName,
    sendMessage,
    loadConversation,
    attachDocument,
    removeDocument,
  } = useChat(conversationId)
  const { status, progress, loadModel } = useWebLLM()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId)
    }
  }, [conversationId, loadConversation])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleFileUpload = async (file: File) => {
    try {
      const extractedText = await extractTextFromFile(file)
      const doc = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        extractedText,
        size: file.size,
        createdAt: Date.now(),
      }
      await saveDocument(doc)
      await attachDocument(doc.id, doc.name)
    } catch (err) {
      console.error('Failed to process file:', err)
    }
  }

  const isModelReady = status === 'ready'

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <h2 className="text-sm font-medium">
          {messages.length > 0 ? 'Chat' : 'New Chat'}
        </h2>
        {documentName && (
          <DocumentAttachment name={documentName} onRemove={removeDocument} />
        )}
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
            {isModelReady ? (
              <>
                <MessageSquare className="h-12 w-12 opacity-20" />
                <p className="text-sm">Send a message to start chatting</p>
              </>
            ) : status === 'loading' ? (
              <>
                <Loader2 className="h-10 w-10 animate-spin opacity-40" />
                <p className="text-sm font-medium">Loading AI model...</p>
                <div className="w-64 space-y-1">
                  <Progress value={Math.round(progress.progress * 100)} className="h-2" />
                  <p className="text-xs text-center">{progress.text || 'Initializing...'}</p>
                </div>
              </>
            ) : status === 'error' ? (
              <>
                <MessageSquare className="h-12 w-12 opacity-20" />
                <p className="text-sm">Model failed to load</p>
                <Button size="sm" variant="outline" onClick={() => loadModel()}>
                  Retry
                </Button>
              </>
            ) : (
              <>
                <MessageSquare className="h-12 w-12 opacity-20" />
                <p className="text-sm">AI model not loaded</p>
                <Button size="sm" onClick={() => loadModel()}>
                  Load Model
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <StreamingIndicator />
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <ChatInput
          onSend={sendMessage}
          onFileUpload={handleFileUpload}
          disabled={!isModelReady || isStreaming}
        />
      </div>
    </div>
  )
}
