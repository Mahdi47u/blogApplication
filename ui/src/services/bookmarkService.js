import { apiFetch } from "../utils/api";

const BASE_URL = "http://localhost:8080/api/bookmarks";

export function savePost(postId) {
    return apiFetch(`${BASE_URL}/${postId}`, {
        method: "POST"
    });
}

export function unsavePost(postId) {
    return apiFetch(`${BASE_URL}/${postId}`, {
        method: "DELETE"
    });
}

export function isPostSaved(postId) {
    return apiFetch(`${BASE_URL}/${postId}/saved`);
}

export function getSavedPosts(page = 0, size = 20) {
    return apiFetch(`${BASE_URL}/me?page=${page}&size=${size}`);
}

export function getSavedPostCount() {
    return apiFetch(`${BASE_URL}/me/count`);
}
