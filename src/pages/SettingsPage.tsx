import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useWebLLM } from '@/hooks/useWebLLM'
import { useOnboarding } from '@/hooks/useOnboarding'
import { clearAllData } from '@/lib/db'
import { MODEL_ID } from '@/lib/constants'

export function SettingsPage() {
  const navigate = useNavigate()
  const { status } = useWebLLM()
  const { reset } = useOnboarding()

  const handleClearData = async () => {
    if (!window.confirm('This will delete all your conversations, notes, and documents. Continue?')) return
    await clearAllData()
    window.location.reload()
  }

  const handleRerunOnboarding = () => {
    reset()
    navigate('/onboarding')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Model</span>
            <span className="font-mono text-xs">{MODEL_ID}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="capitalize">{status}</span>
          </div>
          <Separator />
          <Button variant="outline" size="sm" onClick={handleRerunOnboarding}>
            Re-download Model
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            All your data is stored locally on this device. Nothing is sent to any server.
          </p>
          <Separator />
          <Button variant="destructive" size="sm" onClick={handleClearData}>
            Clear All Data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">About</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>StudyBuddy - Offline-First AI Learning Platform</p>
          <p>All AI processing runs locally on your device via WebGPU.</p>
          <p>Your data never leaves your browser.</p>
        </CardContent>
      </Card>
    </div>
  )
}
