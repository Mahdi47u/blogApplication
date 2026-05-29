import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

function RegisterPage() {
    const navigate = useNavigate();
    const { registerUser } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agree: false
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!formData.agree) {
            setError("You must agree to the terms.");
            return;
        }

        try {
            setLoading(true);
            await registerUser({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            navigate("/");
        } catch (error) {
            setError(error.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthShell title="Create account" subtitle="Start publishing and saving posts.">
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
                        placeholder="Choose a username"
                    />
                </Field>

                <Field label="Email">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Enter your email"
                    />
                </Field>

                <Field label="Password">
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Create a password"
                    />
                </Field>

                <Field label="Confirm password">
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Confirm your password"
                    />
                </Field>

                <label className="flex items-start gap-3 text-sm text-slate-600">
                    <input
                        type="checkbox"
                        name="agree"
                        checked={formData.agree}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>I agree to the terms and conditions.</span>
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                    {loading ? "Creating account" : "Create account"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:underline">
                    Sign in
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

export default RegisterPage;
