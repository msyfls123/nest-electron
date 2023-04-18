import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WindowModule } from './window/window.module';
import { IpcModule } from './ipc/ipc.module';

@Module({
  imports: [WindowModule, IpcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
