import axios from "axios";

/**
 * IMPORTANT:
 * Replace this IP with your laptop's IP address
 * Must be reachable from phone.
 */
export const api = axios.create({
  baseURL: "http://192.168.10.239:8003/api",
  timeout: 600000,
});