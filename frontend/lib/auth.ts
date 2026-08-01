export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  removeTokenCookie();
}

// Cookie helpers for Next.js middleware compatibility
export function setTokenCookie(token: string) {
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function removeTokenCookie() {
  document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
}
