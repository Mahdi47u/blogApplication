import { apiFetch } from "../utils/api";

const BASE_URL = "http://localhost:8080/api";

// COMMENTS
export function getPostComments(postId, page = 0, size = 10) {
    return apiFetch(
        `${BASE_URL}/comments/post/${postId}?page=${page}&size=${size}`
    );
}

export function getReplies(commentId, page = 0, size = 5) {
    return apiFetch(
        `${BASE_URL}/comments/${commentId}/replies?page=${page}&size=${size}`
    );
}

export function createComment({ postId, text, parentId = null }) {
    return apiFetch(`${BASE_URL}/comments`, {
        method: "POST",
        body: JSON.stringify({ postId, text, parentId })
    });
}

export function updateComment(commentId, text) {
    return apiFetch(`${BASE_URL}/comments/${commentId}`, {
        method: "PUT",
        body: JSON.stringify({ text })
    });
}

export function deleteComment(commentId) {
    return apiFetch(`${BASE_URL}/comments/${commentId}`, {
        method: "DELETE"
    });
}

// LIKES
export function likeComment(commentId) {
    return apiFetch(`${BASE_URL}/comment-likes/${commentId}`, {
        method: "POST"
    });
}

export function unlikeComment(commentId) {
    return apiFetch(`${BASE_URL}/comment-likes/${commentId}`, {
        method: "DELETE"
    });
}

export function isCommentLiked(commentId) {
    return apiFetch(`${BASE_URL}/comment-likes/${commentId}/liked`);
}

export function getCommentLikeCount(commentId) {
    return apiFetch(`${BASE_URL}/comment-likes/${commentId}/count`);
}
