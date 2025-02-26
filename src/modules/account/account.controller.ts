import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.accountService.signUp(signUpDto);
  }
}
