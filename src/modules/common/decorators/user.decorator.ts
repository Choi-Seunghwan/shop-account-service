import { JwtPayload } from '@choi-seunghwan/authorization';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const jwtPayload: JwtPayload = request.jwtPayload;

  return data ? jwtPayload?.[data] : jwtPayload;
});
