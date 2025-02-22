import axios from 'axios';
import { redirect } from 'next/navigation';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const AT =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${AT}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?._retry) {
      console.log('Token is expired, attempting to refresh...');
      prevRequest._retry = true;
      try {
        const refreshToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('refreshToken')
            : null;
        const userString =
          typeof window !== 'undefined' ? localStorage.getItem('user') : null;

        let userId;
        if (userString) {
          const user = JSON.parse(userString);
          userId = user.id;
        }

        if (!refreshToken || !userId) {
          throw new Error('Missing refresh token or user id');
        }

        const { data } = await api.post(`/auth/refresh`, {
          rt: refreshToken,
          userId: userId,
        });

        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);

        prevRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(prevRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
        redirect(`/`);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
