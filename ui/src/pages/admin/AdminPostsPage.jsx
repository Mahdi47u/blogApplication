import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { extractRichTextText } from "../../utils/richText";

export default function AdminPostsPage() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        loadPosts();
    }, []);

    async function loadPosts() {
        try {
            setLoading(true);
            setError(null);

            const data = await apiFetch("http://localhost:8080/api/admin/posts?page=0&size=100");
            setPosts(data.content || []);
        } catch (error) {
            console.error("Failed to load posts:", error);
            setError("Posts could not be loaded.");
        } finally {
            setLoading(false);
        }
    }

    async function deletePost(id) {
        if (!confirm("Delete this post? This action cannot be undone.")) return;

        try {
            setDeletingId(id);
            await apiFetch(`http://localhost:8080/api/admin/posts/${id}`, {
                method: "DELETE"
            });
            await loadPosts();
        } catch (error) {
            console.error("Failed to delete post:", error);
            setError(error.message || "Post could not be deleted.");
        } finally {
            setDeletingId(null);
        }
    }

    const filteredPosts = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return posts.filter((post) => {
            if (!normalizedSearch) return true;

            const textContent = extractRichTextText(post.content);

            return (
                post.title?.toLowerCase().includes(normalizedSearch) ||
                textContent.toLowerCase().includes(normalizedSearch) ||
                String(post.authorId || "").includes(normalizedSearch)
            );
        });
    }, [posts, search]);

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-medium text-blue-600">Admin</p>
                    <h1 className="mt-1 text-3xl font-semibold text-slate-950">
                        Post Moderation
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Review published posts and remove content that should not stay live.
                    </p>
                </div>

                <p className="text-sm text-slate-500">
                    {filteredPosts.length} of {posts.length} posts
                </p>
            </header>

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search title, content, or author ID..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:max-w-md"
                />
            </section>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <div className="p-6 text-sm text-slate-600">Loading posts...</div>
                ) : filteredPosts.length === 0 ? (
                    <div className="p-6 text-sm text-slate-600">No posts found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[860px] text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Post</th>
                                <th className="px-4 py-3 font-semibold">Author</th>
                                <th className="px-4 py-3 font-semibold">Categories</th>
                                <th className="px-4 py-3 font-semibold">Created</th>
                                <th className="px-4 py-3 text-right font-semibold">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {filteredPosts.map((post) => (
                                <PostRow
                                    key={post.id}
                                    post={post}
                                    deletingId={deletingId}
                                    onDelete={deletePost}
                                />
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

function PostRow({ post, deletingId, onDelete }) {
    const textContent = extractRichTextText(post.content);

    return (
        <tr className="hover:bg-slate-50">
                                    <td className="px-4 py-4">
                                        <Link
                                            to={`/posts/${post.id}`}
                                            className="line-clamp-1 font-medium text-slate-950 hover:text-blue-600"
                                        >
                                            {post.title}
                                        </Link>
                                        <p className="mt-1 line-clamp-2 max-w-xl text-slate-500">
                                            {textContent || "No content"}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4 text-slate-600">
                                        User #{post.authorId}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {post.categories?.length ? (
                                                post.categories.map((category) => (
                                                    <span
                                                        key={category}
                                                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                                                    >
                                                        {category}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-400">None</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-500">
                                        {formatDate(post.createdAt)}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/posts/${post.id}`}
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                to={`/posts/${post.id}/edit`}
                                                className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(post.id)}
                                                disabled={deletingId === post.id}
                                                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
    );
}

function formatDate(value) {
    if (!value) return "Unknown";
    return new Date(value).toLocaleDateString();
}
