import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { parseRichTextDocument } from "../../utils/richText";

export default function RichTextContent({ value }) {
    const editor = useEditor({
        editable: false,
        extensions: [
            StarterKit,
            LinkExtension.configure({
                openOnClick: true,
                defaultProtocol: "https"
            }),
            ImageExtension.configure({
                inline: false,
                allowBase64: false
            })
        ],
        content: parseRichTextDocument(value),
        editorProps: {
            attributes: {
                class: "rich-text rich-text-content outline-none"
            }
        }
    }, [value]);

    if (!editor) {
        return null;
    }

    return <EditorContent editor={editor} />;
}
