// ReplyList.jsx

import { useEffect, useState } from "react";
import { getReplies } from "../../services/commentService";
import CommentItem from "./CommentItem";

export default function ReplyList({ commentId, postId }) {
    const [replies, setReplies] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadReplies();
    }, [commentId, page]);

    async function loadReplies() {
        const data = await getReplies(commentId, page);

        setReplies(prev => {
            const existingIds = new Set(
                prev.map(reply => reply.id)
            );

            const uniqueReplies = data.content.filter(
                reply => !existingIds.has(reply.id)
            );

            return [...prev, ...uniqueReplies];
        });

        setHasMore(!data.last);
    }

    return (
        <div className="ml-6 mt-2 space-y-2">
            {replies.map(reply => (
                <CommentItem
                    key={reply.id}
                    comment={reply}
                    postId={postId}
                />
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
