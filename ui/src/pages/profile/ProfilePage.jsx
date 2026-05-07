import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiFetch } from "../../utils/api.js";
import { Link } from "react-router-dom";

export default function ProfilePage() {
    const { token } = useContext(AuthContext);

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);

    const [bio, setBio] = useState("");
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        if (token) {
            loadUser();
            loadMyPosts();
        }
    }, [token]);

    async function loadUser() {
        const data = await apiFetch("http://localhost:8080/api/users/me");
        setUser(data);
        setBio(data.bio || "");
    }

    async function loadMyPosts() {
        const list = await apiFetch("http://localhost:8080/api/posts/me?page=0&size=20");
        const count = await apiFetch("http://localhost:8080/api/posts/me/count");

        setPosts(list.content);
        setPostCount(count);
    }

    async function updateBio() {
        await apiFetch("http://localhost:8080/api/users/me/bio", {
            method: "PUT",
            body: JSON.stringify({ bio }),
        });
        loadUser();
    }

    async function updateProfilePicture() {
        const form = new FormData();
        form.append("file", profilePic);

        await fetch("http://localhost:8080/api/users/me/profile-picture", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: form,
        });

        loadUser();
    }

    if (!user) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto p-8">
            {/* HEADER */}
            <div className="flex items-center gap-6 border-b pb-6 mb-8">
                <img
                    src={user.profilePicture || "/default-avatar.png"}
                    alt="avatar"
                    className="w-28 h-28 rounded-full border object-cover"
                />

                <div>
                    <h1 className="text-3xl font-semibold">{user.username}</h1>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="mt-2 text-gray-700">{user.bio || "No bio yet..."}</p>

                    <div className="mt-3 text-sm text-gray-500">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* EDIT BIO */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-3">Edit Bio</h2>

                <textarea
                    className="w-full border rounded p-3"
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />

                <button
                    onClick={updateBio}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Save Bio
                </button>
            </div>

            {/* UPDATE PROFILE PICTURE */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-3">Profile Picture</h2>
                <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />

                <button
                    onClick={updateProfilePicture}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
                >
                    Upload Picture
                </button>
            </div>

            {/* MY POSTS */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">My Posts</h2>
                    <span className="text-gray-600">{postCount} posts</span>
                </div>

                <div className="space-y-4">
                    {posts.map((post) => (
                        <Link
                            to={`/post/${post.id}`}
                            key={post.id}
                            className="block p-4 border rounded hover:bg-gray-50"
                        >
                            <h3 className="text-lg font-medium">{post.title}</h3>
                            <p className="text-gray-600 line-clamp-2">{post.content}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
