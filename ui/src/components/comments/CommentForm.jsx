// CommentForm.jsx

import { useState } from "react";
import { createComment } from "../../services/commentService";

export default function CommentForm({
                                        postId,
                                        parentId,
                                        onSuccess
                                    }) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!text.trim()) return;

        setLoading(true);

        try {
            const comment = await createComment({
                postId,
                text,
                parentId
            });

            setText("");

            onSuccess?.(comment);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-2">
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                className="w-full border rounded p-2"
                rows={3}
                placeholder="Write a comment..."
            />

            <button
                disabled={loading}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
                {loading ? "Posting..." : "Post"}
            </button>
        </form>
    );
}
