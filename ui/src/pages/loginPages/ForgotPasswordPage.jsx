import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();

        // TODO: connect to backend forgot password endpoint
        console.log("Reset password for:", email);

        setSubmitted(true);
    }

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden px-4">
            <Link
                to="/"
                className="absolute top-6 left-6 text-2xl font-bold text-blue-600 hover:opacity-80 transition"
            >
                Blog App
            </Link>

            <div className="w-full max-w-md rounded-[28px] border border-white/50 bg-white/75 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-8 sm:p-10 animate-fadeIn">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex items-center justify-center text-white text-lg font-bold">
                        BA
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                        Forgot Password
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Enter your email and we’ll send you a reset link
                    </p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-2xl bg-blue-600 py-3.5 text-white font-medium shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                        >
                            Send Reset Link
                        </button>
                    </form>
                ) : (
                    <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-5 text-center">
                        <p className="text-sm text-green-700">
                            If an account exists for <span className="font-semibold">{email}</span>, a password reset link has been sent.
                        </p>
                    </div>
                )}

                <p className="mt-6 text-center text-sm text-gray-600">
                    Back to{" "}
                    <Link to="/login" className="font-medium text-blue-600 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
