import { useEffect, useState } from "react";
import CategoryMultiSelect from "../categories/CategoryMultiSelect";
import { getCategories } from "../../services/categoryService";

function PostForm({initialData = {}, onSubmit, submitText = "Save Post",}) {

    const [title, setTitle] = useState(
        initialData.title || ""
    );

    const [content, setContent] = useState(
        initialData.content || ""
    );

    const [categories, setCategories] = useState([]);

    const [selectedCategories, setSelectedCategories] =
        useState(initialData.categories || []);

    const [loadingCategories, setLoadingCategories] =
        useState(true);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error("Failed to load categories", err);
        } finally {
            setLoadingCategories(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setSubmitting(true);

            await onSubmit({
                title,
                content,
                categoryIds: selectedCategories.map(
                    category => category.id
                ),
            });

        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            {/* Title */}
            <div>
                <label className="block text-sm text-gray-600 mb-2">
                    Title
                </label>

                <input
                    type="text"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    className="
                        w-full rounded-xl border border-gray-200
                        px-4 py-3
                        focus:ring-2 focus:ring-blue-500
                        outline-none
                    "
                    placeholder="Enter post title"
                    required
                />
            </div>

            {/* Categories */}
            <div>
                {loadingCategories ? (
                    <p className="text-gray-500">
                        Loading categories...
                    </p>
                ) : (
                    <CategoryMultiSelect
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onChange={setSelectedCategories}
                    />
                )}
            </div>

            {/* Content */}
            <div>
                <label className="block text-sm text-gray-600 mb-2">
                    Content
                </label>

                <textarea
                    value={content}
                    onChange={(e) =>
                        setContent(e.target.value)
                    }
                    rows="10"
                    className="
                        w-full rounded-xl border border-gray-200
                        px-4 py-3
                        focus:ring-2 focus:ring-blue-500
                        outline-none resize-none
                    "
                    placeholder="Write your post..."
                    required
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={submitting}
                className="
                    px-6 py-3 rounded-xl
                    bg-blue-600 text-white font-medium
                    hover:bg-blue-700
                    transition shadow-md
                    disabled:opacity-50
                "
            >
                {submitting
                    ? "Saving..."
                    : submitText}
            </button>

        </form>
    );
}

export default PostForm;
