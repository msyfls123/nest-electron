import { Test, TestingModule } from '@nestjs/testing';
import { WindowService } from './window.service';

describe('WindowService', () => {
  let service: WindowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WindowService],
    }).compile();

    service = module.get<WindowService>(WindowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
