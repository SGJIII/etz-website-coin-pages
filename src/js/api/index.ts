import axios from "axios";

export const API = axios.create({
  baseURL: "https://api.landing.etzsoft.com/api",
});
