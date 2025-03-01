export type JwtPayload = {
  accountId: number;
  loginId: string;
  email: string;
  iat: number;
  exp: number;
};
