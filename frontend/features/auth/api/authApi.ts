import api from '@/lib/axios';
import { SignInPayload } from './interface';

export const authApi = {
  async profile() {
    const response = await api.get(`auth/me`);
    return response.data;
  },

  async signIn(action: SignInPayload) {
    const response = await api.post('/auth/signin', action);
    const data = await response.data;
    if (data?.response?.statusCode === 403) {
      throw new Error(
        data?.response?.message || 'Failed to login, Please try again'
      );
    }
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
