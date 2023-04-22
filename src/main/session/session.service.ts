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
    const sessions = new Set((await this.commonConfig.get('sessions')) || []);
    sessions.add(partition);
    await this.commonConfig.set('sessions', Array.from(sessions));
    this.logService.log('all partitions:', Array.from(sessions).join('\n'));
    this.logService.log(`from partition [${partition}]`);

    return this.appService
      .getElectron()
      .session.fromPartition(`${SESSION_PERSIST}${partition}`);
  }

  public async all() {
    const sessions = new Set((await this.commonConfig.get('sessions')) || []);
    return Array.from(sessions);
  }
}
