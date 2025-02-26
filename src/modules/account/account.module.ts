import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { VerificationModule } from 'src/modules/verification/verification.module';

@Module({
  imports: [VerificationModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
