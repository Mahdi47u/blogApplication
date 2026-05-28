
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import CommentForm from "./CommentForm";
import ReplyList from "./ReplyList";
import CommentLikeButton from "./CommentLikeButton";
import { deleteComment } from "../../services/commentService";

export default function CommentItem({ comment, postId }) {
    const { user } = useContext(AuthContext);

    const [showReply, setShowReply] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    if (isDeleted) return null;

    const isOwner = user?.id === comment.authorId;

    async function handleDelete() {
        if (!confirm("Delete this comment?")) return;

        await deleteComment(comment.id);
        setIsDeleted(true);
    }

    return (
        <div className="border-l pl-4">
            <div className="bg-gray-100 p-3 rounded">
                <Link
                    to={`/users/${comment.authorId}`}
                    className="text-sm font-semibold text-slate-800 transition hover:text-blue-600 hover:underline"
                >
                    {comment.authorUsername}
                </Link>

                <div className="mt-1">
                    {comment.text}
                </div>

                <div className="text-xs text-gray-500 mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                    {comment.edited && " (edited)"}
                </div>

                <div className="flex gap-3 mt-2 text-sm">
                    <CommentLikeButton commentId={comment.id} />

                    {user && (
                        <button onClick={() => setShowReply(v => !v)}>
                            Reply
                        </button>
                    )}

                    <button onClick={() => setShowReplies(v => !v)}>
                        Replies
                    </button>

                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            className="text-red-500"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {showReply && (
                <CommentForm
                    parentId={comment.id}
                    postId={postId}
                    onSuccess={() => {
                        setShowReply(false);
                        setShowReplies(true);
                    }}
                />
            )}

            {showReplies && (
                <ReplyList
                    commentId={comment.id}
                    postId={postId}
                />
            )}
        </div>
    );
}
