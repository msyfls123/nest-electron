import { Module } from '@nestjs/common';

import { IpcModule } from './ipc/ipc.module';
import { WindowModule } from './window/window.module';

@Module({
  imports: [WindowModule, IpcModule],
  providers: [],
})
export class AppModule {}
