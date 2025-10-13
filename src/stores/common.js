import { create } from "zustand";

export const useCommon = create((set) => ({
  selectedEndpoint: null,
  endpoints: [],
  setEndpoints: (endpoints) => set({ endpoints: endpoints }),
  setSelectedEndpoint: (id) => set({ selectedEndpoint: id })
}))
