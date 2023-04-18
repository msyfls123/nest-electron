import { Test, TestingModule } from '@nestjs/testing';
import { WindowController } from './window.controller';

describe('WindowController', () => {
  let controller: WindowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WindowController],
    }).compile();

    controller = module.get<WindowController>(WindowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
