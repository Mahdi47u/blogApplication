import { useEffect, useState } from "react";
import PostCard from "../../components/posts/PostCard.jsx";
import { getSavedPostCount, getSavedPosts } from "../../services/bookmarkService";

export default function SavedPostsPage() {
    const [posts, setPosts] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSavedPosts();
    }, []);

    async function loadSavedPosts() {
        try {
            setLoading(true);
            setError(null);

            const list = await getSavedPosts();
            const total = await getSavedPostCount();

            setPosts((list.content || []).map((bookmark) => bookmark.post));
            setCount(total);
        } catch (error) {
            console.error("Failed to load saved posts:", error);
            setError("Failed to load saved posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Saved Posts</h1>
                <p className="mt-2 text-gray-600">
                    {count} {count === 1 ? "post" : "posts"} saved for later.
                </p>
            </div>

            {loading && (
                <p className="text-gray-600 animate-pulse">Loading saved posts...</p>
            )}

            {error && (
                <p className="text-red-500">{error}</p>
            )}

            {!loading && !error && posts.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-gray-600">
                    You have not saved any posts yet.
                </div>
            )}

            {!loading && !error && posts.length > 0 && (
                <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}
