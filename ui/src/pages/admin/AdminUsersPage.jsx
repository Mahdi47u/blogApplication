import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import AdminSubnav from "../../components/admin/AdminSubnav.jsx";
import { apiFetch } from "../../utils/api";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import { EmptyState, ErrorState } from "../../components/ui/StateBlock.jsx";

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
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
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
        if (confirmDeleteId !== id) {
            setConfirmDeleteId(id);
            return;
        }

        try {
            setActionId(id);
            await apiFetch(`http://localhost:8080/api/admin/users/${id}`, {
                method: "DELETE"
            });
            setConfirmDeleteId(null);
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
            <AdminSubnav />

            <PageHeader
                eyebrow="Admin"
                title="User Management"
                description="Review accounts, change roles, and remove unsafe users."
                meta={<p className="text-sm text-slate-500">{filteredUsers.length} of {users.length} users</p>}
            />

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-950">Filters</h2>
                    {(search || roleFilter !== "ALL") && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setRoleFilter("ALL");
                            }}
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div className="grid gap-3 md:grid-cols-[minmax(0,360px)_220px]">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search username or email..."
                        className="form-input"
                    />

                    <select
                        value={roleFilter}
                        onChange={(event) => setRoleFilter(event.target.value)}
                        className="form-input"
                    >
                        <option value="ALL">All roles</option>
                        {ROLES.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
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
                            className="form-input"
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
                            className="form-input"
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
                            className="form-input"
                            required
                        />
                        <Button
                            type="submit"
                            disabled={creatingAdmin}
                        >
                            {creatingAdmin ? "Creating" : "Create Admin"}
                        </Button>
                    </form>
                </section>
            )}

            {error && (
                <ErrorState message={error} />
            )}

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <div className="p-6 text-sm text-slate-600">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-4">
                        <EmptyState title="No users found" description="Adjust the search or role filter." />
                    </div>
                ) : (
                    <>
                    <div className="divide-y divide-slate-100 md:hidden">
                        {filteredUsers.map((user) => (
                            <UserMobileCard
                                key={user.id}
                                user={user}
                                currentUser={currentUser}
                                isSuperAdmin={isSuperAdmin}
                                actionId={actionId}
                                confirmDeleteId={confirmDeleteId}
                                setConfirmDeleteId={setConfirmDeleteId}
                                onDelete={deleteUser}
                                onRoleChange={changeRole}
                            />
                        ))}
                    </div>

                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[820px] text-left text-sm">
                            <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
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
                                        <Link to={`/users/${user.id}`} className="mt-1 inline-block text-xs font-medium text-blue-600 hover:underline">
                                            View profile
                                        </Link>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {user.roles?.map((role) => (
                                                <RoleBadge key={role} role={role} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <Badge tone={user.enabled ? "success" : "default"}>
                                            {user.enabled ? "Active" : "Disabled"}
                                        </Badge>
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
                                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                    confirmDeleteId === user.id
                                                        ? "border-red-600 bg-red-600 text-white hover:bg-red-700"
                                                        : "border-red-200 text-red-600 hover:bg-red-50"
                                                }`}
                                            >
                                                {confirmDeleteId === user.id ? "Confirm" : "Delete"}
                                            </button>
                                            {confirmDeleteId === user.id && (
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmDeleteId(null)}
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    </>
                )}
            </section>
        </div>
    );
}

function UserMobileCard({
    user,
    currentUser,
    isSuperAdmin,
    actionId,
    confirmDeleteId,
    setConfirmDeleteId,
    onDelete,
    onRoleChange
}) {
    return (
        <div className="space-y-4 p-4">
            <div>
                <p className="font-medium text-slate-950">{user.username}</p>
                <p className="mt-1 break-all text-sm text-slate-500">{user.email}</p>
                <Link to={`/users/${user.id}`} className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline">
                    View profile
                </Link>
            </div>

            <div className="flex flex-wrap gap-2">
                {user.roles?.map((role) => (
                    <RoleBadge key={role} role={role} />
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-xs font-medium uppercase text-slate-400">Status</p>
                    <p className="mt-1 text-slate-700">{user.enabled ? "Active" : "Disabled"}</p>
                </div>
                <div>
                    <p className="text-xs font-medium uppercase text-slate-400">Joined</p>
                    <p className="mt-1 text-slate-700">{formatDate(user.createdAt)}</p>
                </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
                <select
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                    value={user.roles?.[0] || "USER"}
                    onChange={(event) => onRoleChange(user.id, event.target.value)}
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
                    onClick={() => onDelete(user.id)}
                    disabled={actionId === user.id || !canDeleteUser(currentUser, user)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {confirmDeleteId === user.id ? "Confirm delete" : "Delete"}
                </button>
                {confirmDeleteId === user.id && (
                    <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}

function RoleBadge({ role }) {
    const tone = role === "SUPERADMIN" ? "purple" : role === "ADMIN" ? "brand" : "default";

    return (
        <Badge tone={tone}>{role}</Badge>
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
