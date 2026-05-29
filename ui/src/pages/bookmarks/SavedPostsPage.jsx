import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../../components/posts/PostCard.jsx";
import { getSavedPostCount, getSavedPosts } from "../../services/bookmarkService";
import Button from "../../components/ui/Button.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import SectionCard from "../../components/ui/SectionCard.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import { EmptyState, ErrorState, GridSkeleton } from "../../components/ui/StateBlock.jsx";
import { extractRichTextText } from "../../utils/richText.js";

export default function SavedPostsPage() {
    const [posts, setPosts] = useState([]);
    const [count, setCount] = useState(0);
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSavedPosts();
    }, []);

    async function loadSavedPosts() {
        try {
            setLoading(true);
            setError(null);

            const list = await getSavedPosts();
            const total = await getSavedPostCount();

            setPosts((list.content || []).map((bookmark) => bookmark.post).filter(Boolean));
            setCount(total);
        } catch (error) {
            console.error("Failed to load saved posts:", error);
            setError("Saved posts could not be loaded.");
        } finally {
            setLoading(false);
        }
    }

    const filteredPosts = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        const nextPosts = normalized
            ? posts.filter((post) => {
                const haystack = `${post.title || ""} ${extractRichTextText(post.content)}`.toLowerCase();
                return haystack.includes(normalized);
            })
            : [...posts];

        return nextPosts.sort((a, b) => {
            if (sort === "title") {
                return (a.title || "").localeCompare(b.title || "");
            }

            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    }, [posts, query, sort]);

    return (
        <div className="space-y-7">
            <PageHeader
                eyebrow="Library"
                title="Saved posts"
                description="Your private reading list for posts worth coming back to."
                meta={<StatCard label="Saved" value={count} className="min-w-32 shadow-none" />}
                actions={<Button as={Link} to="/" variant="secondary">Browse posts</Button>}
            />

            <SectionCard title="Library tools" description="Search and sort your saved posts locally.">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search saved posts..."
                        className="form-input"
                    />

                    <select
                        value={sort}
                        onChange={(event) => setSort(event.target.value)}
                        className="form-input"
                    >
                        <option value="newest">Newest first</option>
                        <option value="title">Title A-Z</option>
                    </select>
                </div>
            </SectionCard>

            {loading && <GridSkeleton />}

            {!loading && error && (
                <ErrorState message={error} />
            )}

            {!loading && !error && posts.length === 0 && (
                <EmptyState
                    title="No saved posts yet"
                    description="Save posts from the feed and they will show up here."
                    action={<Button as={Link} to="/">Browse posts</Button>}
                />
            )}

            {!loading && !error && posts.length > 0 && filteredPosts.length === 0 && (
                <EmptyState
                    title="No saved posts match"
                    description="Try a different search term."
                    action={<Button type="button" variant="secondary" onClick={() => setQuery("")}>Clear search</Button>}
                />
            )}

            {!loading && !error && filteredPosts.length > 0 && (
                <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}
