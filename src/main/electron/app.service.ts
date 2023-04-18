import { app } from 'electron';
import { Subject } from 'rxjs';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private shutdownListener$: Subject<void> = new Subject();

  public constructor() {
    app.on('quit', () => this.shutdown());
  }

  // Subscribe to the shutdown in your main.ts
  public subscribeToShutdown(shutdownFn: () => void): void {
    this.shutdownListener$.subscribe(() => shutdownFn());
  }

  // Emit the shutdown event
  shutdown() {
    this.shutdownListener$.next();
  }

  ready() {
    return app.whenReady();
  }
}
