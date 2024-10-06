import { create } from 'zustand';

const useUserData = create((set, get) => ({
  userData: null,


  setUserData: (data) => {
    set({ userData: data });
  },

  getUserData: () => {
    return get().userData;
  },

  clearUserData: () => {
    set({ userData: null });
  }
}));

export default useUserData;
