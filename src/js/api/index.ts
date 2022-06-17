import axios from "axios";
console.log(process.env.API_URL_PRODUCTION);
export const API = axios.create({
  baseURL: process.env.API_URL_PRODUCTION,
});
