import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { JwtPayload } from './types/authorization.type';
import { TOKEN_EXPIRES_IN } from './constants/authorization.constant';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
    const expiresIn = TOKEN_EXPIRES_IN;
    const issuedAt = Math.floor(Date.now() / 1000);
    const expirationTime = issuedAt + expiresIn;

    const fullPayload: JwtPayload = {
      ...payload,
      iat: issuedAt,
      exp: expirationTime,
    };

    const token = await this.jwtService.signAsync(fullPayload, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
      expiresIn: '1d',
    });

    return token;
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });

      return payload;
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new HttpException('TOKEN_EXPIRED', 401);
      else if (e instanceof JsonWebTokenError) throw new HttpException('REQUIRED_TOKEN', 401);
      else throw e;
    }
  }
}
