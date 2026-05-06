const API_BASE = "http://localhost:8080";

async function apiRequest(path, method = "GET", body = null, auth = false) {
    const headers = {
        "Content-Type": "application/json"
    };

    if (auth) {
        const token = localStorage.getItem("token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    const config = {
        method,
        headers
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(API_BASE + path, config);

    // Automatically reject non-2xx responses
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Request failed");
    }

    return response.json();
}

async function login(username, password) {
    return apiRequest("/api/auth/login", "POST", { username, password });
}

async function registerUser(username, password, email) {
    return apiRequest("/api/auth/register", "POST", { username, password, email });
}

function logout() {
    fetch('/logout', {
        method: 'POST'
    }).then(() => {
        window.location.href = '/login.html';
    });
}