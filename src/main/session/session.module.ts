import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { WebRequestService } from './web-request.service';

@Module({
  imports: [ConfigModule],
  providers: [SessionService, WebRequestService],
  exports: [SessionService, WebRequestService],
  controllers: [SessionController],
})
export class SessionModule {}
