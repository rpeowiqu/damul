import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  myId: number;
  setMyId: (id: number) => void;

  myNickname: string;
  setMyNickname: (nickname: string) => void;

  myWarningEnabled: boolean;
  setWarningEnabled: (warningEnable: boolean) => void;
}

const useUserStore = create(
  persist<UserState>(
    (set) => ({
      myId: 0,
      myNickname: "",
      myWarningEnabled: true,

      setMyId: (id) => set({ myId: id }),
      setMyNickname: (nickname) => set({ myNickname: nickname }),
      setWarningEnabled: (warningEnabled) =>
        set({ myWarningEnabled: warningEnabled }),
    }),
    {
      name: "user",
    },
  ),
);

export default useUserStore;
