import api from "@/lib/axios";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/types/auth";

class AuthService {
  async login(data: LoginRequest) {
    const res = await api.post<AuthResponse>(
      "/auth/login",
      data
    );

    return res.data;
  }

  async register(data: RegisterRequest) {
    const res = await api.post<AuthResponse>(
      "/auth/register",
      data
    );

    return res.data;
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getUser() {
    const user = localStorage.getItem("user");

    if (!user) return null;

    return JSON.parse(user);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }
}

export default new AuthService();