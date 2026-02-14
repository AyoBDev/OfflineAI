import { useNavigate } from 'react-router-dom'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { useOnboarding } from '@/hooks/useOnboarding'

export function OnboardingPage() {
  const navigate = useNavigate()
  const { complete } = useOnboarding()

  const handleComplete = () => {
    complete()
    navigate('/chat', { replace: true })
  }

  return <OnboardingFlow onComplete={handleComplete} />
}
