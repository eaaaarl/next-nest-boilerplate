export class AuthDto {
  username: string;
  password: string;
}

export class SignUpAuthDto {
  username: string;
  name: string;
  email: string;
  password: string;
}

export class UserProfileDto {
  email: string;
  name: string;
  username: string;
}
