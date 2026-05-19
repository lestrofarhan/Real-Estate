import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";
import { useNotificationStore } from "../lib/notificationStore";

export const socketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const fetch = useNotificationStore((state) => state.fetch);
    const increase = useNotificationStore((state) => state.increase); // Bring in increase action
    const { currentUser } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    
    // 1. Add state to keep track of which chat room is open on screen right now
    const [activeChatId, setActiveChatId] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }
        const newSocket = io(import.meta.env.VITE_SOCKET_URL);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [currentUser]);

    useEffect(() => {
        if (currentUser && socket) {
            socket.emit("newUser", currentUser.id);
        }
    }, [currentUser, socket]);

    // 2. Modified message event listener logic
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (data) => {
             if (activeChatId === data.chatId) {
                return; 
            }
            
            fetch(); 
        };

        socket.on("getMessage", handleMessage);

        return () => {
            socket.off("getMessage", handleMessage);
        };
    }, [socket, activeChatId, fetch]); // activeChatId dependency ensures check handles latest open room

    return (
        <socketContext.Provider value={{ socket, activeChatId, setActiveChatId }}>
            {children}
        </socketContext.Provider>   
    );
};