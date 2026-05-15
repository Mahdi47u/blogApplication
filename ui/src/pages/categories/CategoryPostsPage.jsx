import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getPostsByCategory } from "../../services/categoryService";

import PostCard from "../../components/posts/PostCard";

function CategoryPostsPage() {

    const { slug } = useParams();

    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        loadPosts();
    }, [slug]);

    async function loadPosts() {

        try {

            setLoading(true);

            const data =
                await getPostsByCategory(slug);

            setPosts(data);

        } catch (err) {

            console.error(err);

            setError("Failed to load posts");

        } finally {

            setLoading(false);
        }
    }

    return (
        <div className="
            min-h-screen
            bg-gradient-to-br
            from-slate-50 via-blue-50 to-indigo-100
            px-4 py-10
        ">

            <div className="max-w-6xl mx-auto">

                <Link
                    to="/"
                    className="
                        text-blue-600
                        hover:underline
                        mb-6
                        inline-block
                    "
                >
                    ← Back to Home
                </Link>

                <h1 className="
                    text-3xl font-bold
                    mb-8 text-gray-900
                ">
                    Category: {slug}
                </h1>

                {loading && (
                    <p className="text-gray-600 animate-pulse">
                        Loading posts...
                    </p>
                )}

                {error && (
                    <p className="text-red-500">
                        {error}
                    </p>
                )}

                {!loading && posts.length === 0 && (
                    <p className="text-gray-600">
                        No posts found in this category.
                    </p>
                )}

                {!loading && posts.length > 0 && (

                    <div className="
                        grid gap-7
                        md:grid-cols-2
                        lg:grid-cols-3
                    ">

                        {posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                            />
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}

export default CategoryPostsPage;
