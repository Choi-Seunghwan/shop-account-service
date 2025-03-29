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
import { CheckDuplicateCiDto } from './dtos/check-duplicate-ci.dto';

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
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME * 1000,
    });

    return { accessToken, account };
  }

  @Post('sign-out')
  @UseGuards(AuthGuard)
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }

  @ApiOkResponse({ type: RefreshTokenResponseDto })
  @Post('/refresh-token')
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const oldRefreshToken = req?.cookies?.refreshToken;

    if (!oldRefreshToken) throw new UnauthorizedException('Refresh token not found');

    const { accessToken, newRefreshToken } = await this.accountService.refreshToken(oldRefreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME * 1000,
    });

    return { accessToken };
  }
  @ApiOkResponse({ type: AccountResponseDto })
  @UseGuards(AuthGuard)
  @Get('/me')
  async getMe(@User() user: JwtPayload) {
    return await this.accountService.getMe(user.accountId);
  }

  // TODO 추후, 본인인증 정보 내려주는 로직으로 대체해도 됨
  @ApiOkResponse({ type: Boolean })
  @Post('/check-duplicate-ci')
  async checkDuplicateCI(@Body() dto: CheckDuplicateCiDto) {
    return await this.accountService.checkDuplicateCI(dto.identityVerificationId);
  }
}
