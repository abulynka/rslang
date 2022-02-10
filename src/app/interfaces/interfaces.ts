export interface Env {
  production: boolean;
}

export interface UserInfo {
  email: string;
  password: string;
}

export interface User extends UserInfo {
  name: string;
}

export interface Auth {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}
