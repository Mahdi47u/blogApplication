import { Link } from "react-router-dom";
import CategoryBadge from "../categories/CategoryBadge";

function PostCard({ post }) {
    return (
        <Link
            to={`/posts/${post.id}`}
            className="
                group block p-5 rounded-3xl
                bg-white/60 backdrop-blur-xl
                border border-white/40 shadow-lg
                hover:shadow-xl transition duration-300
                hover:-translate-y-2
            "
        >
            {/* Category */}
            {post.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.map((category) => (
                        <CategoryBadge
                            key={category.id}
                            category={category}
                        />
                    ))}
                </div>
            )}


            {/* Title */}
            <h2 className="
                text-lg font-semibold text-gray-900 mb-2
                group-hover:text-blue-600 transition
            ">
                {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-gray-600 text-sm leading-tight mb-4 line-clamp-3">
                {post.excerpt || post.description || "No description available."}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                    {post.authorName || "Unknown"}
                </span>

                <span className="
                    text-blue-600 font-medium
                    group-hover:underline
                ">
                    Read more →
                </span>
            </div>
        </Link>
    );
}

export default PostCard;
