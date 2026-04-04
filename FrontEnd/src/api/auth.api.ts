import axios from "./axios";
import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
} from "../types/auth.types";

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await axios.post<LoginResponse>("/user/login", data);
  return res.data;
};

export const refreshApi = async (): Promise<RefreshResponse> => {
  const res = await axios.post<RefreshResponse>("/refresh");
  return res.data;
};

export const logoutApi = async (): Promise<void> => {
  // await axios.post("/logout");
  return;
};
