import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      loading: false,
    }),

  setLoading: (loading) => set({ loading }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    }),
}))

export default useAuthStore
