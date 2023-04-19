import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from '../electron/app.service';
import { LogService } from '../monitor/log.service';
import { WindowController } from './window.controller';

describe('WindowController', () => {
  let controller: WindowController;

  class MockAppService {
    ready() {
      return Promise.resolve();
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [AppService, LogService],
      controllers: [WindowController],
    })
      .overrideProvider(AppService)
      .useClass(MockAppService)
      .compile();

    controller = module.get<WindowController>(WindowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
