const BASE_URL = "http://localhost:8080/api/auth";

export async function login(credentials) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        throw new Error("Invalid username or password");
    }

    return response.json();
}

export async function register(userData) {
    const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Registration failed");
    }

    return response.json();
}
