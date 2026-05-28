import { Link } from "react-router-dom";
import CategoryBadge from "../categories/CategoryBadge";
import BookmarkButton from "../bookmarks/BookmarkButton";
import { extractRichTextText } from "../../utils/richText";

function PostCard({ post }) {
    const excerpt = post.excerpt || post.description || extractRichTextText(post.content);

    return (
        <article
            className="
                group p-5 rounded-3xl
                bg-white/60 backdrop-blur-xl
                border border-white/40 shadow-lg
                hover:shadow-xl transition duration-300
                hover:-translate-y-2
            "
        >
            {(post.thumbnailUrl || post.coverImageUrl) && (
                <Link to={`/posts/${post.id}`} className="mb-4 block overflow-hidden rounded-2xl bg-slate-100">
                    <img
                        src={post.thumbnailUrl || post.coverImageUrl}
                        alt={post.title}
                        className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                </Link>
            )}

            {/* Category */}
            {post.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
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
                <h2 className="
                    text-lg font-semibold text-gray-900 mb-2
                    group-hover:text-blue-600 transition
                ">
                    {post.title}
                </h2>
            </Link>

            {/* Excerpt */}
            <p className="text-gray-600 text-sm leading-tight mb-4 line-clamp-3">
                {excerpt || "No description available."}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-500">
                    {post.authorName || "Unknown"}
                </span>

                <div className="flex items-center gap-2">
                    <BookmarkButton postId={post.id} />

                    <Link
                        to={`/posts/${post.id}`}
                        className="
                            text-blue-600 font-medium
                            hover:underline
                        "
                    >
                        Read more
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default PostCard;
