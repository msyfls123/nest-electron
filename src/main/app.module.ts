import { Module } from '@nestjs/common';

import { AppService } from './electron/app.service';
import { ElectronModule } from './electron/electron.module';
import { IpcModule } from './ipc/ipc.module';
import { WindowModule } from './window/window.module';
import { MonitorModule } from './monitor/monitor.module';

@Module({
  imports: [WindowModule, IpcModule, ElectronModule, MonitorModule],
  providers: [AppService],
})
export class AppModule {}
