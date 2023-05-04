import os from 'os';
import path from 'path';

import request from 'supertest';
import { AppService } from '~/main/electron/app.service';
import { SessionService } from '~/main/session/session.service';

import { INestApplication } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './../src/main/app.module';

describe('AppController (e2e)', () => {
  let app: NestApplication;

  class MockAppService {
    ready() {
      return Promise.resolve();
    }

    getPath() {
      return os.tmpdir();
    }
  }

  class MockSessionService {}

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useClass(MockAppService)
      .overrideProvider(SessionService)
      .useClass(MockSessionService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setBaseViewsDir(path.join(__dirname, '..', 'src', 'renderer'));
    app.setViewEngine('hbs');
    await app.init();
  });

  it('/window (GET)', () => {
    return request(app.getHttpServer())
      .get('/window')
      .expect(200)
      .expect('Content-Type', /html/);
  });
});
