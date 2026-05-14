import { Link } from "react-router-dom";

export default function CategoryBadge({ category }) {
    return (
        <Link
            to={`/categories/${category.slug}`}
            className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition"
        >
            #{category.name}
        </Link>
    );
}