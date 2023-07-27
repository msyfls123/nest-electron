import os from 'os';
import path from 'path';

import { unlink } from 'fs/promises';
import { APP_SCHEMA } from 'src/common/constants/meta';
import { getSocketPath } from 'src/common/utils/socket';

import { NestApplication, NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { AppService } from './electron/app.service';
import { RequestInterceptor } from './electron/request.interceptor';
import { IpcStrategy } from './transport/ipc-strategy';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule, {
    forceCloseConnections: true,
  });

  // template
  app.setBaseViewsDir(path.join(__dirname, '..', 'renderer'));
  app.setViewEngine('hbs');

  // intercepters
  app.useGlobalInterceptors(new RequestInterceptor(app.get(Reflector)));

  // microservices
  app.connectMicroservice({
    strategy: new IpcStrategy(),
  });
  await app.startAllMicroservices();

  // socket
  const socketPath = getSocketPath(APP_SCHEMA);
  await (os.platform() === 'win32'
    ? Promise.resolve()
    : unlink(socketPath).catch(console.error));
  await app.listen(socketPath);

  app.get(AppService).subscribeToShutdown(app.close);
}
bootstrap();
