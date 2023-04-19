import { Module } from '@nestjs/common';

import { AppService } from '../electron/app.service';
import { LogService } from '../monitor/log.service';
import { WindowController } from './window.controller';

@Module({
  imports: [],
  providers: [AppService, LogService],
  controllers: [WindowController],
})
export class WindowModule {}
