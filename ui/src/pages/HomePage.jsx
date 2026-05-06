import { useEffect, useState } from "react";
import { getAllPosts } from "../services/postService";
import PostCard from "../components/PostCard";

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPosts();
    }, []);

    async function loadPosts() {
        try {
            setLoading(true);
            setError(null);

            const data = await getAllPosts();
            setPosts(data.content || data || []);
        } catch (error) {
            console.error("Error loading posts:", error);
            setError("Failed to load posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Recent Posts</h1>

            {loading && (
                <p className="text-gray-500">Loading posts...</p>
            )}

            {error && (
                <p className="text-red-500">{error}</p>
            )}

            {!loading && !error && posts.length === 0 && (
                <p className="text-gray-500">No posts yet</p>
            )}

            {!loading && !error && posts.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
}

export default HomePage;
