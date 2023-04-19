import { Readable } from 'stream';

import { app, protocol } from 'electron';
import nodeFetch from 'node-fetch-unix';
import { Subject } from 'rxjs';
import { SOCKET_SCHEMA } from 'src/common/constants/meta';
import { getSocketUrl } from 'src/common/utils/socket';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private shutdownListener$: Subject<void> = new Subject();

  public constructor() {
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
