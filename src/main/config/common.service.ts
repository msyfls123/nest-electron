import { CommonConfig } from '~/common/constants/config';
import { DATABASE_NAME } from '~/common/constants/meta';

import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class CommonConfigService {
  private static commonConfigKey = 'common-config';
  private database: PouchDB.Database<CommonConfig>;
  constructor(dbService: DatabaseService) {
    this.database = dbService.getDatabase(DATABASE_NAME);
  }

  public get<K extends keyof CommonConfig>(
    key: K,
  ): Promise<CommonConfig[K] | undefined> {
    return this.database
      .get(CommonConfigService.commonConfigKey)
      .then((data) => data[key])
      .catch((err) => {
        console.error(err);
        return undefined;
      });
  }

  public set<K extends keyof CommonConfig>(key: K, value: CommonConfig[K]) {
    return this.database.upsert(
      CommonConfigService.commonConfigKey,
      (doc) =>
        ({
          ...doc,
          [key]: value,
        } as PouchDB.Core.Document<CommonConfig>),
    );
  }
}
