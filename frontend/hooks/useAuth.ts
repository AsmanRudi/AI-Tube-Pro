"use client";

import authService from "@/services/auth.service";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import { setTokenCookie, removeTokenCookie } from "@/lib/auth";

export function useAuth() {
  async function login(data: LoginRequest) {
    const result = await authService.login(data);

    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    setTokenCookie(result.token);
  }

  async function register(data: RegisterRequest) {
    const result = await authService.register(data);

    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    setTokenCookie(result.token);
  }

  function logout() {
    authService.logout();
    removeTokenCookie();
  }

  return {
    login,
    register,
    logout,
  };
}
