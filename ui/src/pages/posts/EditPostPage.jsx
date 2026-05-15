import { useEffect, useState } from "react";
import {getPostById, updatePost} from "../../services/postService";
import {useParams, useNavigate, Link} from "react-router-dom";
import PostForm from "../../components/posts/PostForm";

function EditPostPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [post, setPost] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPost();
    }, []);

    async function loadPost() {

        try {

            const data =
                await getPostById(id);

            setPost(data);

        } finally {

            setLoading(false);
        }
    }

    async function handleUpdate(data) {

        await updatePost(id, data);

        navigate(`/posts/${id}`);
    }

    if (loading) {

        return (
            <p className="
                p-6 text-gray-600 animate-pulse
            ">
                Loading post...
            </p>
        );
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
                    to={`/posts/${id}`}
                    className="
                        text-blue-600 font-medium
                        hover:underline mb-6 inline-block
                    "
                >
                    ← Back to Post
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
                        Edit Post
                    </h1>

                    <PostForm
                        initialData={post}
                        onSubmit={handleUpdate}
                        submitText="Save Changes"
                    />

                </div>
            </div>
        </div>
    );
}

export default EditPostPage;
