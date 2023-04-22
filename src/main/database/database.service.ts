import { Inject, Injectable } from '@nestjs/common';
import path from 'path';
import PouchDB from 'pouchdb';
import { ProviderValueKey } from '~/common/constants/provider';
import { ensureSync } from '../utils/file';
import { LogService } from '../monitor/log.service';
import PouchUpsertAdapter from 'pouchdb-upsert';

const Pouch = PouchDB.plugin(PouchUpsertAdapter);

@Injectable()
export class DatabaseService {
  private dbMap: Map<string, PouchDB.Database<any>> = new Map();

  constructor(
    @Inject(ProviderValueKey.USER_DATA_DIR)
    private readonly userDataDir: string,
    private readonly logger: LogService,
  ) {
    this.logger.setContext(DatabaseService.name);
    this.logger.debug('Database Service Started');
  }

  getDatabase<T = any>(
    pathname: string,
    options?: PouchDB.Configuration.DatabaseConfiguration,
  ): PouchDB.Database<T> {
    if (this.dbMap.has(pathname)) return this.dbMap.get(pathname);
    const dbDir = path.join(this.userDataDir, pathname);
    ensureSync(dbDir);
    const db = new Pouch<T>(dbDir, options);
    this.dbMap.set(pathname, db);
    return db;
  }
}
