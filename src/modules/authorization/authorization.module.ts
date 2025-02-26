import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthorizationService } from './authorization.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [AuthorizationService],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
