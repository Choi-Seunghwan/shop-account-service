import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/modules/authorization/types/authorization.type';

export const User = createParamDecorator((data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const jwtPayload: JwtPayload = request.jwtPayload;

  return data ? jwtPayload?.[data] : jwtPayload;
});
