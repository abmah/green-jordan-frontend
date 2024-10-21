import { create } from 'zustand';

const useRefreshStore = create((set) => ({
  shouldRefetch: false,
  triggerRefetch: () => set({ shouldRefetch: true }),
  resetRefetch: () => set({ shouldRefetch: false }),
}));

export default useRefreshStore;
