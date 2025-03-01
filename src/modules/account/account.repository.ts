import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAccount(args: Prisma.AccountFindFirstArgs) {
    return await this.prismaService.account.findFirst(args);
  }

  async findUniqueAccount(args: Prisma.AccountFindUniqueArgs) {
    return await this.prismaService.account.findUnique({
      ...args,
    });
  }

  async createAccount(args: Prisma.AccountCreateArgs) {
    return await this.prismaService.account.create(args);
  }
}
