import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiFetch } from "../../utils/api";

const ROLES = ["USER", "ADMIN", "SUPERADMIN"];

export default function AdminUsersPage() {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [newAdmin, setNewAdmin] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [createError, setCreateError] = useState(null);
    const [actionId, setActionId] = useState(null);
    const [creatingAdmin, setCreatingAdmin] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            setLoading(true);
            setError(null);

            const data = await apiFetch("http://localhost:8080/api/admin/users");
            setUsers(data || []);
        } catch (error) {
            console.error("Failed to load users:", error);
            setError("Users could not be loaded.");
        } finally {
            setLoading(false);
        }
    }

    async function deleteUser(id) {
        if (!confirm("Delete this user? This action cannot be undone.")) return;

        try {
            setActionId(id);
            await apiFetch(`http://localhost:8080/api/admin/users/${id}`, {
                method: "DELETE"
            });
            await loadUsers();
        } catch (error) {
            console.error("Failed to delete user:", error);
            setError(error.message || "User could not be deleted.");
        } finally {
            setActionId(null);
        }
    }

    async function changeRole(id, role) {
        try {
            setActionId(id);
            await apiFetch(`http://localhost:8080/api/admin/users/${id}/roles`, {
                method: "PUT",
                body: JSON.stringify({ role })
            });
            await loadUsers();
        } catch (error) {
            console.error("Failed to update role:", error);
            setError(error.message || "Role could not be updated.");
        } finally {
            setActionId(null);
        }
    }

    async function createAdmin(event) {
        event.preventDefault();

        try {
            setCreatingAdmin(true);
            setCreateError(null);

            await apiFetch("http://localhost:8080/api/admin/users/admins", {
                method: "POST",
                body: JSON.stringify(newAdmin)
            });

            setNewAdmin({ username: "", email: "", password: "" });
            await loadUsers();
        } catch (error) {
            console.error("Failed to create admin:", error);
            setCreateError(error.message || "Admin could not be created.");
        } finally {
            setCreatingAdmin(false);
        }
    }

    const filteredUsers = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return users.filter((user) => {
            const matchesSearch =
                !normalizedSearch ||
                user.username?.toLowerCase().includes(normalizedSearch) ||
                user.email?.toLowerCase().includes(normalizedSearch);

            const matchesRole =
                roleFilter === "ALL" ||
                user.roles?.includes(roleFilter);

            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);

    const isSuperAdmin = currentUser?.roles?.includes("SUPERADMIN");

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-medium text-blue-600">Admin</p>
                    <h1 className="mt-1 text-3xl font-semibold text-slate-950">
                        User Management
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Review accounts, change roles, and remove unsafe users.
                    </p>
                </div>

                <p className="text-sm text-slate-500">
                    {filteredUsers.length} of {users.length} users
                </p>
            </header>

            <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search username or email..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:max-w-sm"
                />

                <select
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                    <option value="ALL">All roles</option>
                    {ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </section>

            {isSuperAdmin && (
                <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-slate-950">Create Admin</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Add a new admin account with moderation access.
                        </p>
                    </div>

                    {createError && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {createError}
                        </div>
                    )}

                    <form onSubmit={createAdmin} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                        <input
                            type="text"
                            value={newAdmin.username}
                            onChange={(event) => setNewAdmin((value) => ({
                                ...value,
                                username: event.target.value
                            }))}
                            placeholder="Username"
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            required
                        />
                        <input
                            type="email"
                            value={newAdmin.email}
                            onChange={(event) => setNewAdmin((value) => ({
                                ...value,
                                email: event.target.value
                            }))}
                            placeholder="Email"
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            required
                        />
                        <input
                            type="password"
                            value={newAdmin.password}
                            onChange={(event) => setNewAdmin((value) => ({
                                ...value,
                                password: event.target.value
                            }))}
                            placeholder="Password"
                            minLength={6}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            required
                        />
                        <button
                            type="submit"
                            disabled={creatingAdmin}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {creatingAdmin ? "Creating" : "Create Admin"}
                        </button>
                    </form>
                </section>
            )}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <div className="p-6 text-sm text-slate-600">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-6 text-sm text-slate-600">No users found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[820px] text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-semibold">User</th>
                                <th className="px-4 py-3 font-semibold">Roles</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Joined</th>
                                <th className="px-4 py-3 text-right font-semibold">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-4">
                                        <p className="font-medium text-slate-950">{user.username}</p>
                                        <p className="text-slate-500">{user.email}</p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {user.roles?.map((role) => (
                                                <RoleBadge key={role} role={role} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                            user.enabled
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-slate-100 text-slate-600"
                                        }`}>
                                            {user.enabled ? "Active" : "Disabled"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-slate-500">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-end gap-2">
                                            <select
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                                                value={user.roles?.[0] || "USER"}
                                                onChange={(event) => changeRole(user.id, event.target.value)}
                                                disabled={actionId === user.id || !canChangeRole(currentUser, user, isSuperAdmin)}
                                            >
                                                {ROLES.map((role) => (
                                                    <option
                                                        key={role}
                                                        value={role}
                                                        disabled={!isSuperAdmin && role !== "USER"}
                                                    >
                                                        {role}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                type="button"
                                                onClick={() => deleteUser(user.id)}
                                                disabled={actionId === user.id || !canDeleteUser(currentUser, user)}
                                                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

function RoleBadge({ role }) {
    const tone = role === "SUPERADMIN"
        ? "bg-purple-50 text-purple-700"
        : role === "ADMIN"
            ? "bg-blue-50 text-blue-700"
            : "bg-slate-100 text-slate-700";

    return (
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
            {role}
        </span>
    );
}

function canChangeRole(currentUser, targetUser, isSuperAdmin) {
    if (!currentUser || !targetUser || currentUser.id === targetUser.id) return false;
    if (isSuperAdmin) return true;
    return targetUser.roles?.includes("USER") && !targetUser.roles?.includes("ADMIN") && !targetUser.roles?.includes("SUPERADMIN");
}

function canDeleteUser(currentUser, targetUser) {
    if (!currentUser || !targetUser || currentUser.id === targetUser.id) return false;
    if (currentUser.roles?.includes("SUPERADMIN")) return true;
    return targetUser.roles?.includes("USER") && !targetUser.roles?.includes("ADMIN") && !targetUser.roles?.includes("SUPERADMIN");
}

function formatDate(value) {
    if (!value) return "Unknown";
    return new Date(value).toLocaleDateString();
}
