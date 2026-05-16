import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";

export const socketContext = createContext()

export const SocketContextProvider = ({ children }) => { 
    const { currentUser } = useContext(AuthContext)
    
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        setSocket(io("http://localhost:4000"))
    }, [])
    
    useEffect(() => {
      currentUser && socket?.emit("newUser", currentUser.id);
    }, [currentUser, socket]);

    return (
        <socketContext.Provider value={{socket}}>
            {children}
        </socketContext.Provider>   
    )
}