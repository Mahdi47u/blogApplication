import { useEffect, useState } from "react";
import {
    likeComment,
    unlikeComment,
    isCommentLiked,
    getCommentLikeCount
} from "../../services/commentService";

export default function CommentLikeButton({ commentId }) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        setLiked(await isCommentLiked(commentId));
        setCount(await getCommentLikeCount(commentId));
    }

    async function toggle() {
        if (liked) {
            await unlikeComment(commentId);
            setCount(c => c - 1);
        } else {
            await likeComment(commentId);
            setCount(c => c + 1);
        }
        setLiked(!liked);
    }

    return (
        <button onClick={toggle}>
            👍 {count}
        </button>
    );
}
