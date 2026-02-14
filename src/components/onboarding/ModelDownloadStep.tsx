import { useEffect, useRef, useState } from 'react'
import { Download, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useWebLLM } from '@/hooks/useWebLLM'

export function ModelDownloadStep({ onNext }: { onNext: () => void }) {
  const { status, progress, loadModel } = useWebLLM()
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)

  const startDownload = async () => {
    setError(null)
    try {
      await loadModel()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load model')
    }
  }

  useEffect(() => {
    if (!started.current) {
      started.current = true
      startDownload()
    }
  }, [])

  const progressPercent = Math.round(progress.progress * 100)

  return (
    <div className="flex flex-col items-center gap-6 text-center max-w-md">
      <div className="rounded-full bg-primary/10 p-6">
        <Download className="h-12 w-12 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Downloading AI Model</h2>
        <p className="text-muted-foreground text-sm">
          This is a one-time download (~2-4 GB). The model will be cached
          locally for offline use.
        </p>
      </div>

      <div className="w-full space-y-2">
        <Progress value={progressPercent} className="h-3" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{progress.text || 'Initializing...'}</span>
          <span>{progressPercent}%</span>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div className="text-left">
            <p className="font-medium">Download failed</p>
            <p className="text-xs">{error}</p>
          </div>
        </div>
      )}

      {error && (
        <Button onClick={startDownload} variant="outline">
          Retry Download
        </Button>
      )}

      {status === 'ready' && (
        <Button size="lg" onClick={onNext}>
          Continue
        </Button>
      )}

      <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onNext}>
        {status === 'loading' ? 'Skip — download in background' : 'Skip for now'}
      </Button>
    </div>
  )
}
