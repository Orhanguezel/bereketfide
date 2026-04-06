import axiosLib from 'axios';
import { API_BASE_URL } from './utils';

const api = axiosLib.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor: locale header
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const locale = document.documentElement.lang || 'tr';
    config.headers['x-locale'] = locale;
    config.headers['accept-language'] = locale;
  }
  return config;
});

// Response interceptor: normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status as number | undefined;
    const message =
      err?.response?.data?.error?.message ||
      err?.response?.data?.message ||
      err?.message ||
      'Network error';
    const wrapped = new Error(String(message)) as Error & { status?: number };
    if (status != null) wrapped.status = status;
    return Promise.reject(wrapped);
  },
);

export default api;
