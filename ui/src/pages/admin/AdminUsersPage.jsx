import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        const data = await apiFetch("http://localhost:8080/api/admin/users");
        setUsers(data);
    }

    async function deleteUser(id) {
        if (!confirm("Are you sure you want to delete this user?")) return;

        await apiFetch(`http://localhost:8080/api/admin/users/${id}`, {
            method: "DELETE"
        });

        loadUsers();
    }

    async function changeRole(id, role) {
        await apiFetch(`http://localhost:8080/api/admin/users/${id}/role`, {
            method: "PUT",
            body: JSON.stringify({ role })
        });

        loadUsers();
    }

    return (
        <div>
            <h1 className="text-3xl font-semibold mb-6">User Management</h1>

            <table className="w-full border-collapse">
                <thead>
                <tr className="border-b bg-gray-100">
                    <th className="p-3 text-left">Username</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Roles</th>
                    <th className="p-3">Actions</th>
                </tr>
                </thead>

                <tbody>
                {users.map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{u.username}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3">{u.roles.join(", ")}</td>

                        <td className="p-3 flex gap-2">

                            {/* Change Role */}
                            <select
                                className="border p-2 rounded"
                                onChange={(e) => changeRole(u.id, e.target.value)}
                                value={u.roles[0]}
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="SUPERADMIN">SUPERADMIN</option>
                            </select>

                            {/* Delete */}
                            <button
                                onClick={() => deleteUser(u.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>

            </table>
        </div>
    );
}
