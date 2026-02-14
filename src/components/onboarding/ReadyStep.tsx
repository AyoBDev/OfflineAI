import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'

export function ReadyStep({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="rounded-full bg-green-100 p-6">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">You're All Set!</h2>
        <p className="text-muted-foreground max-w-md">
          {APP_NAME} is ready to help you study. The AI model is loaded and
          everything works offline.
        </p>
      </div>
      <Button size="lg" onClick={onFinish}>
        Start Learning
      </Button>
    </div>
  )
}
