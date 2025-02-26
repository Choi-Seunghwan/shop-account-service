import { HttpException, Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AuthorizationService {
  constructor(private readonly jwtService: JwtService) {}

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new HttpException('TOKEN_EXPIRED', 401);
      else if (e instanceof JsonWebTokenError) throw new HttpException('REQUIRED_TOKEN', 401);
      else throw e;
    }
  }
}
