import { Link } from "react-router-dom";

function PostCard({ post }) {
    return (
        <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                <Link to={`/posts/${post.id}`} className="hover:text-purple-600">
                    {post.title}
                </Link>
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
                {post.content?.substring(0, 100)}...
            </p>

            {post.category && (
                <p className="mt-3 text-sm text-purple-600 dark:text-purple-400 font-medium">
                    {post.category}
                </p>
            )}
        </article>
    );
}

export default PostCard;
