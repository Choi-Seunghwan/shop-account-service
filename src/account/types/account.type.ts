export type SignUpData = {
  loginId: string;
  email: string;
  password: string;
  identityVerificationId: string;
};

export enum AccountStatus {
  PENDING = 'PENDING',
  ACTIVATE = 'ACTIVATE',
  DELETED = 'DELETED',
}
