import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPostsByAuthor } from "../../services/postService";
import { getPublicProfile } from "../../services/userService";
import PostCard from "../../components/posts/PostCard";
import ProfileHeader from "../../components/profile/ProfileHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import SectionCard from "../../components/ui/SectionCard.jsx";
import Tabs from "../../components/ui/Tabs.jsx";
import { EmptyState, ErrorState, GridSkeleton } from "../../components/ui/StateBlock.jsx";

const tabs = [
    { id: "posts", label: "Posts" },
    { id: "about", label: "About" },
];

export default function PublicProfilePage() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("posts");
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
        return (
            <div className="space-y-6">
                <div className="h-72 animate-pulse rounded-lg bg-slate-100" />
                <GridSkeleton />
            </div>
        );
    }

    if (error || !profile) {
        return <ErrorState message={error || "Profile not found."} />;
    }

    return (
        <div className="space-y-6">
            <Button as={Link} to="/" variant="ghost" className="px-0 hover:bg-transparent">
                Back to Home
            </Button>

            <ProfileHeader
                username={profile.username}
                avatarUrl={profile.profilePicture}
                bio={profile.bio}
                subtitle={`Joined ${formatDate(profile.createdAt)}`}
                stats={[
                    { label: "Public posts", value: posts.length },
                    { label: "Author since", value: formatDate(profile.createdAt) },
                ]}
            />

            <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

            {activeTab === "posts" && (
                posts.length === 0 ? (
                    <EmptyState
                        title="No posts yet"
                        description="This author has not published any posts yet."
                    />
                ) : (
                    <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )
            )}

            {activeTab === "about" && (
                <SectionCard title="About" description={`Public author profile for ${profile.username}.`}>
                    <dl className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Username</dt>
                            <dd className="mt-1 text-sm text-slate-950">{profile.username}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-slate-500">Joined</dt>
                            <dd className="mt-1 text-sm text-slate-950">{formatDate(profile.createdAt)}</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-slate-500">Bio</dt>
                            <dd className="mt-1 text-sm leading-6 text-slate-700">
                                {profile.bio || "No bio yet."}
                            </dd>
                        </div>
                    </dl>
                </SectionCard>
            )}
        </div>
    );
}

function formatDate(value) {
    if (!value) {
        return "Unknown";
    }

    return new Date(value).toLocaleDateString();
}
