import axios from "./axios";
import type { Profile } from "../types/user.types";

export const getProfile = async (): Promise<Profile> => {
  const res = await axios.get<Profile>("/profile");
  return res.data;
};
