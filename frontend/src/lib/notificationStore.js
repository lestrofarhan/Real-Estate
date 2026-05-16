import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set) => ({
    number: 0,
    fetch: async () => {
        try {
            const res = await apiRequest("/user/notifications");
            set({ number: res.data })
        } catch (error) {
            console.log(error)
        }
    },
    decrease: () => {
        set((prev) => ({ number: prev.number - 1 }));
    },
    reset: () => {
        set((prev) => ({ number: 0 }));
    },
}))