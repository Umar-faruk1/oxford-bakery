import { create } from "zustand";

interface SideBarDrawerStore {
  isSidebarOpen: boolean;
  onSidebarOpen: () => void;
  onSidebarClose: () => void;
}

export const useSideBarDrawer = create<SideBarDrawerStore>()((set) => ({
  isSidebarOpen: false, 
  onSidebarOpen: () => set((state)=>({ isSidebarOpen: !state.isSidebarOpen })),
  onSidebarClose: () => set({ isSidebarOpen: false }),
}));
