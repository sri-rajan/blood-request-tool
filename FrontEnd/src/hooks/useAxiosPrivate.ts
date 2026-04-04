import { useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export const useAxiosPrivate = () => {
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"] && auth?.accessToken) {
          config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config;

        if (error.response?.status === 401 && !prevRequest._retry) {
          prevRequest._retry = true;

          const res = await axios.post(
            "/refresh",
            {},
            { withCredentials: true },
          );

          setAuth((prev: any) => ({
            ...prev,
            accessToken: res.data.accessToken,
          }));

          prevRequest.headers["Authorization"] =
            `Bearer ${res.data.accessToken}`;

          return axios(prevRequest);
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [auth, setAuth]);

  return axios;
};
