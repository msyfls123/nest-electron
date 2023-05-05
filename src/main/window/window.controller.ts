import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { IpcEvent, IpcInvoke } from '~/main/ipc/ipc.decorator';
import { Payload } from '@nestjs/microservices';
import { IpcMainInvokeEvent, WebContents } from 'electron';
import { resolve } from 'path';
import { AppService } from '~/main/electron/app.service';
import { Observable, interval, map } from 'rxjs';
import {
  Body,
  Get,
  Headers,
  Param,
  Post,
  Render,
  Sse,
} from '@nestjs/common/decorators';
import { MessageEvent } from '@nestjs/common/interfaces';
import { LogService } from '~/main/monitor/log.service';
import { DatabaseService } from '../database/database.service';
import { SessionService } from '../session/session.service';
import { WebContent } from '../electron/request.decorator';
import {
  HEADER_WEBCONTENTS_ID,
  API_ORIGIN,
  PAGE_ORIGIN,
} from '~/common/constants/meta';

class WebviewPayload {
  'select-partition': string;
}

@Controller('window')
export class WindowController {
  private database: PouchDB.Database;

  constructor(
    private appService: AppService,
    private logger: LogService,
    private session: SessionService,
    dbService: DatabaseService,
  ) {
    this.logger.setContext(WindowController.name);
    this.database = dbService.getDatabase('window');
  }

  @Get()
  @Render('main')
  public root() {
    return {
      origin: API_ORIGIN,
      msg: 'Hello World!',
    };
  }

  @IpcInvoke('getWindowSize')
  public async getWindowSize(@Payload('event') event: IpcMainInvokeEvent) {
    const { BrowserWindow } = this.appService.getElectron();
    const browserWindow = BrowserWindow.fromWebContents(event.sender);
    return browserWindow.getSize();
  }

  @IpcEvent('createWindow')
  public async createWindow() {
    await this.appService.ready();

    const { BrowserWindow, app } = this.appService.getElectron();

    const preloadPath = resolve(app.getAppPath(), '../renderer/preload.js');
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        preload: preloadPath,
      },
    });
    const url = `${PAGE_ORIGIN}/window/`;
    win.loadURL(url);
  }

  @Post('/webview')
  public async webview(@Body() payload: WebviewPayload) {
    const partition = payload['select-partition'];
    const session = await this.session.get(partition);

    if (!session) {
      throw new HttpException(
        `No session of ${partition} found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const { BrowserWindow } = this.appService.getElectron();
    const win = new BrowserWindow({
      width: 1000,
      height: 800,
      title: `Session: ${partition}`,
      webPreferences: {
        partition: session.partition,
      },
    });

    win.loadURL(session.homepage);
    return `Created BrowserWindow <strong>${win.id}</strong>`;
  }

  @Get('/all')
  public findAll() {
    return this.database.allDocs({
      include_docs: true,
    });
  }

  @Post('/:id')
  public async record(
    @Param('id') id: string,
    @Headers(HEADER_WEBCONTENTS_ID) webContentsId: number,
    @WebContent() webContents: WebContents,
  ) {
    this.logger.log(`Got message from webContents-${webContents?.id}`);
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
