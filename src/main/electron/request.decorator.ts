import { IRequest } from '~/common/interfaces/electron/request';

import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const WebContent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      const request = ctx.switchToHttp().getRequest<IRequest>();
      return request.webContents;
    } else if (ctx.getType() === 'rpc') {
      return ctx.switchToRpc().getData().event.sender;
    }
  },
);
