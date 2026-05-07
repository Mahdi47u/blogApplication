import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
    const { token } = useContext(AuthContext);

    if (!token) return <Navigate to="/login" replace />;

    return <Outlet />;
}
