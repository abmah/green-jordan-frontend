import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';


const useUserStore = create((set) => ({
  userId: null,
  setuserId: async (id) => {
    await SecureStore.setItemAsync('userId', id);
    set({ userId: id });
  },
  getuserId: async () => {
    const id = await SecureStore.getItemAsync('userId');
    set({ userId: id });
    return id;
  },
  clearuserId: async () => {
    await SecureStore.deleteItemAsync('userId');
    set({ userId: null });
  }
}));

export default useUserStore;
