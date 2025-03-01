import api from '@/lib/axios';
import { SignInPayload } from './interface';
import { userProfileValues } from '@/app/schema/user.schema';

export const authApi = {
  async profile() {
    const response = await api.get(`auth/me`);
    return response.data;
  },

  async updateProfile(payload: userProfileValues, id: string) {
    const response = await api.put(`auth/update/${id}/profile`, {
      name: payload.name,
      username: payload.username,
      email: payload.email,
    });
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
