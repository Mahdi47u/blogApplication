import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiFetch } from "../../utils/api.js";
import { removeProfileImage, uploadProfileImage } from "../../services/mediaService.js";
import { extractRichTextText } from "../../utils/richText.js";

export default function ProfilePage() {
    const { token, updateUser } = useContext(AuthContext);

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [bio, setBio] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [profilePreview, setProfilePreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [savingBio, setSavingBio] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (token) {
            loadProfile();
        }
    }, [token]);

    async function loadProfile() {
        try {
            setLoading(true);
            setError(null);

            const [userData, postsData, countData] = await Promise.all([
                apiFetch("http://localhost:8080/api/users/me"),
                apiFetch("http://localhost:8080/api/posts/me?page=0&size=20"),
                apiFetch("http://localhost:8080/api/posts/me/count")
            ]);

            setUser(userData);
            updateUser(userData);
            setBio(userData.bio || "");
            setProfilePreview(userData.profilePicture || "");
            setPosts(postsData.content || []);
            setPostCount(countData);
        } catch (error) {
            console.error("Failed to load profile:", error);
            setError("Profile could not be loaded.");
        } finally {
            setLoading(false);
        }
    }

    async function updateBio() {
        try {
            setSavingBio(true);
            setMessage(null);
            setError(null);

            const updated = await apiFetch("http://localhost:8080/api/users/me/bio", {
                method: "PUT",
                body: JSON.stringify({ bio }),
            });

            setUser(updated);
            updateUser(updated);
            setMessage("Bio updated.");
        } catch (error) {
            console.error("Failed to update bio:", error);
            setError(error.message || "Bio could not be updated.");
        } finally {
            setSavingBio(false);
        }
    }

    function handleProfilePicChange(event) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setProfilePic(file);
        setProfilePreview(URL.createObjectURL(file));
    }

    async function updateProfilePicture() {
        if (!profilePic) {
            return;
        }

        try {
            setUploadingImage(true);
            setMessage(null);
            setError(null);

            await uploadProfileImage(profilePic);
            setProfilePic(null);
            await loadProfile();
            setMessage("Profile picture updated.");
        } catch (error) {
            console.error("Failed to update profile picture:", error);
            setError(error.message || "Profile picture could not be updated.");
        } finally {
            setUploadingImage(false);
        }
    }

    async function deleteProfilePicture() {
        try {
            setUploadingImage(true);
            setMessage(null);
            setError(null);

            await removeProfileImage();
            setProfilePic(null);
            await loadProfile();
            setMessage("Profile picture removed.");
        } catch (error) {
            console.error("Failed to remove profile picture:", error);
            setError(error.message || "Profile picture could not be removed.");
        } finally {
            setUploadingImage(false);
        }
    }

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (!user) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
                {error || "Profile not found."}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-5">
                        <Avatar user={user} preview={profilePreview} />

                        <div>
                            <h1 className="text-3xl font-semibold text-slate-950">{user.username}</h1>
                            <p className="mt-1 text-slate-500">{user.email}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {user.roles?.map((role) => (
                                    <RoleBadge key={role} role={role} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-right">
                        <div>
                            <p className="text-2xl font-semibold text-slate-950">{postCount}</p>
                            <p className="text-sm text-slate-500">Posts</p>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-slate-950">
                                {formatDate(user.createdAt)}
                            </p>
                            <p className="text-sm text-slate-500">Joined</p>
                        </div>
                    </div>
                </div>

                <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-700">
                    {user.bio || "No bio yet."}
                </p>
            </header>

            {message && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    {message}
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="space-y-6">
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-950">Bio</h2>
                        <textarea
                            className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            rows="5"
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                            placeholder="Write a short bio..."
                        />

                        <button
                            onClick={updateBio}
                            disabled={savingBio}
                            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {savingBio ? "Saving" : "Save Bio"}
                        </button>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">My Posts</h2>
                            <span className="text-sm text-slate-500">{postCount} posts</span>
                        </div>

                        {posts.length === 0 ? (
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                                You have not published any posts yet.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {posts.map((post) => (
                                    <Link
                                        to={`/posts/${post.id}`}
                                        key={post.id}
                                        className="block py-4 transition hover:bg-slate-50"
                                    >
                                        <h3 className="font-medium text-slate-950">{post.title}</h3>
                                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                                            {extractRichTextText(post.content)}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-950">Profile Picture</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Upload a JPG, PNG, or WEBP image. Max 10MB.
                    </p>

                    <div className="mt-5">
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handleProfilePicChange}
                            className="
                                block w-full text-sm text-slate-600
                                file:mr-4 file:rounded-lg file:border-0
                                file:bg-blue-50 file:px-4 file:py-2
                                file:text-sm file:font-medium file:text-blue-700
                                hover:file:bg-blue-100
                            "
                        />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            onClick={updateProfilePicture}
                            disabled={!profilePic || uploadingImage}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {uploadingImage ? "Uploading" : "Upload"}
                        </button>

                        {user.profilePicture && (
                            <button
                                onClick={deleteProfilePicture}
                                disabled={uploadingImage}
                                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                </aside>
            </section>
        </div>
    );
}

function Avatar({ user, preview }) {
    const initials = user.username?.slice(0, 2).toUpperCase() || "U";

    return (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-2xl font-semibold text-slate-500">
            {preview ? (
                <img
                    src={preview}
                    alt={user.username}
                    className="h-full w-full object-cover"
                />
            ) : (
                initials
            )}
        </div>
    );
}

function RoleBadge({ role }) {
    const tone = role === "SUPERADMIN"
        ? "bg-purple-50 text-purple-700"
        : role === "ADMIN"
            ? "bg-blue-50 text-blue-700"
            : "bg-slate-100 text-slate-700";

    return (
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
            {role}
        </span>
    );
}

function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <div className="h-40 animate-pulse rounded-lg bg-slate-100" />
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="h-80 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-80 animate-pulse rounded-lg bg-slate-100" />
            </div>
        </div>
    );
}

function formatDate(value) {
    if (!value) return "Unknown";
    return new Date(value).toLocaleDateString();
}
