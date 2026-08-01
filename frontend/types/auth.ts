export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  plan: "FREE" | "BASIC" | "PRO" | "ENTERPRISE";
  credits: number;
  status: "ACTIVE" | "SUSPENDED";
  expireAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

