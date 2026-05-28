import { apiFetch } from "../utils/api";

const BASE_URL = "http://localhost:8080/api/users";

export async function getPublicProfile(userId) {
    return apiFetch(`${BASE_URL}/${userId}/profile`);
}
