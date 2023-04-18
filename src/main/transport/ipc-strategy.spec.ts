import { IpcStrategy } from './ipc-strategy';

describe('Strategy', () => {
  it('should be defined', () => {
    expect(new IpcStrategy()).toBeDefined();
  });
});
