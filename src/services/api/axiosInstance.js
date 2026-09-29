import axios from 'axios';
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from './tokenStorage';

let onUnauthorizedCallback = null;

export const setOnUnauthorizedCallback = (cb) => {
  onUnauthorizedCallback = cb;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// Endpoints that should not trigger automatic 401 refresh retries
const AUTH_BYPASS_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/register-brokerage',
  '/api/auth/forgot-password',
  '/api/auth/verify-reset-code',
  '/api/auth/reset-password',
  '/api/auth/refresh-token',
  '/api/auth/me',
];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';

    // If request has no config or is in bypass list, reject directly
    const shouldBypassRefresh = AUTH_BYPASS_ENDPOINTS.some((endpoint) =>
      requestUrl.includes(endpoint)
    );

    if (shouldBypassRefresh) {
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        const newToken = response.data?.accessToken;

        if (!newToken) {
          throw new Error('No access token returned from refresh endpoint.');
        }

        setAccessToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearAccessToken();
        if (onUnauthorizedCallback) {
          onUnauthorizedCallback();
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;


