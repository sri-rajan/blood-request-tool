export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  role: "admin" | "user";
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}
