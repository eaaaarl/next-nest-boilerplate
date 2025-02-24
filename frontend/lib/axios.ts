import axios from 'axios';
import { redirect } from 'next/navigation';
import { Session } from './session';
import { encodeBase64 } from '@oslojs/encoding';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = Session.getSession('accessToken');

    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
        const refreshToken = Session.getSession('refreshToken');
        const user = Session.getUser();
        const userId = user?.user?.id;
        console.log('refreshToken', refreshToken);
        console.log('user', userId);
        if (!refreshToken || !userId) {
          throw new Error('Missing refresh token or user id');
        }

        const { data } = await api.post(`/auth/refresh`, {
          rt: refreshToken,
          userId: userId,
        });

        // localStorage.setItem('accessToken', data.access_token);
        // localStorage.setItem('refreshToken', data.refresh_token);

        console.log('new accessToken', data?.access_token);
        console.log('new refreshToken', data?.refresh_token);

        await updateSession({
          accessToken: data?.access_token,
          refreshToken: data?.refresh_token,
        });

        prevRequest.headers.Authorization = `Bearer ${data?.access_token}`;
        console.log('token is refresh');
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
  const at = encodeBase64(new TextEncoder().encode(accessToken));
  const rt = encodeBase64(new TextEncoder().encode(refreshToken));

  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', at);
    localStorage.setItem('refreshToken', rt);
  }
};
