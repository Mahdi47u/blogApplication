import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { isPostSaved, savePost, unsavePost } from "../../services/bookmarkService";

export default function BookmarkButton({ postId, onChange }) {
    const { user } = useContext(AuthContext);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user || !postId) {
            setSaved(false);
            return;
        }

        loadSavedState();
    }, [user, postId]);

    async function loadSavedState() {
        try {
            setSaved(await isPostSaved(postId));
        } catch (error) {
            console.error("Failed to load bookmark state:", error);
        }
    }

    async function toggleSaved(event) {
        event.preventDefault();
        event.stopPropagation();

        if (!user || loading) {
            return;
        }

        try {
            setLoading(true);

            if (saved) {
                await unsavePost(postId);
                setSaved(false);
                onChange?.(false);
            } else {
                await savePost(postId);
                setSaved(true);
                onChange?.(true);
            }
        } catch (error) {
            console.error("Failed to update bookmark:", error);
        } finally {
            setLoading(false);
        }
    }

    if (!user) {
        return (
            <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-slate-50 transition"
            >
                Save
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={toggleSaved}
            disabled={loading}
            className={`inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed
                ${
                saved
                    ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                    : "border-slate-200 bg-white text-gray-700 hover:bg-slate-50"
            }`}
        >
            {saved ? "Saved" : "Save"}
        </button>
    );
}
