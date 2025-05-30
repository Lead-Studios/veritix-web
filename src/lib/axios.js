import axios from 'axios';
import Cookies from 'js-cookie';
import { apiEndpoints } from './endpoints';
import { toast } from 'react-toastify';

const createAxiosInstance = (isAuthenticated = true) => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: isAuthenticated ? { 'Content-Type': 'application/json' } : {},
  });

  if (isAuthenticated) {
    instance.interceptors.request.use((config) => {
      const token = Cookies.get('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        const originalRequest = error.config;

        if (error?.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = Cookies.get('refresh_token');
            if (!refreshToken) throw new Error('No refresh token');

            const response = await axios.post(
              `${import.meta.env.VITE_BASE_URL}${apiEndpoints.refreshToken}`,
              {
                refresh_token: refreshToken,
              }
            );

            const { access_token } = response.data;
            Cookies.set('token', access_token, { path: '/' });
            originalRequest.headers.Authorization = `Bearer ${access_token}`;

            return instance(originalRequest);
          } catch (refreshError) {
            toast.dismiss()
            toast.error('Session expired. Please login again.');
            handleLogout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error?.response?.data ?? error?.message);
      }
    );
  } else {
    instance.interceptors.response.use(
      (response) => response.data,
      (error) => Promise.reject(error?.response?.data ?? error?.message)
    );
  }

  return instance;
};

export const unAuthenticatedApi = createAxiosInstance(false);
export default createAxiosInstance(true);

export const handleLogout = () => {
  Cookies.remove('token');
  Cookies.remove('refresh_token');
  window.location.href = '/';
};
