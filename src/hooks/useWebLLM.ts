import { useState, useCallback, useEffect } from 'react'
import type { ModelStatus, ModelProgress } from '@/types'
import { getEngine, loadModel as loadModelSingleton } from '@/lib/webllm'

export function useWebLLM() {
  const [status, setStatus] = useState<ModelStatus>(() =>
    getEngine() ? 'ready' : 'idle'
  )
  const [progress, setProgress] = useState<ModelProgress>({
    progress: 0,
    timeElapsed: 0,
    text: '',
  })

  // Poll for engine becoming ready (e.g. background load from onboarding)
  useEffect(() => {
    if (status === 'ready' || status === 'loading') return
    const interval = setInterval(() => {
      if (getEngine()) {
        setStatus('ready')
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [status])

  const loadModel = useCallback(async () => {
    if (getEngine()) {
      setStatus('ready')
      return
    }
    setStatus('loading')
    try {
      await loadModelSingleton((report) => {
        setProgress({
          progress: report.progress,
          timeElapsed: report.timeElapsed,
          text: report.text,
        })
      })
      setStatus('ready')
    } catch (err) {
      console.error('Failed to load model:', err)
      setStatus('error')
      throw err
    }
  }, [])

  const chat = useCallback(async function* (
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
  ) {
    const engine = getEngine()
    if (!engine) throw new Error('Model not loaded')

    const asyncChunks = await engine.chat.completions.create({
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    })

    for await (const chunk of asyncChunks) {
      const delta = chunk.choices[0]?.delta?.content
      if (delta) yield delta
    }
  }, [])

  return { status, progress, loadModel, chat }
}
