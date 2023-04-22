import os from 'os';

import { unlink } from 'fs/promises';
import { SOCKET_SCHEMA } from 'src/common/constants/meta';
import { getSocketPath } from 'src/common/utils/socket';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AppService } from './electron/app.service';
import { IpcStrategy } from './transport/ipc-strategy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
  });

  app.connectMicroservice({
    strategy: new IpcStrategy(),
  });
  await app.startAllMicroservices();

  const socketPath = getSocketPath(SOCKET_SCHEMA);
  await (os.platform() === 'win32'
    ? Promise.resolve()
    : unlink(socketPath).catch(console.error));
  await app.listen(socketPath);

  app.get(AppService).subscribeToShutdown(app.close);
}
bootstrap();
