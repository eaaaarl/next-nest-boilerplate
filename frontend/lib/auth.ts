import api from './axios';

export const authService = {
  async profile() {
    const response = await api.get(`/auth/me`);
    return response.data;
  },

  async login(payload: { username: string; password: string }) {
    const response = await api.post('/auth/signin', payload);
    return response.data;
  },

  async loginGithub() {
    const response = await api.get('/auth/github/login');
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
