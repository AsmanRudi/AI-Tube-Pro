import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register"];

function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

api.interceptors.request.use((config) => {
  // Skip auth header for public endpoints
  if (config.url && AUTH_ENDPOINTS.includes(config.url)) {
    return config;
  }

  // Prefer localStorage token, fall back to cookie (e.g. on direct navigation)
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || getTokenFromCookie()
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 responses globally: clear auth state and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";

        // Avoid redirect loop on the login page itself
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;