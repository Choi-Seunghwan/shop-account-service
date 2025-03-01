import { Body, Controller, Get, Post } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { AccountService } from './account.service';
import { AuthGuard } from '../authorization/authorization.guard';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.accountService.signUp(signUpDto);
  }

  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.accountService.signIn({ loginId: signInDto.loginId, password: signInDto.password });
  }

  @Get('/me')
  async me() {}
}
