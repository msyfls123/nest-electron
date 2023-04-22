import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from '../database/database.service';
import { CommonConfigService } from './common.service';

describe('CommonService', () => {
  let service: CommonConfigService;

  class MockDatabaseService {
    getDatabase() {
      return {};
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonConfigService,
        {
          provide: DatabaseService,
          useClass: MockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<CommonConfigService>(CommonConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
