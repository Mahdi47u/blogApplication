import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Layout() {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogout() {
        logoutUser();
        navigate("/login");
    }

    // Admin detection
    const isAdmin = user?.roles?.includes("ADMIN") || user?.roles?.includes("SUPERADMIN");

    // Create initials fallback (e.g., John Doe → JD)
    function getInitials(name) {
        if (!name) return "U";
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase();
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">

            {/* Header / Navbar */}
            <header className="border-b bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">

                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-blue-600">
                        Blog App
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-6">

                        <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
                            Home
                        </Link>

                        {/* Users and Admins both can create posts */}
                        {user && (
                            <Link to="/create" className="text-gray-700 hover:text-blue-600 transition">
                                Create Post
                            </Link>
                        )}

                        {user && (
                            <Link to="/bookmarks" className="text-gray-700 hover:text-blue-600 transition">
                                Saved Posts
                            </Link>
                        )}

                        {/* Admin Link */}
                        {isAdmin && (
                            <Link
                                to="/admin/dashboard"
                                className="text-gray-700 hover:text-purple-600 transition font-medium"
                            >
                                Dashboard
                            </Link>
                        )}

                        {/* If NOT logged in → show Login */}
                        {!user && (
                            <Link
                                to="/login"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Login
                            </Link>
                        )}

                        {/* If logged in → show Avatar + Logout */}
                        {user && (
                            <div className="flex items-center gap-4">

                                {/* Avatar */}
                                <Link to="/profile">
                                    <div className="w-10 h-10 rounded-full border overflow-hidden bg-gray-200 flex items-center justify-center text-gray-700 font-semibold cursor-pointer">
                                        {user.profilePicture ? (
                                            <img
                                                src={user.profilePicture}
                                                alt="profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span>{getInitials(user.username)}</span>
                                        )}
                                    </div>
                                </Link>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        )}

                    </nav>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t bg-white mt-10">
                <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500 text-center">
                    © {new Date().getFullYear()} Blog App. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default Layout;
