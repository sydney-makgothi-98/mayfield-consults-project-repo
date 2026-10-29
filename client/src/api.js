/* ==========================================================================
   API
   ==========================================================================
   Every call from the frontend to the backend goes through this file.
   ========================================================================== */

// Where the backend lives. On Vercel this comes from VITE_API_URL.
// On our own computer it falls back to the local server.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// The name we save the login token under in the browser
const TOKEN_KEY = "gorilla_pit_token";


/* ==========================================================================
   SAVING THE LOGIN TOKEN
   ==========================================================================
   localStorage keeps the token even after a page refresh, which is how
   people stay logged in.
   ========================================================================== */

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}


/* ==========================================================================
   SENDING REQUESTS
   ========================================================================== */

async function request(path, method = "GET", body = null) {

    const headers = { "Content-Type": "application/json" };

    // If we're logged in, send the token so the server knows who we are
    const token = getToken();

    if (token) {
        headers.Authorization = "Bearer " + token;
    }

    const response = await fetch(API_URL + path, {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();

    // The server sends { error: "..." } when something goes wrong
    if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
    }

    return data;
}


/* ==========================================================================
   THE CALLS THE APP USES
   ========================================================================== */

export function getPrograms() {
    return request("/api/programs");
}

export function signup(name, email, password) {
    return request("/api/auth/signup", "POST", { name, email, password });
}

export function login(email, password) {
    return request("/api/auth/login", "POST", { email, password });
}

export function getMe() {
    return request("/api/auth/me");
}

export function logout() {
    return request("/api/auth/logout", "POST");
}

export function getPlans() {
    return request("/api/plans");
}

// Only the plan's id is sent. The server looks up the real price itself.
export function startCheckout(planId) {
    return request("/api/orders/checkout", "POST", { planId });
}

export function getOrder(orderId) {
    return request("/api/orders/" + orderId);
}


/* ==========================================================================
   SHOWING PRICES
   ==========================================================================
   Prices are saved in cents, so 45000 shows as "R450".
   ========================================================================== */

export function formatPrice(cents) {
    return "R" + (cents / 100).toLocaleString("en-ZA");
}
