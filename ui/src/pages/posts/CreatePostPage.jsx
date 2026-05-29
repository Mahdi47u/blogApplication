import { Link, useNavigate } from "react-router-dom";
import PostForm from "../../components/posts/PostForm";
import { uploadPostCover } from "../../services/mediaService";
import { createPost } from "../../services/postService";

function CreatePostPage() {
    const navigate = useNavigate();

    async function handleCreate(data) {
        try {
            const { coverImage, removeCoverImage, ...postData } = data;
            const createdPost = await createPost(postData);

            if (coverImage) {
                await uploadPostCover(createdPost.id, coverImage);
            }

            navigate(`/posts/${createdPost.id}`);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <Link
                to="/"
                className="inline-flex text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
                Back to Home
            </Link>

            <section className="space-y-6">
                <div className="mb-6">
                    <p className="text-sm font-medium text-blue-600">Create</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
                        New post
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Write, categorize, and publish a post with a cover image.
                    </p>
                </div>

                <PostForm onSubmit={handleCreate} submitText="Publish Post" />
            </section>
        </div>
    );
}

export default CreatePostPage;
