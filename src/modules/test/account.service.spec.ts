import { AccountRepository } from '../account/account.repository';
import { AccountService } from '../account/account.service';
import { VerificationService } from '../verification/verification.service';
import { AuthorizationService } from '@choi-seunghwan/authorization';
import { AccountStatus } from '@prisma/client';

jest.mock('src/utils/hashPassword', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed_password'),
}));

jest.mock('src/utils/comparePassword', () => ({
  comparePassword: jest.fn(),
}));

describe('AccountService', () => {
  let service: AccountService;
  let repo: jest.Mocked<AccountRepository>;
  let verify: jest.Mocked<VerificationService>;
  let auth: jest.Mocked<AuthorizationService>;

  beforeEach(() => {
    repo = {
      findAccount: jest.fn(),
      findUniqueAccount: jest.fn(),
      createAccount: jest.fn(),
    } as any;

    verify = {
      identityVerification: jest.fn(),
    } as any;

    auth = {
      generateToken: jest.fn(),
      validateToken: jest.fn(),
    } as any;

    service = new AccountService(repo, verify, auth);
  });

  describe('signUp', () => {
    const mockVerifiedCustomer = {
      id: 'verif-customer-1',
      name: '홍길동',
      birthDate: '1990-01-01',
      phoneNumber: '010-1234-5678',
      gender: 'MALE' as const,
      isForeigner: false,
      operator: 'KT' as const,
      ci: 'ci-value',
      di: 'di-value',
    };

    it('should create a new account', async () => {
      verify.identityVerification.mockResolvedValue({
        status: 'VERIFIED',
        id: 'verif-id-1',
        verifiedCustomer: mockVerifiedCustomer,
        channel: {
          type: 'MOBILE',
          pgProvider: 'portone',
          pgMerchantId: 'merchant-1',
        },
        customData: '',
        requestedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusChangedAt: new Date().toISOString(),
      });

      repo.findAccount.mockResolvedValue(null);
      repo.createAccount.mockResolvedValue({
        id: 1,
        userId: 1,
        loginId: 'testuser',
        email: 'test@example.com',
        encryptPassword: 'hashed_password',
        status: AccountStatus.ACTIVATE,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        // user: {
        //   id: 1,
        //   name: '홍길동',
        //   mobile: '010-1234-5678',
        //   birth: new Date('1990-01-01'),
        //   hashedCi: 'ci-hash',
        //   gender: 'MALE',
        //   isForeigner: false,
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        //   deletedAt: null,
        //   account: null,
        // },
        // socialAccount: null,
      });

      await expect(
        service.signUp({
          loginId: 'testuser',
          password: 'password1234',
          email: 'test@example.com',
          identityVerificationId: 'verif-id-1',
        }),
      ).resolves.not.toThrow();

      expect(repo.createAccount).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            loginId: 'testuser',
            email: 'test@example.com',
            encryptPassword: 'hashed_password',
            status: AccountStatus.ACTIVATE,
            user: expect.any(Object),
          }),
        }),
      );
    });

    it('should throw an error if identity verification fails', async () => {
      verify.identityVerification.mockResolvedValue({
        status: 'FAILED',
        id: 'verif-id-fail',
        verifiedCustomer: null, // No customer data on failure
        channel: undefined,
        customData: '',
        requestedAt: '',
        updatedAt: '',
        statusChangedAt: '',
      });

      await expect(
        service.signUp({
          loginId: 'invaliduser',
          password: 'pass1234',
          email: 'fail@example.com',
          identityVerificationId: 'verif-id-fail',
        }),
      ).rejects.toThrowError('Invalid identity verification');
    });
  });
});
