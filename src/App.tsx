import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AppProvider } from '@/contexts/AppContext'
import { AppLayout } from '@/layout/AppLayout'
import { AboutPage } from '@/pages/AboutPage'
import { ToolPage } from '@/pages/ToolPage'

function App() {
  return (
    <AppProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<ToolPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
        <Toaster />
      </Router>
    </AppProvider>
  )
}

export default App
