import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import BookmarkButton from "../../components/bookmarks/BookmarkButton";
import CategoryBadge from "../../components/categories/CategoryBadge";
import CommentSection from "../../components/comments/CommentSection";
import RichTextContent from "../../components/editor/RichTextContent";
import PostAuthor from "../../components/posts/PostAuthor";
import Button from "../../components/ui/Button.jsx";
import SectionCard from "../../components/ui/SectionCard.jsx";
import { ErrorState } from "../../components/ui/StateBlock.jsx";
import { deletePost, getPostById } from "../../services/postService";
import { extractRichTextText } from "../../utils/richText";

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
                setLoading(true);
                setError(null);
                setPost(await getPostById(id));
            } catch (err) {
                console.error(err);
                setError("Post could not be loaded.");
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [id]);

    async function handleDelete() {
        if (!confirm("Delete this post?")) {
            return;
        }

        try {
            await deletePost(id);
            navigate("/");
        } catch (error) {
            console.error("Delete failed:", error);
            setError("Post could not be deleted.");
        }
    }

    if (loading) {
        return <PostDetailsSkeleton />;
    }

    if (error || !post) {
        return <ErrorState message={error || "Post not found."} />;
    }

    const formattedDate = formatDate(post.createdAt);
    const updatedDate = post.updatedAt && post.updatedAt !== post.createdAt
        ? formatDate(post.updatedAt)
        : null;
    const isOwner = user?.id === post.authorId;
    const heroImage = post.coverImageUrl || post.thumbnailUrl;
    const excerpt = extractRichTextText(post.content);
    const readingTime = estimateReadingTime(excerpt);

    return (
        <div className="space-y-8">
            <div className="mx-auto max-w-5xl">
                <Button as={Link} to="/" variant="ghost" className="px-0 hover:bg-transparent">
                    Back to Home
                </Button>
            </div>

            <article>
                <header className="mx-auto max-w-5xl">
                    {post.categories?.length > 0 && (
                        <div className="mb-5 flex flex-wrap gap-2">
                            {post.categories.map((category) => (
                                <CategoryBadge
                                    key={typeof category === "string" ? category : category.id}
                                    category={category}
                                />
                            ))}
                        </div>
                    )}

                    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
                        <div>
                            <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
                                {post.title}
                            </h1>

                            {excerpt && (
                                <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                                    {excerpt}
                                </p>
                            )}
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <PostAuthor post={post} size="md" showPrefix />
                            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
                                <div>
                                    <dt className="text-slate-500">Published</dt>
                                    <dd className="mt-1 font-medium text-slate-950">{formattedDate}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500">Read</dt>
                                    <dd className="mt-1 font-medium text-slate-950">{readingTime}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="mt-7 flex flex-col gap-3 border-y border-slate-200 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-slate-500">
                            {updatedDate ? `Updated ${updatedDate}` : "Freshly published"}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <BookmarkButton postId={post.id} />

                            {isOwner && (
                                <>
                                    <Button as={Link} to={`/posts/${id}/edit`} variant="secondary">
                                        Edit
                                    </Button>
                                    <Button variant="danger" onClick={handleDelete}>
                                        Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {heroImage && (
                    <div className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
                        <img
                            src={heroImage}
                            alt={post.title}
                            className="max-h-[560px] w-full object-cover"
                        />
                    </div>
                )}

                <div className="mx-auto mt-8 max-w-3xl">
                    <RichTextContent value={post.content} />
                </div>
            </article>

            <div className="mx-auto max-w-3xl">
                <SectionCard title="Comments" description="Join the discussion around this post.">
                    <CommentSection postId={post.id} />
                </SectionCard>
            </div>
        </div>
    );
}

function PostDetailsSkeleton() {
    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="h-8 w-28 animate-pulse rounded bg-slate-100" />
            <div className="h-56 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-[420px] animate-pulse rounded-lg bg-slate-100" />
            <div className="mx-auto h-80 max-w-3xl animate-pulse rounded-lg bg-slate-100" />
        </div>
    );
}

function estimateReadingTime(text) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));

    return `${minutes} min`;
}

function formatDate(value) {
    if (!value) {
        return "Unknown";
    }

    return new Date(value).toLocaleDateString();
}

export default PostDetailsPage;
