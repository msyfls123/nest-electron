export const SOCKET_SCHEMA = 'nest-electron';

export enum HandlerType {
  InvokeMessage = 'invoke-message',
  Event = 'event',
  Subscription = 'subscription',
}
