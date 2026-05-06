import { createContext, useState, useEffect } from "react";
import { login, register } from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => localStorage.getItem("username"));

    useEffect(() => {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");

        if (user) localStorage.setItem("username", user);
        else localStorage.removeItem("username");
    }, [token, user]);

    async function loginUser(credentials) {
        const response = await login(credentials);

        setToken(response.token);
        setUser(credentials.username);
    }

    async function registerUser(userData) {
        const response = await register(userData);

        setToken(response.token);
        setUser(response.username);
    }


    function logoutUser() {
        setToken(null);
        setUser(null);
    }

    const value = { user, token , loginUser, logoutUser, registerUser };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
