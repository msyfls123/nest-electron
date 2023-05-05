import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LogService extends ConsoleLogger {
  customLog() {
    this.warn('Please feed the cat!');
  }
}
