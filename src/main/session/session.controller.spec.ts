import { Test, TestingModule } from '@nestjs/testing';

import { SessionController } from './session.controller';
import { SessionService } from './session.service';

describe('SessionController', () => {
  let controller: SessionController;

  class MockSessionService {
    all() {
      return Promise.resolve({});
    }

    get(name: string) {
      return name;
    }

    set(info: string) {
      return info;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SessionService,
          useClass: MockSessionService,
        },
      ],
      controllers: [SessionController],
    }).compile();

    controller = module.get<SessionController>(SessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
