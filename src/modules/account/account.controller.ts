import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { AccountService } from './account.service';
import { SignInDto } from './dtos/sign-in.dto';

import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { AccountResponseDto } from './dtos/account-response.dto';
import { SignInResponseDto } from './dtos/sign-in-response.dto';
import { AuthGuard, JwtPayload, User } from '@choi-seunghwan/authorization';
import { REFRESH_TOKEN_EXPIRATION_TIME } from './constants/account.constant';
import { Request, Response } from 'express';
import { RefreshTokenResponseDto } from './dtos/refresh-token-response.dto';

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
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, account } = await this.accountService.signIn({
      loginId: signInDto.loginId,
      password: signInDto.password,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME,
    });

    return { accessToken, account };
  }

  @ApiOkResponse({ type: RefreshTokenResponseDto })
  @Post('/refresh-token')
  async refreshToken(@Req() req: Request) {
    console.log('@@', req.cookies);
    const refreshToken = req?.cookies?.refreshToken;

    if (!refreshToken) throw new UnauthorizedException('Refresh token not found');

    const { accessToken } = await this.accountService.refreshToken(refreshToken);

    return { accessToken };
  }

  @ApiOkResponse({ type: AccountResponseDto })
  @UseGuards(AuthGuard)
  @Get('/me')
  async getMe(@User() user: JwtPayload) {
    return await this.accountService.getMe(user.accountId);
  }
}
