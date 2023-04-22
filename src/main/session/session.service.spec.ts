import { Test, TestingModule } from '@nestjs/testing';

import { CommonConfigService } from '../config/common.service';
import { AppService } from '../electron/app.service';
import { LogService } from '../monitor/log.service';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  class MockAppService {}

  class MockLogService {
    private name;
    setContext(name) {
      this.name = name;
    }
  }

  class MockCommonConfigService {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: AppService,
          useClass: MockAppService,
        },
        {
          provide: LogService,
          useClass: MockLogService,
        },
        {
          provide: CommonConfigService,
          useClass: MockCommonConfigService,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
