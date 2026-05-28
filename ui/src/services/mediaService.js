const BASE_URL = "http://localhost:8080/api/media";

export async function uploadPostCover(postId, file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/posts/${postId}/cover`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to upload cover image");
    }

    return response.json();
}

export async function removePostCover(postId) {
    const response = await fetch(`${BASE_URL}/posts/${postId}/cover`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to remove cover image");
    }
}

export async function uploadProfileImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/users/me/profile-picture`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to upload profile image");
    }

    return response.json();
}

export async function removeProfileImage() {
    const response = await fetch(`${BASE_URL}/users/me/profile-picture`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to remove profile image");
    }
}
