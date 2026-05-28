import { useEffect, useState } from "react";
import { getAllPosts, searchPosts } from "../services/postService";
import { getCategories } from "../services/categoryService";
import PostCard from "../components/posts/PostCard.jsx";

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState(null);
    const [categoryError, setCategoryError] = useState(null);
    const [search, setSearch] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        loadPosts();
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            setLoadingCategories(true);
            setCategoryError(null);

            const data = await getCategories();
            setCategories(data || []);
        } catch (error) {
            console.error("Error loading categories:", error);
            setCategoryError("Categories could not be loaded.");
        } finally {
            setLoadingCategories(false);
        }
    }

    async function loadPosts(query = "") {
        try {
            setLoading(true);
            setError(null);

            const normalizedQuery = query.trim();
            const data = normalizedQuery
                ? await searchPosts(normalizedQuery)
                : await getAllPosts();

            setPosts(data.content || data || []);
            setActiveSearch(normalizedQuery);
        } catch (error) {
            console.error("Error loading posts:", error);
            setError(query ? "Search failed. Please try again." : "Failed to load posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    function handleSearchSubmit(event) {
        event.preventDefault();
        loadPosts(search);
    }

    function clearSearch() {
        setSearch("");
        loadPosts();
    }

    // Category filtering stays client-side; text search is handled by the API.
    const filteredPosts = posts.filter((post) => {
        if (!selectedCategory) {
            return true;
        }

        const matchCategory = post.categories?.some((category) => {
            if (typeof category === "string") {
                return category.toLowerCase() === selectedCategory.name.toLowerCase();
            }

            return (
                category.id === selectedCategory.id ||
                category.slug === selectedCategory.slug ||
                category.name?.toLowerCase() === selectedCategory.name.toLowerCase()
            );
        });

        return matchCategory;
    });

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center mb-12 animate-fadeIn">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Welcome Back
                </h1>
                <p className="mt-3 text-gray-600 text-lg">
                    Explore recent posts and discover fresh content.
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
                <div className="rounded-xl bg-white border border-slate-200 shadow-sm px-4 py-3 flex items-center gap-3 transition focus-within:ring-4 focus-within:ring-blue-100">
                    <span className="text-gray-500 text-sm font-medium" aria-hidden="true">
                        Search
                    </span>
                    <input
                        type="text"
                        placeholder="Search by title or content..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    />
                    {activeSearch && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-slate-100 transition"
                        >
                            Clear
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 transition"
                    >
                        {loading ? "Searching" : "Search"}
                    </button>
                </div>
            </form>

            {/* Categories */}
            <div className="max-w-3xl mx-auto flex gap-3 overflow-x-auto pb-2 mb-10 no-scrollbar">
                <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shadow-sm transition
                        ${
                        !selectedCategory
                            ? "bg-blue-600 text-white shadow-blue-600/30"
                            : "bg-white/70 border border-white/40 text-gray-700 hover:bg-white"
                    }`}
                >
                    All
                </button>

                {loadingCategories && (
                    <span className="px-4 py-2 text-sm text-gray-500">
                        Loading categories...
                    </span>
                )}

                {!loadingCategories && categories.map((category) => (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shadow-sm transition
                            ${
                            selectedCategory?.id === category.id
                                ? "bg-blue-600 text-white shadow-blue-600/30"
                                : "bg-white/70 border border-white/40 text-gray-700 hover:bg-white"
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {categoryError && (
                <p className="mx-auto mb-6 max-w-3xl text-sm text-red-500">
                    {categoryError}
                </p>
            )}

            {/* Section Title */}
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                {activeSearch ? `Search results for "${activeSearch}"` : "Recent Posts"}
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
