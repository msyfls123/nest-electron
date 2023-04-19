import { Controller } from '@nestjs/common';
import { IpcEvent, IpcInvoke } from '../ipc/ipc.decorator';
import { Payload } from '@nestjs/microservices';
import { BrowserWindow, IpcMainInvokeEvent, app } from 'electron';
import { join } from 'path';
import { AppService } from '../electron/app.service';
import { Observable, interval, map } from 'rxjs';
import { Sse } from '@nestjs/common/decorators';
import { MessageEvent } from '@nestjs/common/interfaces';
import { LogService } from '../monitor/log.service';

@Controller('window')
export class WindowController {
  constructor(private appService: AppService, private logger: LogService) {
    this.logger.setContext(WindowController.name);
  }

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

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    this.logger.log('Receive sse event');
    return interval(3000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }
}
