// store/useAuthStore.js

import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null,
    isAdmin: false,
    setUser: (user) =>
        set({
            user: {
                email: user.email,
                userId: user.userId,
                name: user.name,
            },
            isAdmin: user.isAdmin,
            role: user.role,
        }),
    clearUser: () => set({ user: null, isAdmin: false, role: null }),
}));

export default useAuthStore;
