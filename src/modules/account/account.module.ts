import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { VerificationModule } from 'src/modules/verification/verification.module';
import { AccountRepository } from './account.repository';
import { AuthorizationModule } from '../authorization/authorization.module';

@Module({
  imports: [VerificationModule, AuthorizationModule],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
})
export class AccountModule {}
