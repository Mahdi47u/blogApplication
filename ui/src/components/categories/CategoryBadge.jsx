import { Link } from "react-router-dom";

export default function CategoryBadge({ category }) {
    const name = typeof category === "string" ? category : category.name;
    const slug = typeof category === "string" ? category : category.slug;

    return (
        <Link
            to={`/categories/${slug}`}
            className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition"
        >
            #{name}
        </Link>
    );
}
