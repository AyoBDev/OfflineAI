import type { ModelStatus } from '@/types'

const statusConfig: Record<ModelStatus, { label: string; color: string }> = {
  idle: { label: 'Model not loaded', color: 'bg-gray-400' },
  loading: { label: 'Loading model...', color: 'bg-yellow-400' },
  ready: { label: 'Model ready', color: 'bg-green-400' },
  error: { label: 'Model error', color: 'bg-red-400' },
}

export function ModelStatusBadge({ status }: { status: ModelStatus }) {
  const config = statusConfig[status]
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className={`h-2 w-2 rounded-full ${config.color}`} />
      {config.label}
    </div>
  )
}
