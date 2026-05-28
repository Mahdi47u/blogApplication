import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCategoryBySlug, getPostsByCategory } from "../../services/categoryService";
import PostCard from "../../components/posts/PostCard";

function CategoryPostsPage() {
    const { slug } = useParams();
    const [category, setCategory] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPosts();
    }, [slug]);

    async function loadPosts() {
        try {
            setLoading(true);
            setError(null);

            const [categoryData, postsData] = await Promise.all([
                getCategoryBySlug(slug),
                getPostsByCategory(slug)
            ]);

            setCategory(categoryData);
            setPosts(postsData.content || postsData || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load category posts.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-7">
            <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
                Back to Home
            </Link>

            <header className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        Category
                    </p>
                </div>

                <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="m-0 text-3xl font-semibold tracking-normal text-slate-950">
                            {category?.name || formatSlug(slug)}
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                            {category?.description || "Browse every post published in this category."}
                        </p>
                    </div>

                    <div className="w-fit rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 sm:text-right">
                        <p className="text-2xl font-semibold leading-none text-slate-950">{posts.length}</p>
                        <p className="text-sm text-slate-500">Posts</p>
                    </div>
                </div>
            </header>

            {loading && <CategorySkeleton />}

            {!loading && error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    {error}
                </div>
            )}

            {!loading && !error && posts.length === 0 && (
                <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
                    No posts found in this category.
                </div>
            )}

            {!loading && !error && posts.length > 0 && (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}

function CategorySkeleton() {
    return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
        </div>
    );
}

function formatSlug(value) {
    return value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export default CategoryPostsPage;
