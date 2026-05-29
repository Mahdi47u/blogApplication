import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCategories, getCategoryBySlug, getPostsByCategory } from "../../services/categoryService";
import PostCard from "../../components/posts/PostCard";
import Button from "../../components/ui/Button.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import SectionCard from "../../components/ui/SectionCard.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import { EmptyState, ErrorState, GridSkeleton } from "../../components/ui/StateBlock.jsx";

function CategoryPostsPage() {
    const { slug } = useParams();
    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPosts();
    }, [slug]);

    async function loadPosts() {
        try {
            setLoading(true);
            setError(null);

            const [categoryData, postsData, categoriesData] = await Promise.all([
                getCategoryBySlug(slug),
                getPostsByCategory(slug),
                getCategories()
            ]);

            setCategory(categoryData);
            setPosts(postsData.content || postsData || []);
            setCategories(categoriesData || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load category posts.");
        } finally {
            setLoading(false);
        }
    }

    const relatedCategories = useMemo(() => {
        return categories
            .filter((item) => item.slug !== slug)
            .slice(0, 6);
    }, [categories, slug]);

    const featuredPost = posts[0];
    const gridPosts = featuredPost && posts.length > 1 ? posts.slice(1) : posts;

    return (
        <div className="space-y-7">
            <Button as={Link} to="/" variant="ghost" className="px-0 hover:bg-transparent">
                Back to Home
            </Button>

            <PageHeader
                eyebrow="Category"
                title={category?.name || formatSlug(slug)}
                description={category?.description || "Browse every post published in this category."}
                meta={
                    <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
                        <StatCard label="Posts" value={posts.length} className="min-w-32 shadow-none" />
                        <StatCard label="Related" value={relatedCategories.length} className="min-w-32 shadow-none" />
                    </div>
                }
            />

            {loading && <GridSkeleton />}

            {!loading && error && (
                <ErrorState message={error} />
            )}

            {!loading && !error && posts.length === 0 && (
                <EmptyState
                    title="No posts found"
                    description="This category does not have any published posts yet."
                    action={<Button as={Link} to="/" variant="secondary">Browse all posts</Button>}
                />
            )}

            {!loading && !error && featuredPost && posts.length > 1 && (
                <section className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div>
                        <p className="text-sm font-medium text-blue-600">Start here</p>
                        <h2 className="mt-2 text-2xl font-semibold leading-tight text-slate-950">
                            {featuredPost.title}
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            A highlighted post from this category.
                        </p>
                        <Button as={Link} to={`/posts/${featuredPost.id}`} className="mt-5">
                            Read post
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

            {!loading && !error && posts.length > 0 && (
                <section className="space-y-5">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-950">
                            {posts.length === 1 ? "Post" : "More in this category"}
                        </h2>
                        <p className="text-sm text-slate-500">
                            {posts.length} {posts.length === 1 ? "post" : "posts"} in {category?.name || formatSlug(slug)}
                        </p>
                    </div>

                    <div className={`grid gap-4 sm:gap-5 ${gridPosts.length === 1 ? "max-w-md" : "md:grid-cols-2 xl:grid-cols-3"}`}>
                        {gridPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                </section>
            )}

            {!loading && !error && relatedCategories.length > 0 && (
                <SectionCard title="Related categories" description="Keep browsing by topic.">
                    <div className="flex flex-wrap gap-2">
                        {relatedCategories.map((item) => (
                            <Button
                                key={item.id}
                                as={Link}
                                to={`/categories/${item.slug}`}
                                variant="secondary"
                                size="sm"
                            >
                                {item.name}
                            </Button>
                        ))}
                    </div>
                </SectionCard>
            )}
        </div>
    );
}

function formatSlug(value) {
    return value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export default CategoryPostsPage;
