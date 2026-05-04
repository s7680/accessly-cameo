import { create } from "zustand";

type UserState = {
  onboarded: boolean | null;
  setOnboarded: (value: boolean) => void;
};

export const useUserStore = create<UserState>((set) => ({
  onboarded: null,
  setOnboarded: (value) => set({ onboarded: value }),
}));