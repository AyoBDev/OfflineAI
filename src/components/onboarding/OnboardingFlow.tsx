import { useState } from 'react'
import { WelcomeStep } from './WelcomeStep'
import { ModelDownloadStep } from './ModelDownloadStep'
import { ReadyStep } from './ReadyStep'

type Step = 'welcome' | 'download' | 'ready'

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>('welcome')

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      {step === 'welcome' && (
        <WelcomeStep onNext={() => setStep('download')} />
      )}
      {step === 'download' && (
        <ModelDownloadStep onNext={() => setStep('ready')} />
      )}
      {step === 'ready' && <ReadyStep onFinish={onComplete} />}
    </div>
  )
}
