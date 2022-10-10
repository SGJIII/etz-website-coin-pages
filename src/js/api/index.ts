import axios from "axios";

export const API = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Security-Policy": "frame-ancestors 'none'",
    "X-Frame-Options": "DENY",
  },
});
