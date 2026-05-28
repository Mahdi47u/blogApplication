const API_URL = "http://localhost:8080/api/posts";


// Helper for authorized requests
function getHeaders() {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}



export async function getAllPosts() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }

    return response.json();
}

export async function searchPosts(query) {
    const params = new URLSearchParams({ query });
    const response = await fetch(`${API_URL}/search?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Failed to search posts");
    }

    return response.json();
}


export async function createPost(post) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(post)
    });

    if (!response.ok) {
        throw new Error("Failed to create post");
    }

    return response.json();
}

export async function deletePost(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to delete post");
    }
}

export async function getPostById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Post not found");
    return response.json();
}

export async function getPostsByAuthor(authorId) {
    const response = await fetch(`${API_URL}/author/${authorId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch author posts");
    }

    return response.json();
}

export async function updatePost(id, post) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(post)
    });

    if (!response.ok) {
        throw new Error("Failed to update post");
    }

    return response.json();
}
