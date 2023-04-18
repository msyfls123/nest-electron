import { Module } from '@nestjs/common';

import { AppService } from '../electron/app.service';
import { WindowController } from './window.controller';

@Module({
  imports: [],
  providers: [AppService],
  controllers: [WindowController],
})
export class WindowModule {}
