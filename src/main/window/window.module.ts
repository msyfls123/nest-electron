import { DatabaseModule } from '~/main/database/database.module';
import { SessionModule } from '~/main/session/session.module';

import { Module } from '@nestjs/common';

import { WindowController } from './window.controller';

@Module({
  imports: [DatabaseModule, SessionModule],
  providers: [],
  controllers: [WindowController],
})
export class WindowModule {}
