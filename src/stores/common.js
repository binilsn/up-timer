import { create } from "zustand";

export const useCommon = create((set) => ({
  selectedEndpoint: null,
  setSelectedEndpoint: (id) => set({ selectedEndpoint: id })
}))
