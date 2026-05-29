import { useEffect, useMemo, useState } from "react";
import { getAllPosts, searchPosts } from "../services/postService";
import { getCategories } from "../services/categoryService";
import PostCard from "../components/posts/PostCard.jsx";
import Button from "../components/ui/Button.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import SectionCard from "../components/ui/SectionCard.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import { EmptyState, ErrorState, GridSkeleton } from "../components/ui/StateBlock.jsx";
import { extractRichTextText } from "../utils/richText.js";
import { Link } from "react-router-dom";

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState(null);
    const [categoryError, setCategoryError] = useState(null);
    const [search, setSearch] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        loadPosts();
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            setLoadingCategories(true);
            setCategoryError(null);
            setCategories(await getCategories() || []);
        } catch (error) {
            console.error("Error loading categories:", error);
            setCategoryError("Categories could not be loaded.");
        } finally {
            setLoadingCategories(false);
        }
    }

    async function loadPosts(query = "") {
        try {
            setLoading(true);
            setError(null);

            const normalizedQuery = query.trim();
            const data = normalizedQuery ? await searchPosts(normalizedQuery) : await getAllPosts();

            setPosts(data.content || data || []);
            setActiveSearch(normalizedQuery);
        } catch (error) {
            console.error("Error loading posts:", error);
            setError(query ? "Search failed. Please try again." : "Failed to load posts.");
        } finally {
            setLoading(false);
        }
    }

    function handleSearchSubmit(event) {
        event.preventDefault();
        loadPosts(search);
    }

    function clearSearch() {
        setSearch("");
        loadPosts();
    }

    const filteredPosts = useMemo(() => posts.filter((post) => {
        if (!selectedCategory) {
            return true;
        }

        return post.categories?.some((category) => {
            if (typeof category === "string") {
                return category.toLowerCase() === selectedCategory.name.toLowerCase();
            }

            return (
                category.id === selectedCategory.id ||
                category.slug === selectedCategory.slug ||
                category.name?.toLowerCase() === selectedCategory.name.toLowerCase()
            );
        });
    }), [posts, selectedCategory]);

    const featuredPost = !activeSearch && !selectedCategory ? filteredPosts[0] : null;
    const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;
    const title = activeSearch
        ? `Results for "${activeSearch}"`
        : selectedCategory
            ? selectedCategory.name
            : "Latest posts";

    return (
        <div className="space-y-7">
            <PageHeader
                eyebrow="Discover"
                title="Read what is new"
                description="Search the archive, browse categories, and save useful posts for later."
                meta={
                    <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
                        <StatCard label="Posts" value={posts.length} className="min-w-32 shadow-none" />
                        <StatCard label="Categories" value={categories.length} className="min-w-32 shadow-none" />
                    </div>
                }
            />

            <SectionCard title="Find posts" description="Search title and content, then narrow the feed by category.">
                <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 lg:flex-row">
                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100">
                        <span className="text-sm font-medium text-slate-500">Search</span>
                        <input
                            type="search"
                            placeholder="Search by title or content..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex gap-2">
                        {activeSearch && (
                            <Button type="button" onClick={clearSearch} variant="secondary" className="flex-1 sm:flex-none">
                                Clear
                            </Button>
                        )}
                        <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
                            Search
                        </Button>
                    </div>
                </form>

                <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                    <CategoryFilterButton active={!selectedCategory} onClick={() => setSelectedCategory(null)}>
                        All
                    </CategoryFilterButton>

                    {loadingCategories && (
                        <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                            Loading categories
                        </span>
                    )}

                    {!loadingCategories && categories.map((category) => (
                        <CategoryFilterButton
                            key={category.id}
                            active={selectedCategory?.id === category.id}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category.name}
                        </CategoryFilterButton>
                    ))}
                </div>

                {categoryError && (
                    <div className="mt-4">
                        <ErrorState message={categoryError} />
                    </div>
                )}
            </SectionCard>

            {featuredPost && (
                <section className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-blue-600">Featured latest</p>
                        <h2 className="mt-2 text-2xl font-semibold leading-tight text-slate-950">
                            {featuredPost.title}
                        </h2>
                        <p className="mt-3 line-clamp-3 max-w-3xl text-sm leading-6 text-slate-600">
                            {extractRichTextText(featuredPost.content) || "No description available."}
                        </p>
                        <Button as={Link} to={`/posts/${featuredPost.id}`} className="mt-5">
                            Read featured
                        </Button>
                    </div>

                    {(featuredPost.thumbnailUrl || featuredPost.coverImageUrl) && (
                        <Link to={`/posts/${featuredPost.id}`} className="overflow-hidden rounded-lg bg-slate-100">
                            <img
                                src={featuredPost.thumbnailUrl || featuredPost.coverImageUrl}
                                alt={featuredPost.title}
                                className="h-56 w-full object-cover transition duration-300 hover:scale-105"
                            />
                        </Link>
                    )}
                </section>
            )}

            <section className="space-y-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
                        <p className="text-sm text-slate-500">
                            {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
                        </p>
                    </div>
                </div>

                {loading && <GridSkeleton />}

                {!loading && error && (
                    <ErrorState message={error} />
                )}

                {!loading && !error && filteredPosts.length === 0 && (
                    <EmptyState
                        title="No posts found"
                        description="Try a different search term or reset the category filter."
                        action={<Button type="button" onClick={clearSearch} variant="secondary">Reset feed</Button>}
                    />
                )}

                {!loading && !error && gridPosts.length > 0 && (
                    <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {gridPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function CategoryFilterButton({ active, children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition ${
                active
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
        >
            {children}
        </button>
    );
}

export default HomePage;
