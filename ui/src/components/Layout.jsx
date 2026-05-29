import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Layout() {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const isAdmin = user?.roles?.includes("ADMIN") || user?.roles?.includes("SUPERADMIN");

    function handleLogout() {
        logoutUser();
        setMenuOpen(false);
        navigate("/login");
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                            B
                        </span>
                        <span className="text-xl font-semibold tracking-normal text-slate-950">
                            Blog App
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-1 text-sm md:flex">
                        <NavItem to="/">Home</NavItem>

                        {user && <NavItem to="/create">Create</NavItem>}
                        {user && <NavItem to="/bookmarks">Saved</NavItem>}
                        {isAdmin && <NavItem to="/admin/dashboard">Admin</NavItem>}

                        {!user && (
                            <Link
                                to="/login"
                                className="ml-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                            >
                                Login
                            </Link>
                        )}

                        {user && (
                            <div className="ml-2 flex items-center gap-2 border-l border-slate-200 pl-3">
                                <Link
                                    to="/profile"
                                    className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-600 transition hover:border-blue-300"
                                    title={user.username}
                                >
                                    {user.profilePicture ? (
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        getInitials(user.username)
                                    )}
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </nav>

                    <button
                        type="button"
                        onClick={() => setMenuOpen((value) => !value)}
                        className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 md:hidden"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? "Close" : "Menu"}
                    </button>
                </div>

                {menuOpen && (
                    <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
                        <div className="grid gap-1 text-sm">
                            <MobileNavItem to="/" onClick={closeMenu}>Home</MobileNavItem>
                            {user && <MobileNavItem to="/create" onClick={closeMenu}>Create</MobileNavItem>}
                            {user && <MobileNavItem to="/bookmarks" onClick={closeMenu}>Saved</MobileNavItem>}
                            {isAdmin && <MobileNavItem to="/admin/dashboard" onClick={closeMenu}>Admin</MobileNavItem>}
                            {user && <MobileNavItem to="/profile" onClick={closeMenu}>Profile</MobileNavItem>}

                            {!user && (
                                <Link
                                    to="/login"
                                    onClick={closeMenu}
                                    className="mt-2 rounded-lg bg-blue-600 px-3 py-2 text-center font-medium text-white"
                                >
                                    Login
                                </Link>
                            )}

                            {user && (
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-left font-medium text-slate-700"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    </nav>
                )}
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
                <Outlet />
            </main>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-5 text-sm text-slate-500 sm:px-6 lg:px-8">
                    Blog App, {new Date().getFullYear()}
                </div>
            </footer>
        </div>
    );
}

function NavItem({ to, children }) {
    return (
        <NavLink
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
                `rounded-lg px-3 py-2 font-medium transition ${
                    isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`
            }
        >
            {children}
        </NavLink>
    );
}

function MobileNavItem({ to, children, onClick }) {
    return (
        <NavLink
            to={to}
            end={to === "/"}
            onClick={onClick}
            className={({ isActive }) =>
                `rounded-lg px-3 py-2 font-medium transition ${
                    isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-100"
                }`
            }
        >
            {children}
        </NavLink>
    );
}

function getInitials(name) {
    if (!name) {
        return "U";
    }

    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default Layout;
