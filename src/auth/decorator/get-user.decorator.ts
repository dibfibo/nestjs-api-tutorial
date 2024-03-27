import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const GetUser = createParamDecorator(
  (data: Exclude<keyof User | undefined, 'hash'>, ctx: ExecutionContext) => {
    const req: Express.Request = ctx.switchToHttp().getRequest();

    return data ? req.user : req.user[data];
  },
);
