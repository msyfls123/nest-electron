import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { SessionService } from './session.service';

@Module({
  imports: [ConfigModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
