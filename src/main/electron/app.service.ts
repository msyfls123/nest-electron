import { Readable } from 'stream';

import * as Electron from 'electron';
import nodeFetch, { RequestInit } from 'node-fetch-unix';
import { Subject } from 'rxjs';
import { ReadableStream } from 'stream/web';
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
        scheme: SOCKET_SCHEMA,
        privileges: {
          supportFetchAPI: true,
          stream: true,
        },
      },
    ]);

    await this.ready();

    if (protocol.isProtocolHandled(SOCKET_SCHEMA)) return;

    protocol.handle(SOCKET_SCHEMA, (req) => {
      const url = req.url;
      const urlObj = new URL(url);
      const newUrl = getSocketUrl(SOCKET_SCHEMA, urlObj.pathname);

      const body = req.body
        ? Readable.fromWeb(req.body as ReadableStream<Uint8Array>)
        : undefined;
      const newReq: RequestInit = {
        ...req,
        method: req.method,
        headers: req.headers as any,
        body,
      };

      return nodeFetch(newUrl, newReq).then((res) => {
        const readable = new Readable().wrap(res.body);
        return {
          ...res,
          status: res.status,
          headers: res.headers || {},
          body: Readable.toWeb(readable),
        } as unknown as Response;
      });
    });
  }

  private bindAppQuit() {
    const { app } = this.getElectron();
    app.on('quit', () => this.shutdown());
  }
}
