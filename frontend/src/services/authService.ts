// src/services/authService.ts
import api from "../utils/api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      createdAt: string;
    };
    token: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

class AuthService {
  // Login user
  async login(loginData: LoginData): Promise<AuthResponse> {
    const response = await api.post("/auth/login", loginData);

    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data;
  }

  // Register user
  async register(registerData: RegisterData): Promise<AuthResponse> {
    const response = await api.post("/auth/register", registerData);

    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data;
  }

  // Get user profile
  async getProfile(): Promise<{ success: boolean; data: User }> {
    const response = await api.get("/auth/profile");
    return response.data;
  }

  // Logout user
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return !!token;
  }

  // Get current user
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem("token");
  }
}

export default new AuthService();
