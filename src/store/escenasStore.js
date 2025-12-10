import { create } from "zustand";

export const useEscenasStore = create((set, get) => ({
  escenas: [],
  setEscenas: (escenas) => set({ escenas }),
  addEscena: (escena) => set((s) => ({ escenas: [...s.escenas, escena] })),
  removeEscena: (id) =>
    set((s) => ({ escenas: s.escenas.filter((e) => String(e.id) !== String(id)) })),
  updateEscena: (id, patch) =>
    set((s) => ({
      escenas: s.escenas.map((e) =>
        String(e.id) === String(id) ? { ...e, ...patch } : e
      ),
    })),
  getEscena: (id) => get().escenas.find((e) => String(e.id) === String(id)),
}));