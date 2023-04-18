import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AppService } from './electron/app.service';
import { IpcStrategy } from './transport/ipc-strategy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    strategy: new IpcStrategy(),
  });
  await app.startAllMicroservices();
  await app.listen(3000);
  app.get(AppService).subscribeToShutdown(app.close);
}
bootstrap();
