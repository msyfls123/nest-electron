import { Module } from '@nestjs/common';

import { ElectronModule } from '../electron/electron.module';
import { DatabaseService } from './database.service';

@Module({
  imports: [],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
