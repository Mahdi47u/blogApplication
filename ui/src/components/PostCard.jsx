// import { Link } from "react-router-dom";
//
// function PostCard({ post }) {
//     return (
//         <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
//                 <Link to={`/posts/${post.id}`} className="hover:text-purple-600">
//                     {post.title}
//                 </Link>
//             </h2>
//
//             <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
//                 {post.content?.substring(0, 100)}...
//             </p>
//
//             {post.category && (
//                 <p className="mt-3 text-sm text-purple-600 dark:text-purple-400 font-medium">
//                     {post.category}
//                 </p>
//             )}
//         </article>
//     );
// }
//
// export default PostCard;
import { Link } from "react-router-dom";

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
            {post.category && (
                <span className="
                    inline-block mb-3 px-3 py-1 rounded-full text-xs
                    font-medium bg-blue-600/10 text-blue-700
                ">
                    {post.category.toUpperCase()}
                </span>
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
