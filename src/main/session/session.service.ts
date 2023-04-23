import { SessionInfo } from '~/common/constants/config';
import { SESSION_PERSIST } from '~/common/constants/meta';

import { Injectable } from '@nestjs/common';

import { CommonConfigService } from '../config/common.service';
import { AppService } from '../electron/app.service';
import { LogService } from '../monitor/log.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly appService: AppService,
    private readonly logService: LogService,
    private readonly commonConfig: CommonConfigService,
  ) {
    this.logService.setContext(SessionService.name);
  }

  public async get(partition: string) {
    partition = String(partition);
    const sessions = (await this.commonConfig.get('sessions')) ?? {};
    return sessions[partition];
  }

  public async set(info: SessionInfo) {
    const sessions = (await this.commonConfig.get('sessions')) ?? {};
    const partition = `${SESSION_PERSIST}${info.partition}`;
    sessions[partition] = {
      ...info,
      partition,
    };
    return this.commonConfig.set('sessions', sessions);
  }

  public async all(): Promise<Record<string, SessionInfo>> {
    return (await this.commonConfig.get('sessions')) ?? {};
  }
}
