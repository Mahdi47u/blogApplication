import { useEffect, useState } from "react";
import { getReplies } from "../../services/commentService";
import Button from "../ui/Button";
import CommentItem from "./CommentItem";

export default function ReplyList({ commentId, postId, depth = 1, refreshKey = 0 }) {
    const [replies, setReplies] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        setReplies([]);
        setPage(0);
        setHasMore(true);
    }, [commentId, refreshKey]);

    useEffect(() => {
        loadReplies(page);
    }, [commentId, page, refreshKey]);

    async function loadReplies(nextPage) {
        try {
            nextPage === 0 ? setLoading(true) : setLoadingMore(true);
            const data = await getReplies(commentId, nextPage);

            setReplies((current) => {
                const existingIds = new Set(current.map((reply) => reply.id));
                const uniqueReplies = (data.content || []).filter((reply) => !existingIds.has(reply.id));
                return nextPage === 0 ? data.content || [] : [...current, ...uniqueReplies];
            });
            setHasMore(!data.last);
        } catch (error) {
            console.error("Failed to load replies:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    function onReplyDeleted(replyId) {
        setReplies((current) => current.filter((reply) => reply.id !== replyId));
    }

    function onReplyUpdated(updatedReply) {
        setReplies((current) =>
            current.map((reply) => reply.id === updatedReply.id ? updatedReply : reply)
        );
    }

    return (
        <div className="ml-8 mt-4 space-y-3 sm:ml-12">
            {loading && (
                <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
            )}

            {!loading && replies.map((reply) => (
                <CommentItem
                    key={reply.id}
                    comment={reply}
                    postId={postId}
                    depth={depth}
                    onDeleted={onReplyDeleted}
                    onUpdated={onReplyUpdated}
                />
            ))}

            {!loading && hasMore && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage((value) => value + 1)}
                    disabled={loadingMore}
                >
                    {loadingMore ? "Loading" : "Load more replies"}
                </Button>
            )}
        </div>
    );
}
