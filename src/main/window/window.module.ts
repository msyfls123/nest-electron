import { AppService } from '~/main/electron/app.service';
import { LogService } from '~/main/monitor/log.service';

import { Module } from '@nestjs/common';

import { WindowController } from './window.controller';

@Module({
  imports: [],
  providers: [AppService, LogService],
  controllers: [WindowController],
})
export class WindowModule {}
