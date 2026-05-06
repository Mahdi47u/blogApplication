import { useState } from "react";
import { createPost } from "../services/postService";
import { useNavigate } from "react-router-dom";

function CreatePostPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await createPost({
                title,
                content,
                category
            });

            navigate("/");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Create Post</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {/* ✅ Category Input */}
                <div>
                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>

                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default CreatePostPage;
