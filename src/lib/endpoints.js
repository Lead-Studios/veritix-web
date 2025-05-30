const BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiEndpoints = {
  login: `${BASE_URL}/auth/login`,
  register: `${BASE_URL}/users`,
  forgotPassword: `${BASE_URL}/auth/forgot-password`,
  resetPassword: `${BASE_URL}/auth/reset-password`,
  logout: `${BASE_URL}/auth/logout`,
  refreshToken: `${BASE_URL}/auth/refresh-token`,
};
