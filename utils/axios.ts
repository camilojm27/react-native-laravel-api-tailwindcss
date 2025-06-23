import axiosLib from "axios";

const axios = axiosLib.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add debugging
console.log("Backend URL:", process.env.EXPO_PUBLIC_BACKEND_URL);

export default axios;
