import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { CommonConfigService } from './common.service';

@Module({
  imports: [DatabaseModule],
  providers: [CommonConfigService],
  exports: [CommonConfigService],
})
export class ConfigModule {}
