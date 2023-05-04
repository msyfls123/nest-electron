import { webContents } from 'electron';
import { Observable } from 'rxjs';
import { HEADER_WEBCONTENTS_ID } from '~/common/constants/meta';
import { IRequest } from '~/common/interfaces/electron/request';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      const host = context.switchToHttp();
      const req = host.getRequest<IRequest>();
      const webContentsId = Number(req.headers[HEADER_WEBCONTENTS_ID]);
      if (Number.isSafeInteger(webContentsId)) {
        req.webContents = webContents.fromId(webContentsId);
      }
    }

    return next.handle();
  }
}
