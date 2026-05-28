export const emptyRichTextDocument = {
    type: "doc",
    content: [
        {
            type: "paragraph"
        }
    ]
};

export function parseRichTextDocument(value) {
    if (!value) {
        return emptyRichTextDocument;
    }

    if (typeof value === "object") {
        return value;
    }

    try {
        const parsed = JSON.parse(value);

        if (parsed?.type === "doc") {
            return parsed;
        }
    } catch {
        return {
            type: "doc",
            content: [
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: value
                        }
                    ]
                }
            ]
        };
    }

    return emptyRichTextDocument;
}

export function stringifyRichTextDocument(document) {
    return JSON.stringify(document || emptyRichTextDocument);
}

export function extractRichTextText(value) {
    const document = parseRichTextDocument(value);
    const parts = [];

    walkRichTextNode(document, parts);

    return parts.join(" ").replace(/\s+/g, " ").trim();
}

function walkRichTextNode(node, parts) {
    if (!node) {
        return;
    }

    if (node.type === "text" && node.text) {
        parts.push(node.text);
    }

    if (Array.isArray(node.content)) {
        node.content.forEach((child) => walkRichTextNode(child, parts));
    }
}
