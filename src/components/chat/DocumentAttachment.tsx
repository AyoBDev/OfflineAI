import { FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DocumentAttachmentProps {
  name: string
  onRemove: () => void
}

export function DocumentAttachment({ name, onRemove }: DocumentAttachmentProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-1.5 text-sm">
      <FileText className="h-4 w-4 text-muted-foreground" />
      <span className="truncate max-w-[200px]">{name}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}
