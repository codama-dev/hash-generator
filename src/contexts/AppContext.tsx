import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

// biome-ignore lint/complexity/noBannedTypes: App-level context type; extend as needed
type AppContextType = {}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AppContext.Provider
      value={
        {
          // Context values can be added here as needed
        }
      }
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
