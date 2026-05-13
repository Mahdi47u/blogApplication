import { useEffect, useState } from "react";
import { getReplies } from "../../services/commentService";
import CommentItem from "./CommentItem";

export default function ReplyList({ commentId }) {
    const [replies, setReplies] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadReplies();
    }, [page]);

    async function loadReplies() {
        const data = await getReplies(commentId, page);
        setReplies(prev => [...prev, ...data.content]);
        setHasMore(!data.last);
    }

    return (
        <div className="ml-6 mt-2 space-y-2">
            {replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} />
            ))}

            {hasMore && (
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="text-blue-500 text-sm"
                >
                    Load more replies
                </button>
            )}
        </div>
    );
}
