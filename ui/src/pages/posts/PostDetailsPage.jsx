import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPostById, deletePost } from "../../services/postService";
import { AuthContext } from "../../context/AuthContext";
import CommentSection from "../../components/comments/CommentSection";
import CategoryBadge from "../../components/categories/CategoryBadge";
import BookmarkButton from "../../components/bookmarks/BookmarkButton";

function PostDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPost() {
            try {
                const data = await getPostById(id);
                setPost(data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch post");
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [id]);

    async function handleDelete() {
        try {
            await deletePost(id);
            navigate("/");
        } catch (error) {
            console.log("Delete failed (likely unauthorized)");
        }
    }

    if (loading)
        return <p className="text-gray-600 animate-pulse px-4 py-10">Loading post...</p>;

    if (error)
        return <p className="text-red-500 px-4 py-10">{error}</p>;

    if (!post)
        return <p className="text-gray-600 px-4 py-10">Post not found.</p>;

    const formattedDate = new Date(post.createdAt).toLocaleDateString();
    const isOwner = user?.id === post.authorId;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10">

            <div className="max-w-3xl mx-auto animate-fadeIn">

                {/* Back Button */}
                <Link
                    to="/"
                    className="inline-block mb-6 text-blue-600 font-medium hover:underline"
                >
                    ← Back to Home
                </Link>

                {/* Post Card */}
                <div className="
                    bg-white/60 backdrop-blur-xl
                    border border-white/40 shadow-xl
                    rounded-3xl p-8
                ">

                    {/* Categories */}
                    {post.categories?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.categories.map((category) => (
                                <CategoryBadge
                                    key={typeof category === "string" ? category : category.id}
                                    category={category}
                                />
                            ))}
                        </div>
                    )}


                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {post.title}
                    </h1>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-gray-500 text-sm mb-8">
                        <span>🕒 {formattedDate}</span>
                        <span>👤 Author ID: {post.authorId}</span>
                    </div>

                    <div className="mb-8">
                        <BookmarkButton postId={post.id} />
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                        {post.content}
                    </p>

                    {/* Owner Actions */}
                    {isOwner && (
                        <div className="flex items-center gap-3 mt-10">
                            <Link
                                to={`/posts/${id}/edit`}
                                className="
                                    px-5 py-2 rounded-xl font-medium text-white
                                    bg-indigo-600 hover:bg-indigo-700
                                    transition shadow-md
                                "
                            >
                                Edit
                            </Link>

                            <button
                                onClick={handleDelete}
                                className="
                                    px-5 py-2 rounded-xl font-medium
                                    bg-red-500 text-white hover:bg-red-600
                                    transition shadow-md
                                "
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                <hr className="my-12 border-gray-200" />

                {/* COMMENTS SECTION */}
                <div className="mt-12">
                    <CommentSection postId={post.id} />
                </div>

            </div>
        </div>
    );
}

export default PostDetailsPage;
