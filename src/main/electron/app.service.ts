import * as Electron from 'electron';
import { Subject } from 'rxjs';
import { API_SCHEMA, APP_SCHEMA } from '~/common/constants/meta';

import { Injectable } from '@nestjs/common';

import { LogService } from '../monitor/log.service';

@Injectable()
export class AppService {
  private shutdownListener$: Subject<void> = new Subject();

  public constructor(private logger: LogService) {
    this.logger.setContext(AppService.name);
    this.logger.debug('AppService Started');
    this.bindAppQuit();
    this.handleProtocol();
  }

  // Subscribe to the shutdown in your main.ts
  public subscribeToShutdown(shutdownFn: () => void): void {
    this.shutdownListener$.subscribe(() => shutdownFn());
  }

  public getElectron() {
    return Electron;
  }

  // Wait until app ready event
  public ready() {
    const { app } = this.getElectron();
    return app.whenReady();
  }

  public getPath(name: Parameters<Electron.App['getPath']>[0]) {
    const { app } = this.getElectron();
    return app.getPath(name);
  }

  // Emit the shutdown event
  private shutdown() {
    this.shutdownListener$.next();
  }

  private async handleProtocol() {
    const { protocol } = this.getElectron();
    protocol.registerSchemesAsPrivileged([
      {
        scheme: API_SCHEMA,
        privileges: {
          supportFetchAPI: true,
          stream: true,
        },
      },
      {
        scheme: APP_SCHEMA,
        privileges: {
          supportFetchAPI: true,
          stream: true,
        },
      },
    ]);
  }

  private bindAppQuit() {
    const { app } = this.getElectron();
    app.on('quit', () => this.shutdown());
  }
}
