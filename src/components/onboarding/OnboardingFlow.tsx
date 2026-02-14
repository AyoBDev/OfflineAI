import { useState } from 'react'
import { WelcomeStep } from './WelcomeStep'
import { ModelDownloadStep } from './ModelDownloadStep'
import { ReadyStep } from './ReadyStep'
import { canRunLocalLLM } from '@/lib/webllm'

type Step = 'welcome' | 'download' | 'ready'

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>('welcome')
  const supportsLLM = canRunLocalLLM()

  const handleWelcomeNext = () => {
    if (supportsLLM) {
      setStep('download')
    } else {
      // Skip model download on mobile / unsupported browsers
      setStep('ready')
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      {step === 'welcome' && (
        <WelcomeStep onNext={handleWelcomeNext} isMobile={!supportsLLM} />
      )}
      {step === 'download' && (
        <ModelDownloadStep onNext={() => setStep('ready')} />
      )}
      {step === 'ready' && <ReadyStep onFinish={onComplete} isMobile={!supportsLLM} />}
    </div>
  )
}
