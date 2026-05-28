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

    const [selectedCategories, setSelectedCategories] = useState([]);

    const [coverImage, setCoverImage] = useState(null);

    const [coverPreview, setCoverPreview] = useState(
        initialData.coverImageUrl || initialData.thumbnailUrl || ""
    );

    const [removeCoverImage, setRemoveCoverImage] = useState(false);

    const [loadingCategories, setLoadingCategories] =
        useState(true);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        setTitle(initialData.title || "");
        setContent(initialData.content || "");
        setCoverPreview(initialData.coverImageUrl || initialData.thumbnailUrl || "");
        setRemoveCoverImage(false);
    }, [
        initialData.title,
        initialData.content,
        initialData.coverImageUrl,
        initialData.thumbnailUrl
    ]);

    useEffect(() => {
        if (!categories.length) {
            return;
        }

        const initialCategories = initialData.categories || [];

        setSelectedCategories(
            initialCategories
                .map((category) => {
                    if (typeof category === "string") {
                        return categories.find((item) => item.name === category);
                    }

                    return category;
                })
                .filter(Boolean)
        );
    }, [categories, initialData.categories]);

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
                coverImage,
                removeCoverImage,
            });

        } finally {
            setSubmitting(false);
        }
    }

    function handleCoverImageChange(event) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
        setRemoveCoverImage(false);
    }

    function clearCoverImage() {
        setCoverImage(null);
        setCoverPreview("");
        setRemoveCoverImage(true);
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

            {/* Cover Image */}
            <div>
                <label className="block text-sm text-gray-600 mb-2">
                    Cover image
                </label>

                {coverPreview && (
                    <div className="mb-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        <img
                            src={coverPreview}
                            alt="Post cover preview"
                            className="h-56 w-full object-cover"
                        />
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleCoverImageChange}
                        className="
                            block w-full text-sm text-gray-600
                            file:mr-4 file:rounded-lg file:border-0
                            file:bg-blue-50 file:px-4 file:py-2
                            file:text-sm file:font-medium file:text-blue-700
                            hover:file:bg-blue-100
                        "
                    />

                    {coverPreview && (
                        <button
                            type="button"
                            onClick={clearCoverImage}
                            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            Remove image
                        </button>
                    )}
                </div>

                <p className="mt-2 text-xs text-gray-500">
                    JPG, PNG, or WEBP. Max 5MB.
                </p>
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
