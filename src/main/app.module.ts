import { Module } from '@nestjs/common';

import { ElectronModule } from './electron/electron.module';
import { IpcModule } from './ipc/ipc.module';
import { MonitorModule } from './monitor/monitor.module';
import { WindowModule } from './window/window.module';

@Module({
  imports: [WindowModule, IpcModule, ElectronModule, MonitorModule],
  providers: [],
})
export class AppModule {}
