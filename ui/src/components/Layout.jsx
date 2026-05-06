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

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
            <header className="border-b bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-blue-600">
                        Blog App
                    </Link>

                    <nav className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 transition"
                        >
                            Home
                        </Link>

                        <Link
                            to="/create"
                            className="text-gray-700 hover:text-blue-600 transition"
                        >
                            Create Post
                        </Link>

                        {user ? (
                            <>
                                <span className="text-sm text-gray-600">
                                    Hello, {user}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Login
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
                <Outlet />
            </main>

            <footer className="border-t bg-white mt-10">
                <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500 text-center">
                    © {new Date().getFullYear()} Blog App. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default Layout;
