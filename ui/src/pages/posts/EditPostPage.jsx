import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PostForm from "../../components/posts/PostForm";
import { removePostCover, uploadPostCover } from "../../services/mediaService";
import { getPostById, updatePost } from "../../services/postService";

function EditPostPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPost();
    }, [id]);

    async function loadPost() {
        try {
            setPost(await getPostById(id));
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate(data) {
        const { coverImage, removeCoverImage, ...postData } = data;

        await updatePost(id, postData);

        if (removeCoverImage) {
            await removePostCover(id);
        }

        if (coverImage) {
            await uploadPostCover(id, coverImage);
        }

        navigate(`/posts/${id}`);
    }

    if (loading) {
        return <div className="h-96 animate-pulse rounded-lg bg-slate-100" />;
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <Link
                to={`/posts/${id}`}
                className="inline-flex text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
                Back to Post
            </Link>

            <section className="space-y-6">
                <div className="mb-6">
                    <p className="text-sm font-medium text-blue-600">Edit</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
                        Update post
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Refine the content, categories, and cover image.
                    </p>
                </div>

                <PostForm initialData={post} onSubmit={handleUpdate} submitText="Save Changes" />
            </section>
        </div>
    );
}

export default EditPostPage;
