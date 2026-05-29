import { Link } from "react-router-dom";
import CategoryBadge from "../categories/CategoryBadge";
import BookmarkButton from "../bookmarks/BookmarkButton";
import PostAuthor from "./PostAuthor";
import { extractRichTextText } from "../../utils/richText";

function PostCard({ post }) {
    const excerpt = post.excerpt || post.description || extractRichTextText(post.content);

    return (
        <article
            className="
                group flex h-full flex-col rounded-lg
                border border-slate-200 bg-white shadow-sm
                transition duration-200
                hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md
            "
        >
            {(post.thumbnailUrl || post.coverImageUrl) && (
                <Link to={`/posts/${post.id}`} className="block overflow-hidden rounded-t-lg bg-slate-100">
                    <img
                        src={post.thumbnailUrl || post.coverImageUrl}
                        alt={post.title}
                        className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                </Link>
            )}

            <div className="flex flex-1 flex-col p-5">
                {/* Category */}
                {post.categories?.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {post.categories.map((category) => (
                            <CategoryBadge
                                key={typeof category === "string" ? category : category.id}
                                category={category}
                            />
                        ))}
                    </div>
                )}

                {/* Title */}
                <Link to={`/posts/${post.id}`}>
                    <h2 className="mb-2 text-lg font-semibold leading-snug text-slate-950 transition group-hover:text-blue-600">
                        {post.title}
                    </h2>
                </Link>

                {/* Excerpt */}
                <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600">
                    {excerpt || "No description available."}
                </p>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
                    <PostAuthor post={post} />

                    <div className="flex shrink-0 items-center gap-2">
                        <BookmarkButton postId={post.id} />

                        <Link
                            to={`/posts/${post.id}`}
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Read more
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default PostCard;
