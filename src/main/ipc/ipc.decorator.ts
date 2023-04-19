import { HandlerType } from '~/common/constants/meta';

import { applyDecorators } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

export const IpcInvoke = (channel: string) => {
  return applyDecorators(
    MessagePattern(channel, { handlerType: HandlerType.InvokeMessage }),
  );
};

export const IpcEvent = (channel: string) => {
  return applyDecorators(
    EventPattern(channel, { handlerType: HandlerType.Event }),
  );
};
