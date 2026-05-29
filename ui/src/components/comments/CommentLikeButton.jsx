import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
    getCommentLikeCount,
    isCommentLiked,
    likeComment,
    unlikeComment
} from "../../services/commentService";

export default function CommentLikeButton({ commentId, initialCount = 0 }) {
    const { user } = useContext(AuthContext);
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(initialCount || 0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        load();
    }, [commentId, user]);

    async function load() {
        try {
            setCount(await getCommentLikeCount(commentId));

            if (user) {
                setLiked(await isCommentLiked(commentId));
            } else {
                setLiked(false);
            }
        } catch (error) {
            console.error("Failed to load comment like state:", error);
        }
    }

    async function toggle() {
        if (!user || loading) {
            return;
        }

        try {
            setLoading(true);

            if (liked) {
                await unlikeComment(commentId);
                setCount((value) => Math.max(0, value - 1));
                setLiked(false);
            } else {
                await likeComment(commentId);
                setCount((value) => value + 1);
                setLiked(true);
            }
        } finally {
            setLoading(false);
        }
    }

    if (!user) {
        return (
            <Link
                to="/login"
                className="rounded-md px-2 py-1 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
                Like {count}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={loading}
            className={`rounded-md px-2 py-1 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                liked
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
        >
            {liked ? "Liked" : "Like"} {count}
        </button>
    );
}
