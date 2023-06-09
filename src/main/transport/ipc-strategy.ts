import { ipcMain } from 'electron';
import { HandlerType } from '~/common/constants/meta';

import {
  CustomTransportStrategy,
  MessageHandler,
  Server,
} from '@nestjs/microservices';

import { eventTransport, invokeTransport } from '../ipc/ipc-transport';

export class IpcStrategy extends Server implements CustomTransportStrategy {
  private handlerMap: Partial<Record<HandlerType, (pattern: string) => void>> =
    {
      [HandlerType.InvokeMessage]: this.bindIpcInvoke,
      [HandlerType.Event]: this.bindIpcEvent,
      [HandlerType.Subscription]: this.bindIpcSubscription,
    };

  bindIpcInvoke(pattern: string) {
    ipcMain.handle(pattern, (event, ...args) => {
      const handler: MessageHandler = this.messageHandlers.get(pattern);

      if (!handler) {
        return this.logger.warn(`No handlers for message ${pattern}`);
      }

      return invokeTransport(handler, {
        event,
        args,
        channel: pattern,
      });
    });
  }

  bindIpcEvent(pattern: string) {
    ipcMain.on(pattern, (event, ...args) => {
      const handler: MessageHandler = this.messageHandlers.get(pattern);

      if (!handler) {
        return this.logger.warn(`No handlers for message ${pattern}`);
      }

      eventTransport(handler, {
        event,
        args,
        channel: pattern,
      });
    });
  }

  bindIpcSubscription(pattern: string) {
    this.logger.error('Not implemented!');
  }

  listen(callback: () => void) {
    this.logger.debug('Start listening...');

    for (const [pattern, handler] of this.messageHandlers) {
      const handlerType: HandlerType = handler.extras.handlerType;
      this.logger.debug(`[${handlerType}] ${pattern}`);
      this.handlerMap[handlerType]?.call(this, pattern);
    }

    this.messageHandlers.get('createWindow')({});

    callback();
  }

  close() {
    this.messageHandlers.clear();
    this.logger.log('End listening...');
  }
}
