import { create } from 'zustand'

type GlobalLoadingState = {
  isLoading: boolean
  label: string
  show: (label?: string) => void
  hide: () => void
}

export const useGlobalLoading = create<GlobalLoadingState>((set) => ({
  isLoading: false,
  label: 'Loading...',
  show: (label = 'Loading...') => set({ isLoading: true, label }),
  hide: () => set({ isLoading: false }),
}))