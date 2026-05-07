import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiFetch } from "../../utils/api.js";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    const { token } = useContext(AuthContext);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (token) loadStats();
    }, [token]);

    async function loadStats() {
        const data = await apiFetch("http://localhost:8080/api/admin/stats");
        setStats(data);
    }

    if (!stats) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <DashboardCard title="Total Users" value={stats.totalUsers} />
                <DashboardCard title="Total Posts" value={stats.totalPosts} />
                <DashboardCard title="Admins" value={stats.admins} />
            </div>

            {/* Role counts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <DashboardCard title="Users" value={stats.users} />
                <DashboardCard title="Admins" value={stats.admins} />
                <DashboardCard title="Super Admins" value={stats.superAdmins} />
            </div>

            <div className="flex gap-4">
                <Link to="/admin/users" className="px-5 py-3 bg-blue-600 text-white rounded">
                    Manage Users
                </Link>

                <Link to="/admin/posts" className="px-5 py-3 bg-gray-700 text-white rounded">
                    Moderate Posts
                </Link>
            </div>
        </div>
    );
}

function DashboardCard({ title, value }) {
    return (
        <div className="p-6 border rounded shadow-sm">
            <h2 className="text-gray-500">{title}</h2>
            <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
    );
}
