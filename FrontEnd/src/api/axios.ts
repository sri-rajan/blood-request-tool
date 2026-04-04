import axios from "axios";
import { envConfig } from "../config/env-config";
export default axios.create({
  baseURL: envConfig.API_URL,
  withCredentials: true,
});
