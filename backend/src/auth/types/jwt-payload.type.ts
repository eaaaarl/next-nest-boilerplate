export interface JwtPayload {
  sub: string;
  username: string;
}

export interface JwtUserPayload {
  user: {
    sub: string;
    username: string;
  };
}
