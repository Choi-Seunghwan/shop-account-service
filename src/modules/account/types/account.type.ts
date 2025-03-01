import { AccountStatus } from '@prisma/client';

export type SignUpData = {
  loginId: string;
  email: string;
  password: string;
  identityVerificationId: string;
};

export type SignInData = {
  loginId: string;
  password: string;
};

export type AccountEntity = {
  accountId: number;
  loginId: string;
  email: string;
  status: AccountStatus;
};
