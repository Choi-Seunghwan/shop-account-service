import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountEntity, SignInData, SignUpData } from './types/account.type';
import { AccountStatus } from '@prisma/client';
import { VerificationService } from 'src/modules/verification/verification.service';
import { hashPassword } from 'src/utils/hashPassword';
import { sha256Hash } from 'src/utils/sha256hash';
import { comparePassword } from 'src/utils/comparePassword';
import { AccountRepository } from './account.repository';
import { AuthorizationService } from '@choi-seunghwan/authorization';
import { REFRESH_TOKEN_EXPIRATION_TIME, TOKEN_EXPIRATION_TIME } from './constants/account.constant';

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

  async signIn(data: SignInData): Promise<{ accessToken: string; refreshToken: string; account: AccountEntity }> {
    const account = await this.accountRepository.findAccount({
      where: {
        loginId: data.loginId,
        deletedAt: null,
      },
    });

    if (!account) throw new UnauthorizedException('Not found');

    const isValid = await comparePassword(data.password, account.encryptPassword);

    if (!isValid) throw new UnauthorizedException('Invalid password');

    const payload = {
      accountId: account.id,
      loginId: account.loginId,
      email: account.email,
    };

    const accessToken = await this.authorizationService.generateToken({
      ...payload,
      exp: TOKEN_EXPIRATION_TIME,
    });

    const refreshToken = await this.authorizationService.generateToken({
      ...payload,
      exp: REFRESH_TOKEN_EXPIRATION_TIME,
    });

    return {
      accessToken,
      refreshToken,
      account: { accountId: account.id, loginId: account.loginId, email: account.email, status: account.status },
    };
  }

  async refreshToken(oldRefreshToken: string) {
    const payload = await this.authorizationService.validateToken(oldRefreshToken);

    const accessToken = await this.authorizationService.generateToken({
      ...payload,
      exp: TOKEN_EXPIRATION_TIME,
    });

    const newRefreshToken = await this.authorizationService.generateToken({
      ...payload,
      exp: REFRESH_TOKEN_EXPIRATION_TIME,
    });

    return { accessToken, newRefreshToken };
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
