import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

/**
 * CHANGE THIS to your backend URL
 * Example:
 *  - http://192.168.1.10:4000/api/v1
 *  - https://api.yourdomain.com/api/v1
 */
const BASE_URL = "http://192.168.1.10:4000/api/v1";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * - Attaches backend JWT token automatically
 */
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 * - Handles token expiration
 * - Forces logout on 401
 */
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    console.log("Response Error Status:", status);
    console.log(error?.response);
    if (status === 401) {
      // Token expired / invalid
      await AsyncStorage.removeItem("token");

      // OPTIONAL:
      // You can emit an event or navigate to auth screen here
      console.log("⚠️ Unauthorized - logging out");
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
