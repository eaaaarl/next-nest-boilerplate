import api from './axios';

export const authService = {
  async profile() {
    const response = await api.get(`/auth/me`);
    return response.data;
  },

  async login(payload: { username: string; password: string }) {
    const response = await api.post('/auth/signin', payload);
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
