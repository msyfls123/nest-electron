// https://github.com/electron/electron/pull/23972
export const API_SCHEMA = 'chrome-extension';
export const API_ORIGIN = `${API_SCHEMA}://electron.app`;
export const APP_SCHEMA = 'nest-electron';
export const APP_ORIGIN = `${APP_SCHEMA}://electron.app`;

export const DATABASE_NAME = 'nest-electron';
export const SESSION_PERSIST = 'persist:';

export const HEADER_WEBCONTENTS_ID = 'web-contents-id';

export enum HandlerType {
  InvokeMessage = 'invoke-message',
  Event = 'event',
  Subscription = 'subscription',
}
