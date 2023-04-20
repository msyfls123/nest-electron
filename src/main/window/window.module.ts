import { DatabaseModule } from '~/main/database/database.module';

import { Module } from '@nestjs/common';

import { WindowController } from './window.controller';

@Module({
  imports: [DatabaseModule],
  providers: [],
  controllers: [WindowController],
})
export class WindowModule {}
