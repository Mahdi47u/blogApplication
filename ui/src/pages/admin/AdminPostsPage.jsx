import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminSubnav from "../../components/admin/AdminSubnav.jsx";
import { apiFetch } from "../../utils/api";
import { extractRichTextText } from "../../utils/richText";
import Badge from "../../components/ui/Badge.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import { EmptyState, ErrorState } from "../../components/ui/StateBlock.jsx";

export default function AdminPostsPage() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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
        if (confirmDeleteId !== id) {
            setConfirmDeleteId(id);
            return;
        }

        try {
            setDeletingId(id);
            await apiFetch(`http://localhost:8080/api/admin/posts/${id}`, {
                method: "DELETE"
            });
            setConfirmDeleteId(null);
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
            <AdminSubnav />

            <PageHeader
                eyebrow="Admin"
                title="Post Moderation"
                description="Review published posts and remove content that should not stay live."
                meta={<p className="text-sm text-slate-500">{filteredPosts.length} of {posts.length} posts</p>}
            />

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-950">Filters</h2>
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search title, content, or author ID..."
                    className="form-input md:max-w-md"
                />
            </section>

            {error && (
                <ErrorState message={error} />
            )}

            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                {loading ? (
                    <div className="p-6 text-sm text-slate-600">Loading posts...</div>
                ) : filteredPosts.length === 0 ? (
                    <div className="p-4">
                        <EmptyState title="No posts found" description="Adjust your search query." />
                    </div>
                ) : (
                    <>
                    <div className="divide-y divide-slate-100 md:hidden">
                        {filteredPosts.map((post) => (
                            <PostMobileCard
                                key={post.id}
                                post={post}
                                deletingId={deletingId}
                                confirmDeleteId={confirmDeleteId}
                                setConfirmDeleteId={setConfirmDeleteId}
                                onDelete={deletePost}
                            />
                        ))}
                    </div>

                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[860px] text-left text-sm">
                            <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
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
                                    confirmDeleteId={confirmDeleteId}
                                    setConfirmDeleteId={setConfirmDeleteId}
                                    onDelete={deletePost}
                                />
                            ))}
                            </tbody>
                        </table>
                    </div>
                    </>
                )}
            </section>
        </div>
    );
}

function PostMobileCard({ post, deletingId, confirmDeleteId, setConfirmDeleteId, onDelete }) {
    const textContent = extractRichTextText(post.content);

    return (
        <div className="space-y-4 p-4">
            <div>
                <Link
                    to={`/posts/${post.id}`}
                    className="font-medium text-slate-950 hover:text-blue-600"
                >
                    {post.title}
                </Link>
                <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                    {textContent || "No content"}
                </p>
            </div>

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
                    <span className="text-sm text-slate-400">No categories</span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-xs font-medium uppercase text-slate-400">Author</p>
                    <Link to={`/users/${post.authorId}`} className="mt-1 inline-block text-slate-700 hover:text-blue-600 hover:underline">
                        {post.authorName || `User #${post.authorId}`}
                    </Link>
                </div>
                <div>
                    <p className="text-xs font-medium uppercase text-slate-400">Created</p>
                    <p className="mt-1 text-slate-700">{formatDate(post.createdAt)}</p>
                </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
                <Link
                    to={`/posts/${post.id}`}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    View
                </Link>
                <Link
                    to={`/posts/${post.id}/edit`}
                    className="rounded-lg border border-blue-200 px-3 py-2 text-center text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                >
                    Edit
                </Link>
                <button
                    type="button"
                    onClick={() => onDelete(post.id)}
                    disabled={deletingId === post.id}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        confirmDeleteId === post.id
                            ? "border-red-600 bg-red-600 text-white hover:bg-red-700"
                            : "border-red-200 text-red-600 hover:bg-red-50"
                    }`}
                >
                    {confirmDeleteId === post.id ? "Confirm delete" : "Delete"}
                </button>
                {confirmDeleteId === post.id && (
                    <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}

function PostRow({ post, deletingId, confirmDeleteId, setConfirmDeleteId, onDelete }) {
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
                                        <Link to={`/users/${post.authorId}`} className="font-medium text-slate-700 hover:text-blue-600 hover:underline">
                                            {post.authorName || `User #${post.authorId}`}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {post.categories?.length ? (
                                                post.categories.map((category) => (
                                                    <Badge
                                                        key={category}
                                                    >
                                                        {category}
                                                    </Badge>
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
                                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                    confirmDeleteId === post.id
                                                        ? "border-red-600 bg-red-600 text-white hover:bg-red-700"
                                                        : "border-red-200 text-red-600 hover:bg-red-50"
                                                }`}
                                            >
                                                {confirmDeleteId === post.id ? "Confirm" : "Delete"}
                                            </button>
                                            {confirmDeleteId === post.id && (
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmDeleteId(null)}
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
    );
}

function formatDate(value) {
    if (!value) return "Unknown";
    return new Date(value).toLocaleDateString();
}
