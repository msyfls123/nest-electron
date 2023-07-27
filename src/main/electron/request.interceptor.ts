import { webContents } from 'electron';
import { Observable, tap } from 'rxjs';
import { HEADER_WEBCONTENTS_ID } from '~/common/constants/meta';
import { IRequest } from '~/common/interfaces/electron/request';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      const host = context.switchToHttp();
      const req = host.getRequest<IRequest>();
      const webContentsId = Number(req.headers[HEADER_WEBCONTENTS_ID]);
      if (Number.isSafeInteger(webContentsId)) {
        req.webContents = webContents.fromId(webContentsId);
      }
    }

    return next.handle().pipe(
      tap(() => {
        const handler = context.getHandler();
        const metaValue = this.reflector.get('all', handler);
        console.log(handler.name, 'meta data', metaValue);
      }),
    );
  }
}
