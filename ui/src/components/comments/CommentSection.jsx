import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getPostComments } from "../../services/commentService";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

export default function CommentSection({ postId }) {
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        loadComments();
    }, [page]);

    async function loadComments() {
        const data = await getPostComments(postId, page);
        setComments(prev => [...prev, ...data.content]);
        setHasMore(!data.last);
    }

    function onCommentAdded(newComment) {
        setComments(prev => [newComment, ...prev]);
    }

    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>

            {user && (
                <CommentForm
                    postId={postId}
                    onSuccess={onCommentAdded}
                />
            )}

            <div className="space-y-4 mt-6">
                {comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>

            {hasMore && (
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="mt-4 text-blue-500"
                >
                    Load more comments
                </button>
            )}
        </div>
    );
}
