import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // Add your app state here
  count: number
  increment: () => void
  decrement: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    }),
    {
      name: 'app-storage',
    }
  )
)
