import { create } from "zustand";

interface AlarmState {
  alarmCnt: number;
  setAlarmCnt: (count: number) => void;
  increaseAlarmCnt: () => void;
}

export const useAlarmStore = create<AlarmState>((set) => ({
  alarmCnt: 0,
  setAlarmCnt: (count) => set({ alarmCnt: count }),
  increaseAlarmCnt: () => set((state) => ({ alarmCnt: state.alarmCnt + 1 })),
}));
