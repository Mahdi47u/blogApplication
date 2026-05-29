import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { apiFetch } from "../../utils/api.js";
import { removeProfileImage, uploadProfileImage } from "../../services/mediaService.js";
import { getSavedPostCount, getSavedPosts } from "../../services/bookmarkService.js";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import SectionCard from "../../components/ui/SectionCard.jsx";
import Tabs from "../../components/ui/Tabs.jsx";
import { EmptyState, ErrorState, GridSkeleton } from "../../components/ui/StateBlock.jsx";
import ProfileHeader from "../../components/profile/ProfileHeader.jsx";
import PostCard from "../../components/posts/PostCard.jsx";

const tabs = [
    { id: "posts", label: "Posts" },
    { id: "saved", label: "Saved" },
    { id: "about", label: "About" },
];

export default function ProfilePage() {
    const { token, updateUser } = useContext(AuthContext);

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [savedCount, setSavedCount] = useState(0);
    const [bio, setBio] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [profilePreview, setProfilePreview] = useState("");
    const [activeTab, setActiveTab] = useState("posts");
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

            const [userData, postsData, countData, savedData, savedCountData] = await Promise.all([
                apiFetch("http://localhost:8080/api/users/me"),
                apiFetch("http://localhost:8080/api/posts/me?page=0&size=20"),
                apiFetch("http://localhost:8080/api/posts/me/count"),
                getSavedPosts(0, 20),
                getSavedPostCount(),
            ]);

            setUser(userData);
            updateUser(userData);
            setBio(userData.bio || "");
            setProfilePreview(userData.profilePicture || "");
            setPosts(postsData.content || []);
            setPostCount(countData);
            setSavedPosts(normalizeSavedPosts(savedData));
            setSavedCount(savedCountData);
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
        return <ErrorState message={error || "Profile not found."} />;
    }

    const roleBadges = user.roles?.map((role) => ({
        label: role,
        tone: role === "SUPERADMIN" ? "purple" : role === "ADMIN" ? "brand" : "default",
    })) || [];

    return (
        <div className="space-y-6">
            <ProfileHeader
                username={user.username}
                avatarUrl={profilePreview}
                subtitle={user.email}
                bio={user.bio}
                badges={roleBadges}
                stats={[
                    { label: "Posts", value: postCount },
                    { label: "Saved", value: savedCount },
                    { label: "Joined", value: formatDate(user.createdAt) },
                ]}
            />

            {message && (
                <Badge tone="success" className="rounded-lg px-4 py-3">
                    {message}
                </Badge>
            )}

            {error && <ErrorState message={error} />}

            <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

            {activeTab === "posts" && (
                <PostsGrid
                    posts={posts}
                    emptyTitle="No posts yet"
                    emptyDescription="Your published posts will appear here."
                />
            )}

            {activeTab === "saved" && (
                <PostsGrid
                    posts={savedPosts}
                    emptyTitle="No saved posts"
                    emptyDescription="Posts you save will appear here."
                />
            )}

            {activeTab === "about" && (
                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <SectionCard
                        title="Bio"
                        description="This bio appears on your public author profile."
                    >
                        <textarea
                            className="form-input min-h-36 w-full resize-y"
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                            placeholder="Write a short bio..."
                        />

                        <div className="mt-4 flex justify-end">
                            <Button onClick={updateBio} disabled={savingBio}>
                                {savingBio ? "Saving" : "Save Bio"}
                            </Button>
                        </div>
                    </SectionCard>

                    <SectionCard
                        as="aside"
                        title="Profile Picture"
                        description="Upload a JPG, PNG, or WEBP image. Max 10MB."
                    >
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

                        <div className="mt-5 flex flex-wrap gap-3">
                            <Button
                                onClick={updateProfilePicture}
                                disabled={!profilePic || uploadingImage}
                            >
                                {uploadingImage ? "Uploading" : "Upload"}
                            </Button>

                            {user.profilePicture && (
                                <Button
                                    variant="danger"
                                    onClick={deleteProfilePicture}
                                    disabled={uploadingImage}
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    </SectionCard>
                </div>
            )}
        </div>
    );
}

function PostsGrid({ posts, emptyTitle, emptyDescription }) {
    if (posts.length === 0) {
        return <EmptyState title={emptyTitle} description={emptyDescription} />;
    }

    return (
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <div className="h-72 animate-pulse rounded-lg bg-slate-100" />
            <GridSkeleton />
        </div>
    );
}

function normalizeSavedPosts(data) {
    const items = data.content || data || [];

    return items
        .map((item) => item.post || item)
        .filter(Boolean);
}

function formatDate(value) {
    if (!value) return "Unknown";
    return new Date(value).toLocaleDateString();
}
