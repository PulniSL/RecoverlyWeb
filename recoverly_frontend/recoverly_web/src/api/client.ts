import axios from "axios";

const baseURL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  timeout: 600000,
});