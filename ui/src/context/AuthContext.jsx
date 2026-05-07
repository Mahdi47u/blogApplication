import { createContext, useState, useEffect } from "react";
import { login, register } from "../services/authService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");

        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [token, user]);

    async function loginUser(credentials) {
        const response = await login(credentials);  // returns token
        setToken(response.token);

        // fetch full user data
        const meRes = await fetch("http://localhost:8080/api/users/me", {
            headers: { Authorization: `Bearer ${response.token}` }
        });

        const userData = await meRes.json();

        setUser(userData);
    }

    async function registerUser(data) {
        const response = await register(data); // returns token
        setToken(response.token);

        const meRes = await fetch("http://localhost:8080/api/users/me", {
            headers: { Authorization: `Bearer ${response.token}` }
        });

        const userData = await meRes.json();

        setUser(userData);
    }

    function logoutUser() {
        setToken(null);
        setUser(null);
    }

    const value = { user, token, loginUser, logoutUser, registerUser };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
