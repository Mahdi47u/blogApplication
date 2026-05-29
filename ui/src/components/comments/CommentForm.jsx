import { useState } from "react";
import Button from "../ui/Button";
import { createComment } from "../../services/commentService";

export default function CommentForm({
    postId,
    parentId,
    onSuccess,
    placeholder = "Write a comment..."
}) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        if (!text.trim() || loading) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const comment = await createComment({
                postId,
                text: text.trim(),
                parentId
            });

            setText("");
            onSuccess?.(comment);
        } catch (error) {
            console.error("Failed to post comment:", error);
            setError("Comment could not be posted.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                className="form-input min-h-[96px] resize-y"
                rows={3}
                placeholder={placeholder}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end">
                <Button type="submit" disabled={loading || !text.trim()}>
                    {loading ? "Posting" : parentId ? "Reply" : "Post comment"}
                </Button>
            </div>
        </form>
    );
}
