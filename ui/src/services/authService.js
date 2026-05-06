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
