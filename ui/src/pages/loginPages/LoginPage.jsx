import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        remember: false,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);
            await loginUser(formData);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">

            {/* Top-left App Name */}
            <Link
                to="/"
                className="absolute top-6 left-6 text-2xl font-bold text-blue-600 hover:opacity-80 transition"
            >
                Blog App
            </Link>

            {/* Card */}
            <div
                className="w-full max-w-md bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white/40 animate-fadeIn"
            >

                {/* Title */}
                <h1 className="text-center text-3xl font-semibold text-gray-800">
                    Welcome Back
                </h1>
                <p className="text-center text-gray-500 mt-2 text-sm">
                    Sign in to your account
                </p>

                {/* Error */}
                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-600 text-sm rounded-xl border border-red-200 text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">

                    {/* Username */}
                    <div>
                        <label className="text-gray-700 text-sm font-medium">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 mt-1 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Enter your username"
                        />
                    </div>

                    {/* Password with toggle */}
                    <div>
                        <label className="text-gray-700 text-sm font-medium">
                            Password
                        </label>

                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? "×" : "👁"}
                            </button>
                        </div>
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-gray-600 text-sm">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={formData.remember}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            Remember me
                        </label>

                        <Link
                            to="/forgot-password"
                            className="text-blue-600 text-sm font-medium hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-lg transition disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Create account link */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
