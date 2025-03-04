import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { VerificationModule } from 'src/modules/verification/verification.module';
import { AccountRepository } from './account.repository';

@Module({
  imports: [VerificationModule],
  controllers: [AccountController],
  providers: [
    AccountService,
    AccountRepository,
    // {
    //   provide: AuthorizationService,
    //   useFactory: (jwtService: JwtService) => new AuthorizationService(jwtService),
    //   inject: [JwtService],
    // },
  ],
  exports: [AccountService],
})
export class AccountModule {}
