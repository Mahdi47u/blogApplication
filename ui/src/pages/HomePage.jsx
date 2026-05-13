import { useEffect, useState } from "react";
import { getAllPosts } from "../services/postService";
import PostCard from "../components/post/PostCard.jsx";

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [categories] = useState(["All", "Tech", "News", "Art", "General"]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        loadPosts();
    }, []);

    async function loadPosts() {
        try {
            setLoading(true);
            setError(null);

            const data = await getAllPosts();
            setPosts(data.content || data || []);
        } catch (error) {
            console.error("Error loading posts:", error);
            setError("Failed to load posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    // Filter logic (search + category)
    const filteredPosts = posts.filter((post) => {
        const matchCategory =
            selectedCategory === "All" ||
            post.category?.toLowerCase() === selectedCategory.toLowerCase();

        const matchSearch =
            post.title?.toLowerCase().includes(search.toLowerCase());

        return matchCategory && matchSearch;
    });

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center mb-12 animate-fadeIn">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Welcome Back 👋
                </h1>
                <p className="mt-3 text-gray-600 text-lg">
                    Explore recent posts and discover fresh content.
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
                <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg px-5 py-3 flex items-center gap-3 transition focus-within:ring-4 focus-within:ring-blue-200">
                    <span className="text-gray-500 text-xl">🔍</span>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="max-w-3xl mx-auto flex gap-3 overflow-x-auto pb-2 mb-10 no-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shadow-sm transition
                            ${
                            selectedCategory === cat
                                ? "bg-blue-600 text-white shadow-blue-600/30"
                                : "bg-white/70 border border-white/40 text-gray-700 hover:bg-white"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Section Title */}
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                Recent Posts
            </h2>

            {/* Loading */}
            {loading && (
                <p className="text-gray-600 animate-pulse">Loading posts...</p>
            )}

            {/* Error */}
            {error && (
                <p className="text-red-500">{error}</p>
            )}

            {/* No posts */}
            {!loading && !error && filteredPosts.length === 0 && (
                <p className="text-gray-600">No posts found.</p>
            )}

            {/* Posts Grid */}
            {!loading && !error && filteredPosts.length > 0 && (
                <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post, i) => (
                        <div
                            key={post.id}
                            className="animate-slideUp"
                            style={{ animationDelay: `${i * 0.08}s` }}
                        >
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;
