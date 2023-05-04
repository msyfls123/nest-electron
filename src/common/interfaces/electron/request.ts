import { WebContents } from 'electron';

export interface IRequest extends Request {
  webContents?: WebContents;
}
