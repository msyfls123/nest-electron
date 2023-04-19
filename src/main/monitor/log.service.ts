import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LogService extends ConsoleLogger {
  customLog() {
    this.warn('Please feed the cat!');
  }
}
