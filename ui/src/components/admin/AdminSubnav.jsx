import { NavLink } from "react-router-dom";

const items = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/posts", label: "Posts" },
    { to: "/admin/categories", label: "Categories" }
];

export default function AdminSubnav() {
    return (
        <nav className="flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
            {items.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                        `shrink-0 rounded-md px-3 py-2 text-sm font-medium transition ${
                            isActive
                                ? "bg-blue-600 text-white"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                        }`
                    }
                >
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );
}
