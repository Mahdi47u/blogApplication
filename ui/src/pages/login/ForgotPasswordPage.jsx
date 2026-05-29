import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        console.log("Reset password for:", email);
        setSubmitted(true);
    }

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
                    <h1 className="text-3xl font-semibold tracking-normal text-slate-950">
                        Reset password
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Enter your email and we will send reset instructions if the account exists.
                    </p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                placeholder="Enter your email"
                                className="form-input"
                            />
                        </label>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            Send reset link
                        </button>
                    </form>
                ) : (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                        If an account exists for <span className="font-semibold">{email}</span>, reset instructions have been sent.
                    </div>
                )}

                <p className="mt-6 text-center text-sm text-slate-600">
                    Back to{" "}
                    <Link to="/login" className="font-medium text-blue-600 hover:underline">
                        sign in
                    </Link>
                </p>
            </main>
        </div>
    );
}

export default ForgotPasswordPage;
