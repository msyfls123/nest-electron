import { Controller } from '@nestjs/common';
import { IpcEvent, IpcInvoke } from '~/main/ipc/ipc.decorator';
import { Payload } from '@nestjs/microservices';
import { BrowserWindow, IpcMainInvokeEvent, app } from 'electron';
import { join } from 'path';
import { AppService } from '~/main/electron/app.service';
import { Observable, interval, map } from 'rxjs';
import { Get, Param, Post, Sse } from '@nestjs/common/decorators';
import { MessageEvent } from '@nestjs/common/interfaces';
import { LogService } from '~/main/monitor/log.service';
import { DatabaseService } from '../database/database.service';

@Controller('window')
export class WindowController {
  private database: PouchDB.Database;

  constructor(
    private appService: AppService,
    private logger: LogService,
    dbService: DatabaseService,
  ) {
    this.logger.setContext(WindowController.name);
    this.database = dbService.getDatabase('window');
  }

  @Get()
  public root() {
    return 'Hello World!';
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

  @Get('/all')
  public findAll() {
    return this.database.allDocs({
      include_docs: true,
    });
  }

  @Post('/:id')
  public async record(@Param('id') id: string) {
    const db = this.database;
    try {
      const doc = await db.get(id);
      return db.put({
        _id: id,
        _rev: doc._rev,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      this.logger.error(err);
      return db.put({
        _id: id,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    this.logger.log('Receive sse event...');
    return interval(3000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }
}
