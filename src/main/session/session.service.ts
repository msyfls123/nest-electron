import { Session } from 'electron';
import { memoize } from 'lodash';
import { Subject } from 'rxjs';
import { SessionInfo } from '~/common/constants/config';
import {
  API_SCHEMA,
  PAGE_SCHEMA,
  SESSION_PERSIST,
} from '~/common/constants/meta';
import { redirectRequest } from '~/common/utils/socket';

import { Injectable } from '@nestjs/common';

import { CommonConfigService } from '../config/common.service';
import { AppService } from '../electron/app.service';
import { LogService } from '../monitor/log.service';
import { WebRequestService } from './web-request.service';

@Injectable()
export class SessionService {
  private session$ = new Subject<Session>();

  public constructor(
    private readonly appService: AppService,
    private readonly logService: LogService,
    private readonly commonConfig: CommonConfigService,
    private readonly webRequestService: WebRequestService,
  ) {
    this.logService.setContext(SessionService.name);
    this.settleSessionCreated();
  }

  public async get(partition: string) {
    partition = String(partition);
    const sessions = (await this.commonConfig.get('sessions')) ?? {};
    return sessions[partition];
  }

  public async set(info: SessionInfo) {
    const sessions = (await this.commonConfig.get('sessions')) ?? {};
    const partition = `${SESSION_PERSIST}${info.partition}`;
    const session = this.appService
      .getElectron()
      .session.fromPartition(partition);
    this.session$.next(session);
    sessions[partition] = {
      ...info,
      partition,
    };
    return this.commonConfig.set('sessions', sessions);
  }

  public async all(): Promise<Record<string, SessionInfo>> {
    return (await this.commonConfig.get('sessions')) ?? {};
  }

  private settleSessionCreated() {
    this.session$.subscribe((session) => {
      this.setupSession(session);
    });

    const sessionKls = this.appService.getElectron().session;
    this.session$.next(sessionKls.defaultSession);

    this.commonConfig.get('sessions').then((sessions) => {
      Object.values(sessions)
        .map((info) => sessionKls.fromPartition(info.partition))
        .forEach((session) => this.session$.next(session));
    });
  }

  private setupSession = memoize((session: Session) => {
    this.logService.log(`Setup Session For ${session.getStoragePath()}`);
    this.webRequestService.setup(session);
    session.protocol.handle(API_SCHEMA, redirectRequest);
    session.protocol.handle(PAGE_SCHEMA, redirectRequest);
  });
}
