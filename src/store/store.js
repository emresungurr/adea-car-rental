import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  login: (role, userName) => set({ user: { role, name: userName || "Staff Member" } }),
  logout: () => set({ user: null }),
}));

export const useSearchStore = create((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
}));