import { create } from "zustand";

interface UserState {
  myId: number;
  setUserId: (id: number) => void;
}

const useUserStore = create<UserState>((set) => ({
  myId: 1,
  setUserId: (id: number) => set({ myId: id }),
}));

export default useUserStore;
