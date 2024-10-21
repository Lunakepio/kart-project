import { create } from "zustand";

export const useStore = create((set, get) => ({
  lapNotValidated: true,
  laps: [],
  lapCount: 0,
  PB: undefined,
  checkpoint: false,
  setLapNotValidated: (lapNotValidated) => {
    set({ lapNotValidated });
  },
  setLapCount: (lapCount) => {
    set({ lapCount });
  },
  setPB: (PB) => {
    set({ PB });
  },
  setLapInfo: (lapInfo) => {
    set({ lapInfo });
  },
  addLap: (lap) => {
    const laps = get().laps;
    if (laps.length >= 5) {
      laps.shift();
    }
    set({ laps: [...laps, lap] });
  },
  getLaps: () => {
    return get().laps;
  },
  incrementLapCount: () => {
    set({ lapCount: get().lapCount + 1 });
  },
  setCheckpoint: (checkpoint) => {
    set({ checkpoint });
  },
}));
