import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../api/auth";
import socket from "../socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });

    useEffect(() => {
        if (!token) {
            return;
        }

        socket.auth = {
            token,
        };

        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, [token]);

    const login = async (credentials) => {
        const data = await loginUser(credentials);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);

        return data;
    };

    const logout = () => {        
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated: !!token,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};