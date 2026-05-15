import { createPost } from "../../services/postService";

import { useNavigate, Link } from "react-router-dom";

import PostForm from "../../components/posts/PostForm";

function CreatePostPage() {

    const navigate = useNavigate();

    async function handleCreate(data) {
        try {
            await createPost(data);

            navigate("/");

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="
            min-h-screen
            bg-gradient-to-br
            from-slate-50 via-blue-50 to-indigo-100
            px-4 py-10
        ">

            <div className="max-w-3xl mx-auto animate-fadeIn">

                <Link
                    to="/"
                    className="
                        text-blue-600 font-medium
                        hover:underline mb-6 inline-block
                    "
                >
                    ← Back to Home
                </Link>

                <div className="
                    bg-white/60 backdrop-blur-xl
                    border border-white/40
                    shadow-xl rounded-3xl p-8
                ">

                    <h1 className="
                        text-3xl font-bold
                        text-gray-900 mb-6
                    ">
                        Create New Post
                    </h1>

                    <PostForm
                        onSubmit={handleCreate}
                        submitText="Publish Post"
                    />

                </div>
            </div>
        </div>
    );
}

export default CreatePostPage;
