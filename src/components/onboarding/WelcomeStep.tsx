import { BookOpen, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'

interface WelcomeStepProps {
  onNext: () => void
  isMobile?: boolean
}

export function WelcomeStep({ onNext, isMobile }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="rounded-full bg-primary/10 p-6">
        <BookOpen className="h-12 w-12 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome to {APP_NAME}</h1>
        <p className="text-muted-foreground max-w-md text-sm sm:text-base">
          Your private AI study companion that runs entirely on your device. No
          cloud, no tracking — just you and your studies.
        </p>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground max-w-md text-left">
        <p>Here's what makes {APP_NAME} special:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>AI runs locally — your conversations stay private</li>
          <li>Works offline after initial setup</li>
          <li>Upload documents and get help understanding them</li>
          <li>Take notes alongside your AI tutor</li>
        </ul>
      </div>

      {isMobile && (
        <div className="flex items-start gap-2 rounded-md bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800 max-w-md text-left">
          <Smartphone className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            AI chat requires a desktop browser with WebGPU. On mobile, you can
            still use notes, documents, and explore the app.
          </p>
        </div>
      )}

      <Button size="lg" onClick={onNext}>
        Get Started
      </Button>
    </div>
  )
}
