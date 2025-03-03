import api from '@/lib/axios';
import { SignInPayload, SignInResponse, SingUpResponse } from './interface';
import { userProfileValues } from '@/app/schema/user.schema';
import { signUpValues } from '@/app/schema/singup.schema';

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

  async signUp(payload: signUpValues): Promise<SingUpResponse> {
    const response = await api.post(`auth/signup`, payload);
    return response.data;
  },

  async signIn(action: SignInPayload) {
    try {
      const response = await api.post('/auth/signin', action);
      const data = response.data;
      console.log(data?.response?.message);
      return data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to login. Please try again';
      throw new Error(errorMessage);
    }
  },
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
