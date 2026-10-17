import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type SidebarState = {
  collapsed: boolean
  toggle: () => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggle: () => {
        set((state) => ({ collapsed: !state.collapsed }))
      },
    }),
    {
      name: 'sidebar',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ collapsed }) => ({ collapsed }),
    },
  ),
)
