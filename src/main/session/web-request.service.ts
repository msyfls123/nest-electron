import { Session } from 'electron';
import { API_SCHEMA, HEADER_WEBCONTENTS_ID } from '~/common/constants/meta';

import { Injectable } from '@nestjs/common';

@Injectable()
export class WebRequestService {
  public setup(session: Session) {
    session.webRequest.onBeforeSendHeaders(
      { urls: [`${API_SCHEMA}://*/*`] },
      (details, cb) => {
        cb({
          requestHeaders: {
            ...details.requestHeaders,
            [HEADER_WEBCONTENTS_ID]: String(details.webContentsId ?? ''),
          },
        });
      },
    );
  }
}
