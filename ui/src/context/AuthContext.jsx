import { createContext, useState, useEffect } from "react";
import { login, register } from "../services/authService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const CURRENT_USER_URL = "http://localhost:8080/api/users/me";

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (!token) {
            return;
        }

        refreshUser(token).catch((error) => {
            console.error("Failed to refresh current user:", error);
        });
    }, [token]);

    useEffect(() => {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");

        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [token, user]);

    async function loginUser(credentials) {
        const response = await login(credentials);  // returns token
        setToken(response.token);

        await refreshUser(response.token);
    }

    async function registerUser(data) {
        const response = await register(data); // returns token
        setToken(response.token);

        await refreshUser(response.token);
    }

    async function refreshUser(authToken = token) {
        if (!authToken) {
            return null;
        }

        const meRes = await fetch(CURRENT_USER_URL, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        if (!meRes.ok) {
            throw new Error("Failed to load current user");
        }

        const userData = await meRes.json();

        setUser(userData);
        return userData;
    }

    function updateUser(nextUser) {
        setUser(nextUser);
    }

    function logoutUser() {
        setToken(null);
        setUser(null);
    }

    const value = {
        user,
        token,
        loginUser,
        logoutUser,
        registerUser,
        refreshUser,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
