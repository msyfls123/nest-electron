import { Test, TestingModule } from '@nestjs/testing';

import { CommonConfigService } from '../config/common.service';
import { AppService } from '../electron/app.service';
import { LogService } from '../monitor/log.service';
import { SessionService } from './session.service';
import { WebRequestService } from './web-request.service';

describe('SessionService', () => {
  let service: SessionService;

  class MockAppService {
    getElectron() {
      return {
        session: {
          fromPartition: jest.fn(),
          defaultSession: {
            getStoragePath: () => 'default',
            protocol: {
              handle: jest.fn(),
            },
          },
        },
      };
    }
  }

  class MockLogService {
    private name;
    setContext(name) {
      this.name = name;
    }
    log = jest.fn();
  }

  class MockWebRequest {
    setup = jest.fn();
  }

  class MockCommonConfigService {
    get = jest.fn(() => Promise.resolve({}));
  }

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
        {
          provide: WebRequestService,
          useClass: MockWebRequest,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
