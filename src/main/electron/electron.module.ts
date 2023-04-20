import { ProviderValueKey } from '~/common/constants/provider';

import { Global, Module } from '@nestjs/common';

import { AppService } from './app.service';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: ProviderValueKey.USER_DATA_DIR,
      useFactory: async (appService: AppService) => {
        await appService.ready();
        return appService.getPath('userData');
      },
      inject: [AppService],
    },
    AppService,
  ],
  exports: [AppService, ProviderValueKey.USER_DATA_DIR],
})
export class ElectronModule {}
