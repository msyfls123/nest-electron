import { IpcMainEvent, IpcMainInvokeEvent } from 'electron';

import { MessageHandler } from '@nestjs/microservices';

export interface Transport<T = any, R = any> {
  (handler: MessageHandler, payload: T): Promise<R> | void;
}

export interface IpcInvokePayload<T = any[]> {
  event: IpcMainInvokeEvent;
  args: T;
  channel: string;
}

export interface IpcEventPayload<T = any[]> {
  event: IpcMainEvent;
  args: T;
  channel: string;
}
