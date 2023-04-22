import PouchDB from 'pouchdb';
import PouchDBMemoryAdapter from 'pouchdb-adapter-memory';

import { OnModuleDestroy } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from '../database/database.service';
import { AppService } from '../electron/app.service';
import { LogService } from '../monitor/log.service';
import { SessionService } from '../session/session.service';
import { WindowController } from './window.controller';

const Pouch = PouchDB.plugin(PouchDBMemoryAdapter);

describe('WindowController', () => {
  let controller: WindowController;
  let module: TestingModule;

  class MockAppService {
    ready() {
      return Promise.resolve();
    }
  }

  class MockDatabaseService implements OnModuleDestroy {
    private pouch = new Pouch('test');
    getDatabase() {
      return this.pouch;
    }

    async onModuleDestroy() {
      return this.pouch.destroy();
    }
  }

  class MockSessionService {}

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [
        AppService,
        LogService,
        DatabaseService,
        {
          provide: SessionService,
          useClass: MockSessionService,
        },
      ],
      controllers: [WindowController],
    })
      .overrideProvider(AppService)
      .useClass(MockAppService)
      .overrideProvider(DatabaseService)
      .useClass(MockDatabaseService)
      .compile();

    controller = module.get<WindowController>(WindowController);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
