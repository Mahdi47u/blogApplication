import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

function LoginPage() {
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        remember: false
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        try {
            setLoading(true);
            await loginUser(formData);
            navigate("/");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthShell title="Welcome back" subtitle="Sign in to continue writing and saving posts.">
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Username">
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Enter your username"
                    />
                </Field>

                <Field label="Password">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input pr-20"
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-800"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </Field>

                <div className="flex items-center justify-between gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={formData.remember}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        Remember me
                    </label>

                    <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                    {loading ? "Signing in" : "Sign in"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
                No account?{" "}
                <Link to="/register" className="font-medium text-blue-600 hover:underline">
                    Create one
                </Link>
            </p>
        </AuthShell>
    );
}

function AuthShell({ title, subtitle, children }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
            <Link to="/" className="absolute left-6 top-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                    B
                </span>
                <span className="font-semibold text-slate-950">Blog App</span>
            </Link>

            <main className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold tracking-normal text-slate-950">{title}</h1>
                    <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
                </div>
                {children}
            </main>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
            {children}
        </label>
    );
}

export default LoginPage;
