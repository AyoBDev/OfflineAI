import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ChatPage } from '@/pages/ChatPage'
import { WorkspacePage } from '@/pages/WorkspacePage'
import { SettingsPage } from '@/pages/SettingsPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { useOnboarding } from '@/hooks/useOnboarding'
import { WebGPUCheck } from '@/components/common/WebGPUCheck'

function AppRoutes() {
  const { isComplete } = useOnboarding()

  return (
    <Routes>
      <Route
        path="/onboarding"
        element={isComplete ? <Navigate to="/chat" replace /> : <OnboardingPage />}
      />
      <Route
        element={!isComplete ? <Navigate to="/onboarding" replace /> : <AppShell />}
      >
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/" element={<Navigate to="/chat" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <WebGPUCheck>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </WebGPUCheck>
  )
}
