import { API_URL } from "@/config";
import axios from "axios";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(config => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
