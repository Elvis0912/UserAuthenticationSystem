import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Central Session Retrieval Helper
export const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

// Add a request interceptor for JWT token injection
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for automatic logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 globally if it's NOT a login attempt
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      window.Swal.fire({
        title: 'Session Expired',
        text: 'Your session has ended. Please log in again.',
        icon: 'warning',
        confirmButtonColor: 'var(--secondary)',
        timer: 3000,
        timerProgressBar: true
      });
      logoutUser();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Central Logout Helper
export const logoutUser = () => {
  localStorage.clear();
  sessionStorage.clear();
  delete api.defaults.headers.common['Authorization'];
};

export default api;
