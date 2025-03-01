import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SignInData, SignUpData } from './types/account.type';
import { AccountStatus } from '@prisma/client';
import { VerificationService } from 'src/modules/verification/verification.service';
import { hashPassword } from 'src/utils/hashPassword';
import { sha256Hash } from 'src/utils/sha256hash';
import { comparePassword } from 'src/utils/comparePassword';
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly verificationService: VerificationService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async signUp(data: SignUpData) {
    const alreadyExists = await this.prisma.account.findFirst({
      where: {
        loginId: data.loginId,
        deletedAt: null,
      },
    });

    if (alreadyExists) throw new Error('Already exists');

    const verificationData = await this.verificationService.identityVerification(data.identityVerificationId);
    const customer = verificationData.verifiedCustomer;

    if (!customer) throw new Error('Invalid identity verification');

    console.log('verificationData: ', verificationData);

    await this.prisma.account.create({
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

  async signIn(data: SignInData): Promise<string> {
    const account = await this.prisma.account.findFirst({
      where: {
        loginId: data.loginId,
        deletedAt: null,
      },
      include: {
        user: true,
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

    return token;
  }
}
