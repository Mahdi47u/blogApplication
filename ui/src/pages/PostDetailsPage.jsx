import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deletePost } from "../services/postService.js";

function PostDetailsPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await fetch(`http://localhost:8080/api/posts/${id}`);
                if (!response.ok) throw new Error("Failed to load post");

                const data = await response.json();
                setPost(data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch post");
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [id]);

    async function handleDelete() {
        try {
            await deletePost(id);
            navigate("/");
        } catch (error) {
            console.log("Delete failed, probably due to auth");
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!post) return <p>Post not found</p>;

    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            {post.category && (
                <p><strong>Category:</strong> {post.category}</p>
            )}

            <button onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default PostDetailsPage;
