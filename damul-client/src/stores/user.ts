import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  myId: number;
  setMyId: (id: number) => void;

  myNickname: string;
  setMyNickname: (nickname: string) => void;

  myWarningEnable: boolean;
  setWarningEnable: (warningEnable: boolean) => void;
}

const useUserStore = create(
  persist<UserState>(
    (set) => ({
      myId: 0,
      myNickname: "",
      myWarningEnable: true,

      setMyId: (id) => set({ myId: id }),
      setMyNickname: (nickname) => set({ myNickname: nickname }),
      setWarningEnable: (warningEnable) =>
        set({ myWarningEnable: warningEnable }),
    }),
    {
      name: "user",
    },
  ),
);

export default useUserStore;
