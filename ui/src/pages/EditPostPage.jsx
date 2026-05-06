import { useEffect, useState } from "react";
import { getPostById, updatePost } from "../services/postService";
import { useParams, useNavigate } from "react-router-dom";

function EditPostPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        loadPost();
    }, []);

    async function loadPost() {
        const data = await getPostById(id);
        setTitle(data.title);
        setContent(data.content);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        await updatePost(id, { title, content });
        navigate(`/posts/${id}`);
    }

    return (
        <div>
            <h1>Edit Post</h1>

            <form onSubmit={handleSubmit}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button type="submit">Save</button>
            </form>
        </div>
    );
}

export default EditPostPage;
