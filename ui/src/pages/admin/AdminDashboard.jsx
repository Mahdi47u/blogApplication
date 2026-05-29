import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiFetch } from "../../utils/api.js";
import AdminSubnav from "../../components/admin/AdminSubnav.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import { ErrorState } from "../../components/ui/StateBlock.jsx";

export default function AdminDashboard() {
    const { token } = useContext(AuthContext);
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) loadDashboard();
    }, [token]);

    async function loadDashboard() {
        try {
            setLoading(true);
            setError(null);

            const data = await apiFetch("http://localhost:8080/api/admin/dashboard");
            setDashboard(data);
        } catch (error) {
            console.error("Failed to load admin dashboard:", error);
            setError("Dashboard data could not be loaded.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    if (!dashboard) {
        return null;
    }

    return (
        <div className="space-y-8">
            <AdminSubnav />

            <PageHeader
                eyebrow="Admin"
                title="Dashboard"
                description="Monitor the blog, review activity, and jump into moderation work."
                meta={<p className="text-sm text-slate-500">Updated {formatDateTime(dashboard.generatedAt)}</p>}
            />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {dashboard.metrics.map((metric) => (
                    <MetricCard key={metric.label} metric={metric} />
                ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-6">
                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">
                                Management
                            </h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {dashboard.actions.map((action) => (
                                <ActionPanel key={action.path} action={action} />
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-2">
                        <RecentUsers users={dashboard.recentUsers} />
                        <RecentPosts posts={dashboard.recentPosts} />
                    </section>
                </div>

                <RoleSummary dashboard={dashboard} />
            </section>
        </div>
    );
}

function MetricCard({ metric }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{metric.value}</p>
            <p className="mt-2 text-sm text-slate-500">{metric.description}</p>
        </div>
    );
}

function ActionPanel({ action }) {
    return (
        <Link
            to={action.path}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
        >
            <h3 className="text-base font-semibold text-slate-950">{action.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>
            <span className="mt-5 inline-block text-sm font-medium text-blue-600">
                Open
            </span>
        </Link>
    );
}

function RoleSummary({ dashboard }) {
    const roles = [
        { label: "Regular Users", value: dashboard.regularUsers },
        { label: "Admins", value: dashboard.admins },
        { label: "Super Admins", value: dashboard.superAdmins }
    ];

    return (
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Role Summary</h2>
            <p className="mt-2 text-sm text-slate-600">
                Account access distribution across the system.
            </p>

            <div className="mt-6 space-y-4">
                {roles.map((role) => (
                    <div key={role.label}>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700">{role.label}</span>
                            <span className="text-slate-500">{role.value}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-slate-100">
                            <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{ width: `${getPercent(role.value, dashboard.totalUsers)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}

function RecentUsers({ users }) {
    return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-950">Recent Users</h2>
                <Link to="/admin/users" className="text-sm font-medium text-blue-600 hover:underline">
                    View all
                </Link>
            </div>

            <div className="divide-y divide-slate-100">
                {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between gap-4 py-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900">
                                {user.username}
                            </p>
                            <p className="truncate text-sm text-slate-500">{user.email}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-medium text-slate-500">
                                {user.enabled ? "Active" : "Disabled"}
                            </p>
                            <p className="text-xs text-slate-400">{formatDate(user.createdAt)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function RecentPosts({ posts }) {
    return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-950">Recent Posts</h2>
                <Link to="/admin/posts" className="text-sm font-medium text-blue-600 hover:underline">
                    View all
                </Link>
            </div>

            <div className="divide-y divide-slate-100">
                {posts.map((post) => (
                    <div key={post.id} className="py-3">
                        <Link
                            to={`/posts/${post.id}`}
                            className="line-clamp-1 text-sm font-medium text-slate-900 hover:text-blue-600"
                        >
                            {post.title}
                        </Link>
                        <div className="mt-1 flex items-center justify-between gap-4 text-xs text-slate-500">
                            <span>By {post.authorName || `User ${post.authorId}`}</span>
                            <span>{formatDate(post.createdAt)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="h-32 animate-pulse rounded-lg bg-slate-100" />
                ))}
            </div>
            <div className="h-80 animate-pulse rounded-lg bg-slate-100" />
        </div>
    );
}

function getPercent(value, total) {
    if (!total) return 0;
    return Math.min(100, Math.round((value / total) * 100));
}

function formatDate(value) {
    if (!value) return "Unknown";
    return new Date(value).toLocaleDateString();
}

function formatDateTime(value) {
    if (!value) return "just now";
    return new Date(value).toLocaleString();
}
