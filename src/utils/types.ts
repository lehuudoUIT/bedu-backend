export type AuthInput = { username: string; password: string };

export type SignInData = { userId: number; username: string };

export type AuthResult = {
  userId: number;
  username: string;
  accessToken: string;
};

export type LogParam = {
  requestId: string;
  context: string | object;
  metadata: object;
};
