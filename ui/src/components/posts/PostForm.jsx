import { useEffect, useMemo, useState } from "react";
import CategoryMultiSelect from "../categories/CategoryMultiSelect";
import { getCategories } from "../../services/categoryService";
import RichTextEditor from "../editor/RichTextEditor";
import { emptyRichTextDocument, extractRichTextText, stringifyRichTextDocument } from "../../utils/richText";
import Button from "../ui/Button.jsx";
import SectionCard from "../ui/SectionCard.jsx";

const emptyContent = stringifyRichTextDocument(emptyRichTextDocument);

function PostForm({ initialData = {}, onSubmit, submitText = "Save Post" }) {
    const [title, setTitle] = useState(initialData.title || "");
    const [content, setContent] = useState(initialData.content || emptyContent);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(initialData.coverImageUrl || initialData.thumbnailUrl || "");
    const [removeCoverImage, setRemoveCoverImage] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        setTitle(initialData.title || "");
        setContent(initialData.content || emptyContent);
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

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setSubmitting(true);
            setErrors({});

            await onSubmit({
                title,
                content: content || emptyContent,
                categoryIds: selectedCategories.map((category) => category.id),
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

        const fileError = validateCoverImage(file);

        if (fileError) {
            setErrors((current) => ({ ...current, coverImage: fileError }));
            return;
        }

        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
        setRemoveCoverImage(false);
        setErrors((current) => ({ ...current, coverImage: null }));
    }

    function clearCoverImage() {
        setCoverImage(null);
        setCoverPreview("");
        setRemoveCoverImage(true);
    }

    function validateForm() {
        const nextErrors = {};

        if (!title.trim()) {
            nextErrors.title = "Title is required.";
        }

        if (title.trim().length > 150) {
            nextErrors.title = "Title cannot exceed 150 characters.";
        }

        if (!extractRichTextText(content).trim()) {
            nextErrors.content = "Content is required.";
        }

        if (selectedCategories.length === 0) {
            nextErrors.categories = "Select at least one category.";
        }

        return nextErrors;
    }

    function validateCoverImage(file) {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            return "Only JPG, PNG, and WEBP images are allowed.";
        }

        if (file.size > 10 * 1024 * 1024) {
            return "Cover image must be less than 10MB.";
        }

        return null;
    }

    const plainText = extractRichTextText(content);
    const checklist = useMemo(() => ([
        { label: "Title", complete: Boolean(title.trim()) },
        { label: "Content", complete: Boolean(plainText.trim()) },
        { label: "Category", complete: selectedCategories.length > 0 },
        { label: "Cover", complete: Boolean(coverPreview), optional: true },
    ]), [title, plainText, selectedCategories.length, coverPreview]);
    const readyToPublish = checklist.filter((item) => !item.optional).every((item) => item.complete);

    return (
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
                <SectionCard title="Post basics" description="Give the post a clear title and topic.">
                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="form-input"
                                placeholder="Enter post title"
                                required
                            />
                            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                                <span>{errors.title ? <FieldError inline>{errors.title}</FieldError> : "Keep it specific and easy to scan."}</span>
                                <span>{title.trim().length}/150</span>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Categories
                            </label>
                            {loadingCategories ? (
                                <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                            ) : (
                                <CategoryMultiSelect
                                    categories={categories}
                                    selectedCategories={selectedCategories}
                                    onChange={setSelectedCategories}
                                />
                            )}
                            {errors.categories && <FieldError>{errors.categories}</FieldError>}
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Content" description="Write the body of the post. You can switch to preview from the editor toolbar.">
                    <RichTextEditor value={content} onChange={setContent} />
                    {errors.content && <FieldError>{errors.content}</FieldError>}
                </SectionCard>

                <SectionCard title="Cover image" description="This image appears in feeds and on the post page.">
                    {coverPreview && (
                        <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                            <img
                                src={coverPreview}
                                alt="Post cover preview"
                                className="h-56 w-full object-cover sm:h-64"
                            />
                        </div>
                    )}

                    <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handleCoverImageChange}
                            className="
                                block w-full text-sm text-slate-600
                                file:mr-4 file:rounded-lg file:border-0
                                file:bg-blue-50 file:px-4 file:py-2
                                file:text-sm file:font-medium file:text-blue-700
                                hover:file:bg-blue-100
                            "
                        />

                        {coverPreview && (
                            <Button type="button" onClick={clearCoverImage} variant="danger" className="w-full sm:w-auto">
                                Remove image
                            </Button>
                        )}
                    </div>

                    {errors.coverImage && <FieldError>{errors.coverImage}</FieldError>}

                    <p className="mt-2 text-xs text-slate-500">
                        {coverImage
                            ? `${coverImage.name} is ready. It will upload after the post is saved.`
                            : "JPG, PNG, or WEBP. Max 10MB. Images are compressed after upload."}
                    </p>
                    {submitting && coverImage && (
                        <p className="mt-1 text-xs text-blue-600">
                            Saving post first, then uploading cover image.
                        </p>
                    )}
                </SectionCard>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-blue-600">Draft status</p>
                    <h2 className="mt-2 text-lg font-semibold text-slate-950">
                        {readyToPublish ? "Ready to publish" : "Needs attention"}
                    </h2>
                    <ul className="mt-4 space-y-3">
                        {checklist.map((item) => (
                            <li key={item.label} className="flex items-center justify-between gap-3 text-sm">
                                <span className="text-slate-700">{item.label}</span>
                                <span className={item.complete ? "font-medium text-emerald-600" : "text-slate-400"}>
                                    {item.complete ? "Done" : item.optional ? "Optional" : "Missing"}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <Button type="submit" disabled={submitting} size="lg" className="mt-5 w-full">
                        {submitting ? "Saving..." : submitText}
                    </Button>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-medium text-slate-700">Live summary</p>
                    <h3 className="mt-3 line-clamp-2 text-base font-semibold text-slate-950">
                        {title || "Untitled post"}
                    </h3>
                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
                        {plainText || "Your post summary will appear here as you write."}
                    </p>
                    {selectedCategories.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {selectedCategories.map((category) => (
                                <span key={category.id} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                    #{category.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </aside>
        </form>
    );
}

function FieldError({ children, inline = false }) {
    if (inline) {
        return <span className="text-red-600">{children}</span>;
    }

    return <p className="mt-2 text-sm text-red-600">{children}</p>;
}

export default PostForm;
