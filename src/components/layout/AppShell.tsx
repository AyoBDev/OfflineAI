import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useWebLLM } from '@/hooks/useWebLLM'
import { OfflineIndicator } from '@/components/common/OfflineIndicator'
import { WebGPUCheck } from '@/components/common/WebGPUCheck'

export function AppShell() {
  const navigate = useNavigate()
  const { status } = useWebLLM()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNewChat = () => {
    navigate('/chat')
    setMobileOpen(false)
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar modelStatus={status} onNewChat={handleNewChat} />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-3 top-3 z-40 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar modelStatus={status} onNewChat={handleNewChat} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <WebGPUCheck>
          <OfflineIndicator />
        </WebGPUCheck>
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
