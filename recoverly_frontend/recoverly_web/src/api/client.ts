import axios from "axios";

const baseURL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  timeout: 600000,
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}