import { Module } from '@nestjs/common';

import { ElectronModule } from './electron/electron.module';
import { IpcModule } from './ipc/ipc.module';
import { MonitorModule } from './monitor/monitor.module';
import { SessionModule } from './session/session.module';
import { WindowModule } from './window/window.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    WindowModule,
    IpcModule,
    ElectronModule,
    MonitorModule,
    SessionModule,
    ConfigModule,
  ],
  providers: [],
})
export class AppModule {}
