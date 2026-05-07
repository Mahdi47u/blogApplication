import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../utils/api";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAdmin() {
    const { token } = useContext(AuthContext);
    const [allowed, setAllowed] = useState(null);

    useEffect(() => {
        const checkRole = async () => {
            try {
                const res = await apiFetch("http://localhost:8080/api/users/me");
                const roles = res.roles || [];

                setAllowed(roles.includes("ADMIN") || roles.includes("SUPERADMIN"));
            } catch {
                setAllowed(false);
            }
        };

        checkRole();
    }, [token]);

    if (!token) return <Navigate to="/login" replace />;
    if (allowed === null) return <div className="p-8">Checking permissions...</div>;
    if (!allowed) return <Navigate to="/" replace />;

    return <Outlet />;
}
