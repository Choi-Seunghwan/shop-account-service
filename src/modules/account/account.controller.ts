import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { AccountService } from './account.service';
import { SignInDto } from './dtos/sign-in.dto';

import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { AccountResponseDto } from './dtos/account-response.dto';
import { SignInResponseDto } from './dtos/sign-in-response.dto';
import { AuthGuard, JwtPayload, User } from '@choi-seunghwan/authorization';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOkResponse({ type: Boolean })
  @ApiBadRequestResponse()
  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.accountService.signUp(signUpDto);
    return true;
  }

  @ApiOkResponse({ type: SignInResponseDto })
  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.accountService.signIn({ loginId: signInDto.loginId, password: signInDto.password });
  }

  @ApiOkResponse({ type: AccountResponseDto })
  @UseGuards(AuthGuard)
  @Get('/me')
  async getMe(@User() user: JwtPayload) {
    return await this.accountService.getMe(user.accountId);
  }
}
