import request from 'supertest';
import { AppService } from '~/main/electron/app.service';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './../src/main/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  class MockAppService {
    ready() {
      return Promise.resolve();
    }
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useClass(MockAppService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/window (GET)', () => {
    return request(app.getHttpServer())
      .get('/window')
      .expect(200)
      .expect('Hello World!');
  });
});
