import { Link } from "react-router-dom";

export default function CategoryBadge({ category }) {
    const name = typeof category === "string" ? category : category.name;
    const slug = typeof category === "string" ? slugify(category) : category.slug;

    return (
        <Link
            to={`/categories/${slug}`}
            className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
        >
            #{name}
        </Link>
    );
}

function slugify(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
}
