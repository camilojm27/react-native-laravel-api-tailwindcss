import axiosLib from "axios";
import { getToken } from "../services/TokenService";

const axios = axiosLib.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axios.interceptors.request.use(async (request) => {
  const token = await getToken();
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

// Add debugging
console.log("Backend URL:", process.env.EXPO_PUBLIC_BACKEND_URL);

export default axios;
