import axios from "axios";
import { API_BASE } from "../config";

const apiClient = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;