import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPostsByAuthor } from "../../services/postService";
import { getPublicProfile } from "../../services/userService";
import PostCard from "../../components/posts/PostCard";

export default function PublicProfilePage() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProfile();
    }, [id]);

    async function loadProfile() {
        try {
            setLoading(true);
            setError(null);

            const [profileData, postsData] = await Promise.all([
                getPublicProfile(id),
                getPostsByAuthor(id)
            ]);

            setProfile(profileData);
            setPosts(postsData.content || postsData || []);
        } catch (error) {
            console.error("Failed to load public profile:", error);
            setError("Profile could not be loaded.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <PublicProfileSkeleton />;
    }

    if (error || !profile) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
                {error || "Profile not found."}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Link to="/" className="inline-block text-sm font-medium text-blue-600 hover:underline">
                Back to Home
            </Link>

            <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-5">
                        <Avatar profile={profile} />

                        <div>
                            <h1 className="text-3xl font-semibold text-slate-950">{profile.username}</h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Joined {formatDate(profile.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                        <p className="text-2xl font-semibold text-slate-950">{posts.length}</p>
                        <p className="text-sm text-slate-500">Public posts</p>
                    </div>
                </div>

                <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-700">
                    {profile.bio || "No bio yet."}
                </p>
            </header>

            <section>
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-950">Posts by {profile.username}</h2>
                </div>

                {posts.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
                        This user has not published any posts yet.
                    </div>
                ) : (
                    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function Avatar({ profile }) {
    const initials = profile.username?.slice(0, 2).toUpperCase() || "U";

    return (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-2xl font-semibold text-slate-500">
            {profile.profilePicture ? (
                <img
                    src={profile.profilePicture}
                    alt={profile.username}
                    className="h-full w-full object-cover"
                />
            ) : (
                initials
            )}
        </div>
    );
}

function PublicProfileSkeleton() {
    return (
        <div className="space-y-6">
            <div className="h-36 animate-pulse rounded-lg bg-slate-100" />
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
            </div>
        </div>
    );
}

function formatDate(value) {
    if (!value) {
        return "Unknown";
    }

    return new Date(value).toLocaleDateString();
}
