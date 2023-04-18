import { Module } from '@nestjs/common';

import { ElectronModule } from '../electron/electron.module';
import { WindowController } from './window.controller';

@Module({
  imports: [ElectronModule],
  providers: [],
  controllers: [WindowController],
})
export class WindowModule {}
