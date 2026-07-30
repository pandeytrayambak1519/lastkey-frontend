import axios from "axios";
import { appConfig } from "./appConfig"; // appConfig import kiya
import { tokenService } from "../services/tokenService";
import { ROUTES } from "../utils/routePaths";

// Direct appConfig.apiBaseUrl use kar rahe hain taaki clean URL mile
const API_BASE_URL = appConfig.apiBaseUrl;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,

  timeout: Number(
    import.meta.env.VITE_API_TIMEOUT || 20000
  ),

  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,

  timeout: Number(
    import.meta.env.VITE_API_TIMEOUT || 20000
  ),

  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let refreshPromise = null;

function redirectTo(path) {
  if (window.location.pathname !== path) {
    window.location.assign(path);
  }
}

async function refreshAccessToken() {
  const refreshToken = tokenService.getRefreshToken();

  if (!refreshToken) {
    throw new Error("Refresh token is unavailable.");
  }

  const response = await refreshClient.post("/auth/refresh-token", {
    refreshToken,
  });

  const newAccessToken = response.data?.accessToken;
  const newRefreshToken = response.data?.refreshToken || refreshToken;

  if (!newAccessToken) {
    throw new Error("Access token was not returned.");
  }

  tokenService.setTokens({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });

  return newAccessToken;
}

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = tokenService.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (import.meta.env.DEV) {
      try {
        console.debug("[axiosClient] Request:", {
          url: config.url,
          method: config.method,
          headers: Object.keys(config.headers || {}).filter(
            (k) => k !== "Authorization"
          ),
          hasAuthorization: Boolean(config.headers?.Authorization),
        });
      } catch (e) {
        // ignore
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || "";

    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/refresh-token");

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const accessToken = await refreshPromise;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        tokenService.clearTokens();
        redirectTo(ROUTES.UNAUTHORIZED);
        return Promise.reject(refreshError);
      }
    }

    if (status === 403 && !requestUrl.includes("/auth/")) {
      redirectTo(ROUTES.FORBIDDEN);
    }

    if (status >= 500 && import.meta.env.PROD) {
      console.error("Server request failed:", {
        method: originalRequest?.method,
        url: originalRequest?.url,
        status,
      });
    }

    if (import.meta.env.DEV) {
      try {
        console.debug("[axiosClient] Response error:", {
          url: originalRequest?.url,
          status,
          message: error.message,
        });
      } catch (e) {
        // ignore
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;