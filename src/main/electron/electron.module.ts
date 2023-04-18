import { ProviderKey } from 'src/common/constants/provider';

import { Global, Module } from '@nestjs/common';

import { AppService } from './app.service';

@Global()
@Module({
  providers: [
    {
      provide: ProviderKey.APP,
      useClass: AppService,
    },
  ],
  exports: [ProviderKey.APP],
})
export class ElectronModule {}
