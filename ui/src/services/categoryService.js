import { apiFetch } from "../utils/api";

const BASE_URL = "http://localhost:8080/api/categories";

export async function getCategories() {
    return apiFetch(BASE_URL);
}

export async function getPostsByCategory(slug) {
    return await apiFetch(`${BASE_URL}/${slug}/posts`);
}

export async function getCategoryById(id) {
    return apiFetch(`${BASE_URL}/${id}`);
}

export async function createCategory(data) {
    return apiFetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateCategory(id, data) {
    return apiFetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteCategory(id) {
    return apiFetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });
}
