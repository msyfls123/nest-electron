export const SOCKET_SCHEMA = 'nest-electron';

export const DATABASE_NAME = 'nest-electron';
export const SESSION_PERSIST = 'persist:';

export enum HandlerType {
  InvokeMessage = 'invoke-message',
  Event = 'event',
  Subscription = 'subscription',
}
