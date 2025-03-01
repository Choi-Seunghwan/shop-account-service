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

export enum AccountStatus {
  PENDING = 'PENDING',
  ACTIVATE = 'ACTIVATE',
  DELETED = 'DELETED',
}
