import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isWebGPUSupported } from '@/lib/webllm'

export function WebGPUCheck({ children }: { children: React.ReactNode }) {
  if (!isWebGPUSupported()) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>WebGPU Not Supported</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Your browser doesn't support WebGPU, which is required to run the
              AI model locally.
            </p>
            <p>Please try one of the following:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use Chrome 113+ or Edge 113+</li>
              <li>Enable WebGPU in your browser's flags</li>
              <li>Update your browser to the latest version</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
