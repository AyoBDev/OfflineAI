import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1.5 text-xs text-yellow-800">
      <WifiOff className="h-3.5 w-3.5" />
      <span>You're offline. The app will continue working with cached data.</span>
    </div>
  )
}
