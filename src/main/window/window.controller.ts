import { Controller, Inject } from '@nestjs/common';
import { IpcEvent, IpcInvoke } from '../ipc/ipc.decorator';
import { Payload } from '@nestjs/microservices';
import { BrowserWindow, IpcMainInvokeEvent, app } from 'electron';
import { join } from 'path';
import { AppService } from '../electron/app.service';
import { ProviderKey } from 'src/common/constants/provider';

@Controller('window')
export class WindowController {
  constructor(@Inject(ProviderKey.APP) private appService: AppService) {}

  @IpcInvoke('getWindowSize')
  public async getWindowSize(@Payload('event') event: IpcMainInvokeEvent) {
    const browserWindow = BrowserWindow.fromWebContents(event.sender);
    return browserWindow.getSize();
  }

  @IpcEvent('createWindow')
  public async createWindow() {
    await this.appService.ready();

    const win = new BrowserWindow({
      width: 1000,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        sandbox: false,
      },
    });
    const url = `file://${join(app.getAppPath(), '../renderer/main.html')}`;
    win.loadURL(url);
  }
}
