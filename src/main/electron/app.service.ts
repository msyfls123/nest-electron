import { Readable } from 'stream';

import { App, app, protocol } from 'electron';
import nodeFetch from 'node-fetch-unix';
import { Subject } from 'rxjs';
import { SOCKET_SCHEMA } from '~/common/constants/meta';
import { getSocketUrl } from '~/common/utils/socket';

import { Injectable } from '@nestjs/common';

import { LogService } from '../monitor/log.service';

@Injectable()
export class AppService {
  private shutdownListener$: Subject<void> = new Subject();

  public constructor(private logger: LogService) {
    this.logger.setContext(AppService.name);
    this.logger.debug('AppService Started');
    app.on('quit', () => this.shutdown());
    this.handleProtocol();
  }

  // Subscribe to the shutdown in your main.ts
  public subscribeToShutdown(shutdownFn: () => void): void {
    this.shutdownListener$.subscribe(() => shutdownFn());
  }

  // Emit the shutdown event
  shutdown() {
    this.shutdownListener$.next();
  }

  // Wait until app ready event
  ready() {
    return app.whenReady();
  }

  getPath(name: Parameters<App['getPath']>[0]) {
    return app.getPath(name);
  }

  private async handleProtocol() {
    await this.ready();

    if (protocol.isProtocolHandled(SOCKET_SCHEMA)) return;

    protocol.handle(SOCKET_SCHEMA, (req) => {
      const url = req.url;
      const urlObj = new URL(url);
      const newUrl = getSocketUrl(SOCKET_SCHEMA, urlObj.pathname);

      return nodeFetch(newUrl, req).then((res) => {
        const readable = new Readable().wrap(res.body);
        return {
          ...res,
          headers: res.headers || {},
          body: Readable.toWeb(readable),
        };
      });
    });
  }
}
