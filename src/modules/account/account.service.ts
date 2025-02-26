import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SignUpData } from './types/account.type';
import { AccountStatus } from '@prisma/client';
import { VerificationService } from 'src/modules/verification/verification.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly verificationService: VerificationService,
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

    console.log('@@@ verificationData', verificationData);

    await this.prisma.account.create({
      data: {
        loginId: data.loginId,
        email: data.email,
        encryptPassword: data.password,
        status: AccountStatus.ACTIVATE, // TODO email confirm. PENDING status
        user: {
          create: {
            name: customer.name,
            mobile: customer.phoneNumber,
            // birth: new Date(customer.birthDate),
          },
        },
      },
    });
  }

  async signIn() {}
}
