import { Module } from '@nestjs/common';

import { WindowService } from './window.service';

@Module({
  providers: [WindowService],
})
export class WindowModule {}
