import { API_URL } from "@/config";
import { type AuthProvider } from "@refinedev/core";
import axios from "axios";


export const authProvider: AuthProvider = {
  check: async () => {
    const token = localStorage.getItem("access_token");

    return { authenticated: Boolean(token) };
  },
  login: async ({ email, password }) => {
    const {
      data: { data },
    } = await axios.post(`${API_URL}/auth/login`, { email, password });
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("refresh_token", data.refreshToken);
    return data;
  },
  register: async ({ username, email, password }) => {
    const { data } = await axios.post(`${API_URL}/auth/register`, { username, email, password });
    localStorage.setItem("access_token", data.accessToken);
    return data;
  },
  logout: async () => {
    localStorage.removeItem("access_token");
    return { success: true };
  },
  onError: async error => {
    if (error?.status === 401) {
      return {
        logout: true,
        error: {
          message: "Unauthorized",
          name: "Error",
          statusCode: error?.status ?? 403,
        },
      };
    }
    return {};
  },
};
