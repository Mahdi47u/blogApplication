import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import ImageExtension from "@tiptap/extension-image";
import { uploadEditorImage } from "../../services/mediaService";
import {
    parseRichTextDocument,
    stringifyRichTextDocument
} from "../../utils/richText";

const extensions = [
    StarterKit,
    LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https"
    }),
    ImageExtension.configure({
        inline: false,
        allowBase64: false
    }),
    Placeholder.configure({
        placeholder: "Write your post..."
    })
];

export default function RichTextEditor({ value, onChange }) {
    const fileInputRef = useRef(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageError, setImageError] = useState(null);

    const editor = useEditor({
        extensions,
        content: parseRichTextDocument(value),
        editorProps: {
            attributes: {
                class: "rich-text rich-text-editor min-h-[260px] px-4 py-3 outline-none"
            }
        },
        onUpdate({ editor }) {
            onChange(stringifyRichTextDocument(editor.getJSON()));
        }
    });

    useEffect(() => {
        if (!editor) {
            return;
        }

        const nextContent = stringifyRichTextDocument(parseRichTextDocument(value));
        const currentContent = stringifyRichTextDocument(editor.getJSON());

        if (nextContent !== currentContent) {
            editor.commands.setContent(parseRichTextDocument(value));
        }
    }, [editor, value]);

    if (!editor) {
        return null;
    }

    function setLink() {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl || "https://");

        if (url === null) {
            return;
        }

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }

    async function handleImageSelected(event) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) {
            return;
        }

        try {
            setUploadingImage(true);
            setImageError(null);

            const media = await uploadEditorImage(file);

            editor
                .chain()
                .focus()
                .setImage({
                    src: media.publicUrl,
                    alt: media.originalFileName || "Post image"
                })
                .run();
        } catch (error) {
            console.error("Failed to upload editor image:", error);
            setImageError(error.message || "Image could not be uploaded.");
        } finally {
            setUploadingImage(false);
        }
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-blue-500">
            <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-slate-50 p-2">
                <ToolbarButton
                    label="B"
                    active={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                />
                <ToolbarButton
                    label="I"
                    active={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                />
                <ToolbarButton
                    label="H2"
                    active={editor.isActive("heading", { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                />
                <ToolbarButton
                    label="H3"
                    active={editor.isActive("heading", { level: 3 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                />
                <ToolbarButton
                    label="List"
                    active={editor.isActive("bulletList")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                />
                <ToolbarButton
                    label="1."
                    active={editor.isActive("orderedList")}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                />
                <ToolbarButton
                    label="Quote"
                    active={editor.isActive("blockquote")}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                />
                <ToolbarButton
                    label="Code"
                    active={editor.isActive("codeBlock")}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                />
                <ToolbarButton
                    label="Link"
                    active={editor.isActive("link")}
                    onClick={setLink}
                />
                <ToolbarButton
                    label={uploadingImage ? "Uploading" : "Image"}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                />
                <ToolbarButton
                    label="Undo"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                />
                <ToolbarButton
                    label="Redo"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                />
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageSelected}
                className="hidden"
            />

            {imageError && (
                <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    {imageError}
                </div>
            )}

            <EditorContent editor={editor} />
        </div>
    );
}

function ToolbarButton({ label, active = false, disabled = false, onClick }) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40
                ${
                active
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
        >
            {label}
        </button>
    );
}
