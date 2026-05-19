import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set) => ({
    number: 0,
    fetch: async () => {
        try {
            const res = await apiRequest("/users/notification");
            set({ number: res.data.number })
        } catch (error) {
            console.log(error)
        }
    },
    increase: () => {
        set((prev) => ({ number: prev.number + 1 }));
    },
    decrease: () => {
        set((prev) => ({ number: Math.max(0, prev.number - 1) }));
    },
    reset: () => {
        set((prev) => ({ number: 0 }));
    },
}))