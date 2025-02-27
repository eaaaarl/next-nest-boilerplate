export interface SignInPayload {
  username: string;
  password: string;
}

export interface SignInResponse {
  user: {
    id: string;
    email?: string;
    username?: string;
    name?: string;
    avatar?: string;
    providerId?: string;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}
