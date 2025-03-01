import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountEntity, SignInData, SignUpData } from './types/account.type';
import { AccountStatus } from '@prisma/client';
import { VerificationService } from 'src/modules/verification/verification.service';
import { hashPassword } from 'src/utils/hashPassword';
import { sha256Hash } from 'src/utils/sha256hash';
import { comparePassword } from 'src/utils/comparePassword';
import { AuthorizationService } from '../authorization/authorization.service';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly verificationService: VerificationService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async signUp(data: SignUpData) {
    const verificationData = await this.verificationService.identityVerification(data.identityVerificationId);
    const customer = verificationData.verifiedCustomer;

    if (!customer) throw new BadRequestException('Invalid identity verification');

    const alreadyExists = await this.accountRepository.findAccount({
      where: {
        OR: [{ loginId: data.loginId }, { user: { hashedCi: sha256Hash(customer.ci) } }],
        deletedAt: null,
      },
    });

    if (alreadyExists) throw new BadRequestException('Already exists');

    await this.accountRepository.createAccount({
      data: {
        loginId: data.loginId,
        email: data.email,
        encryptPassword: await hashPassword(data.password),
        status: AccountStatus.ACTIVATE, // TODO email confirm. PENDING status
        user: {
          create: {
            name: customer.name,
            mobile: customer.phoneNumber,
            gender: customer.gender,
            hashedCi: sha256Hash(customer.ci),
            birth: new Date(customer.birthDate),
          },
        },
      },
    });
  }

  async signIn(data: SignInData): Promise<{ accessToken: string; account: AccountEntity }> {
    const account = await this.accountRepository.findAccount({
      where: {
        loginId: data.loginId,
        deletedAt: null,
      },
    });

    if (!account) throw new Error('Not found');

    const isValid = await comparePassword(data.password, account.encryptPassword);

    if (!isValid) throw new Error('Invalid password');

    const token = await this.authorizationService.generateToken({
      accountId: account.id,
      loginId: account.loginId,
      email: account.email,
    });

    return {
      accessToken: token,
      account: { accountId: account.id, loginId: account.loginId, email: account.email, status: account.status },
    };
  }

  async getMe(accountId: number): Promise<AccountEntity> {
    const account = await this.accountRepository.findUniqueAccount({
      where: {
        id: accountId,
        deletedAt: null,
      },
    });

    return { accountId: account.id, loginId: account.loginId, email: account.email, status: account.status };
  }
}
