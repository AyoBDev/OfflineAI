import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isWebGPUSupported, isMobileDevice } from '@/lib/webllm'

export function WebGPUCheck({ children }: { children: React.ReactNode }) {
  const [dismissed, setDismissed] = useState(false)

  const supported = isWebGPUSupported()
  const mobile = isMobileDevice()
  const showBanner = !dismissed && (!supported || mobile)

  const message = !supported
    ? 'Your browser does not support WebGPU. AI chat features require a desktop browser like Chrome 113+ or Edge 113+.'
    : 'You\'re on a mobile device. Local AI inference requires a desktop browser with WebGPU. You can still use notes, documents, and explore the app.'

  return (
    <>
      {showBanner && (
        <div className="relative flex items-center gap-3 bg-orange-50 border-b border-orange-200 px-4 py-3 text-sm text-orange-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <p className="flex-1">{message}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-orange-600 hover:text-orange-800 hover:bg-orange-100"
            onClick={() => setDismissed(true)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
      {children}
    </>
  )
}
