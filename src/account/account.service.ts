import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SignUpData } from './types/account.type';
// import { AccountStatus } from '@prisma/client';
import { VerificationService } from 'src/verification/verification.service';

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

    const verificationRes = await this.verificationService.identityVerification(
      data.identityVerificationId,
    );

    console.log('@@@ verificationRes', verificationRes);

    // await this.prisma.account.create({
    //   data: {
    //     loginId: data.loginId,
    //     email: data.email,
    //     encryptPassword: data.password,
    //     status: AccountStatus.ACTIVATE, // TODO email confirm. PENDING status
    //     user: {
    //       create: {
    //         name: data.name,
    //       },
    //     },
    //   },
    // });
  }

  async signIn() {}
}
