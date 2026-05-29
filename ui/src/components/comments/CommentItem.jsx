import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { deleteComment, updateComment } from "../../services/commentService";
import Button from "../ui/Button";
import CommentForm from "./CommentForm";
import CommentLikeButton from "./CommentLikeButton";
import ReplyList from "./ReplyList";

export default function CommentItem({
    comment,
    postId,
    depth = 0,
    onDeleted,
    onUpdated,
}) {
    const { user } = useContext(AuthContext);
    const [showReply, setShowReply] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text || "");
    const [savingEdit, setSavingEdit] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [replyRefreshKey, setReplyRefreshKey] = useState(0);

    const isOwner = user?.id === comment.authorId;
    const canNestFurther = depth < 3;

    async function handleDelete() {
        if (!confirm("Delete this comment?")) {
            return;
        }

        try {
            setDeleting(true);
            await deleteComment(comment.id);
            onDeleted?.(comment.id);
        } catch (error) {
            console.error("Failed to delete comment:", error);
            setDeleting(false);
        }
    }

    async function handleEditSubmit(event) {
        event.preventDefault();

        if (!editText.trim() || savingEdit) {
            return;
        }

        try {
            setSavingEdit(true);
            const updated = await updateComment(comment.id, editText.trim());
            onUpdated?.(updated);
            setEditing(false);
        } catch (error) {
            console.error("Failed to edit comment:", error);
        } finally {
            setSavingEdit(false);
        }
    }

    function handleReplyAdded() {
        setShowReply(false);
        setShowReplies(true);
        setReplyRefreshKey((value) => value + 1);
    }

    return (
        <article className={depth > 0 ? "relative pl-4 sm:pl-5" : ""}>
            {depth > 0 && (
                <span className="absolute bottom-0 left-0 top-0 w-px bg-slate-200" aria-hidden="true" />
            )}

            <div className={`flex gap-3 ${deleting ? "opacity-60" : ""}`}>
                <Avatar comment={comment} />

                <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <Link
                            to={`/users/${comment.authorId}`}
                            className="font-medium text-slate-950 transition hover:text-blue-600 hover:underline"
                        >
                            {comment.authorUsername || "Unknown"}
                        </Link>
                        <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                        {comment.edited && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                                edited
                            </span>
                        )}
                    </div>

                    {editing ? (
                        <form onSubmit={handleEditSubmit} className="mt-3 space-y-3">
                            <textarea
                                value={editText}
                                onChange={(event) => setEditText(event.target.value)}
                                className="form-input min-h-[88px] resize-y"
                            />
                            <div className="flex flex-wrap justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setEditing(false);
                                        setEditText(comment.text || "");
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={savingEdit || !editText.trim()}>
                                    {savingEdit ? "Saving" : "Save"}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                            {comment.text}
                        </p>
                    )}

                    {!editing && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                            <CommentLikeButton commentId={comment.id} initialCount={comment.likeCount} />

                            {user && canNestFurther && (
                                <ActionButton onClick={() => setShowReply((value) => !value)}>
                                    {showReply ? "Cancel reply" : "Reply"}
                                </ActionButton>
                            )}

                            <ActionButton onClick={() => setShowReplies((value) => !value)}>
                                {showReplies ? "Hide replies" : "Replies"}
                            </ActionButton>

                            {isOwner && (
                                <>
                                    <ActionButton onClick={() => setEditing(true)}>
                                        Edit
                                    </ActionButton>
                                    <ActionButton danger onClick={handleDelete} disabled={deleting}>
                                        {deleting ? "Deleting" : "Delete"}
                                    </ActionButton>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showReply && (
                <div className="ml-12 mt-3">
                    <CommentForm
                        parentId={comment.id}
                        postId={postId}
                        placeholder={`Reply to ${comment.authorUsername || "comment"}...`}
                        onSuccess={handleReplyAdded}
                    />
                </div>
            )}

            {showReplies && (
                <ReplyList
                    commentId={comment.id}
                    postId={postId}
                    depth={depth + 1}
                    refreshKey={replyRefreshKey}
                />
            )}
        </article>
    );
}

function Avatar({ comment }) {
    const initials = (comment.authorUsername || "U").slice(0, 2).toUpperCase();

    return (
        <Link
            to={`/users/${comment.authorId}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-600"
        >
            {comment.authorAvatar ? (
                <img
                    src={comment.authorAvatar}
                    alt={comment.authorUsername}
                    className="h-full w-full object-cover"
                />
            ) : (
                initials
            )}
        </Link>
    );
}

function ActionButton({ danger = false, className = "", ...props }) {
    return (
        <button
            type="button"
            className={`rounded-md px-2 py-1 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            } ${className}`}
            {...props}
        />
    );
}

function formatDate(value) {
    if (!value) {
        return "Unknown";
    }

    return new Date(value).toLocaleString();
}
