import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getPostComments } from "../../services/commentService";
import Button from "../ui/Button";
import { EmptyState, ErrorState } from "../ui/StateBlock";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

export default function CommentSection({ postId }) {
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setComments([]);
        setPage(0);
        setHasMore(true);
    }, [postId]);

    useEffect(() => {
        loadComments(page);
    }, [postId, page]);

    async function loadComments(nextPage) {
        try {
            nextPage === 0 ? setLoading(true) : setLoadingMore(true);
            setError(null);

            const data = await getPostComments(postId, nextPage);
            setComments((current) => {
                const existingIds = new Set(current.map((comment) => comment.id));
                const nextComments = (data.content || []).filter((comment) => !existingIds.has(comment.id));
                return nextPage === 0 ? data.content || [] : [...current, ...nextComments];
            });
            setHasMore(!data.last);
        } catch (error) {
            console.error("Failed to load comments:", error);
            setError("Comments could not be loaded.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    function onCommentAdded(newComment) {
        setComments((current) => [newComment, ...current]);
    }

    function onCommentDeleted(commentId) {
        setComments((current) => current.filter((comment) => comment.id !== commentId));
    }

    function onCommentUpdated(updatedComment) {
        setComments((current) =>
            current.map((comment) => comment.id === updatedComment.id ? updatedComment : comment)
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-950">Comments</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {comments.length} {comments.length === 1 ? "comment" : "comments"}
                    </p>
                </div>
            </div>

            {user ? (
                <CommentForm postId={postId} onSuccess={onCommentAdded} />
            ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <Link to="/login" className="font-medium text-blue-600 hover:underline">
                        Sign in
                    </Link>{" "}
                    to join the conversation.
                </div>
            )}

            {loading && <CommentSkeleton />}

            {!loading && error && <ErrorState message={error} />}

            {!loading && !error && comments.length === 0 && (
                <EmptyState
                    title="No comments yet"
                    description="Be the first to share a thought on this post."
                />
            )}

            {!loading && !error && comments.length > 0 && (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            postId={postId}
                            depth={0}
                            onDeleted={onCommentDeleted}
                            onUpdated={onCommentUpdated}
                        />
                    ))}
                </div>
            )}

            {!loading && hasMore && (
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setPage((value) => value + 1)}
                    disabled={loadingMore}
                >
                    {loadingMore ? "Loading" : "Load more comments"}
                </Button>
            )}
        </div>
    );
}

function CommentSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2].map((item) => (
                <div key={item} className="flex gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-24 flex-1 animate-pulse rounded-lg bg-slate-100" />
                </div>
            ))}
        </div>
    );
}
