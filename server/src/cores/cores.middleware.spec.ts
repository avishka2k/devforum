import { CoresMiddleware } from './cores.middleware';

describe('CoresMiddleware', () => {
  it('should be defined', () => {
    expect(new CoresMiddleware()).toBeDefined();
  });
});
