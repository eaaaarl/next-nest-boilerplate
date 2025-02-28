import useUserProfile from '@/features/auth/hooks/useUserProfile';
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
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
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
        const userStorage =
          typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        const User = JSON.parse(userStorage ?? '');

        if (!refreshToken) {
          throw new Error('Missing refresh token or user id');
        }

        const { data } = await api.post(`/auth/refresh`, {
          rt: refreshToken,
          userId: User?.id,
        });

        await updateSession({
          accessToken: data?.access_token,
          refreshToken: data?.refresh_token,
        });

        prevRequest.headers.Authorization = `Bearer ${data?.access_token}`;
        console.log('<------ Token is refresh ------>');
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

export const updateSession = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
};
