import { useState } from "react";
import { createPost } from "../services/postService";
import { useNavigate, Link } from "react-router-dom";

function CreatePostPage() {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await createPost({
                title,
                content,
                category
            });

            navigate("/");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10">

            <div className="max-w-3xl mx-auto animate-fadeIn">

                <Link
                    to="/"
                    className="text-blue-600 font-medium hover:underline mb-6 inline-block"
                >
                    ← Back to Home
                </Link>

                <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-8">

                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Create New Post
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="block text-sm text-gray-600 mb-2">
                                Title
                            </label>

                            <input
                                type="text"
                                placeholder="Enter post title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-2">
                                Category
                            </label>

                            <input
                                type="text"
                                placeholder="Tech, News, Art..."
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-2">
                                Content
                            </label>

                            <textarea
                                placeholder="Write your post..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows="8"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md"
                        >
                            Publish Post
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
}

export default CreatePostPage;
