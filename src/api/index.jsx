import axios from "axios";

const api = axios.create({
  baseURL: "https://azambg.vercel.app/api",
});
export default api;
