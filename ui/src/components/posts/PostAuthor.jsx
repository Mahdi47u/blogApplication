import { Link } from "react-router-dom";

export default function PostAuthor({ post, size = "sm", showPrefix = false, className = "" }) {
    const name = post.authorName || `User ${post.authorId}`;
    const initials = name.slice(0, 2).toUpperCase();
    const avatarSize = size === "md" ? "h-10 w-10" : "h-8 w-8";

    return (
        <Link
            to={`/users/${post.authorId}`}
            className={`inline-flex min-w-0 items-center gap-2 text-slate-600 transition hover:text-blue-600 ${className}`}
        >
            <span className={`${avatarSize} flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600`}>
                {post.authorAvatar ? (
                    <img
                        src={post.authorAvatar}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    initials
                )}
            </span>
            <span className="min-w-0 truncate">
                {showPrefix && "By "}
                <span className="font-medium">{name}</span>
            </span>
        </Link>
    );
}
