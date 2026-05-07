import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";
import { Link } from "react-router-dom";

export default function AdminPostsPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        loadPosts();
    }, []);

    async function loadPosts() {
        const data = await apiFetch("http://localhost:8080/api/admin/posts");
        setPosts(data);
    }

    async function deletePost(id) {
        if (!confirm("Are you sure you want to delete this post?")) return;

        await apiFetch(`http://localhost:8080/api/admin/posts/${id}`, {
            method: "DELETE"
        });

        loadPosts();
    }

    async function approvePost(id) {
        await apiFetch(`http://localhost:8080/api/admin/posts/${id}/approve`, {
            method: "PUT"
        });

        loadPosts();
    }

    return (
        <div>
            <h1 className="text-3xl font-semibold mb-6">Posts Moderation</h1>

            <div className="space-y-4">
                {posts.map(post => (
                    <div
                        key={post.id}
                        className="p-4 border rounded-lg shadow-sm bg-white"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">{post.title}</h2>

                            <span className={`text-sm px-3 py-1 rounded-full 
                                ${post.approved ? "bg-green-200 text-green-700" : "bg-yellow-200 text-yellow-700"}`}>
                                {post.approved ? "Approved" : "Pending"}
                            </span>
                        </div>

                        <p className="text-gray-700 mt-2 line-clamp-2">{post.content}</p>

                        <div className="flex gap-3 mt-4">

                            <Link
                                to={`/posts/${post.id}/edit`}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() => deletePost(post.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>

                            {!post.approved && (
                                <button
                                    onClick={() => approvePost(post.id)}
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Approve
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
