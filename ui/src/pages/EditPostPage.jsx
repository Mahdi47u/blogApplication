import { useEffect, useState } from "react";
import { getPostById, updatePost } from "../services/postService";
import { useParams, useNavigate, Link } from "react-router-dom";

function EditPostPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPost();
    }, []);

    async function loadPost() {
        try {
            const data = await getPostById(id);
            setTitle(data.title);
            setContent(data.content);
            setCategory(data.category || "");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        await updatePost(id, {
            title,
            content,
            category
        });

        navigate(`/posts/${id}`);
    }

    if (loading) {
        return <p className="p-6 text-gray-600 animate-pulse">Loading post...</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10">

            <div className="max-w-3xl mx-auto animate-fadeIn">

                <Link
                    to={`/posts/${id}`}
                    className="text-blue-600 font-medium hover:underline mb-6 inline-block"
                >
                    ← Back to Post
                </Link>

                <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-8">

                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Edit Post
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="block text-sm text-gray-600 mb-2">
                                Title
                            </label>

                            <input
                                type="text"
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
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows="8"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                required
                            />
                        </div>

                        <div className="flex gap-3 pt-4">

                            <button
                                type="submit"
                                className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-md"
                            >
                                Save Changes
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(`/posts/${id}`)}
                                className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
}

export default EditPostPage;
