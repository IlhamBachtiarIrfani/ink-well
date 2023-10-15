import { RequestLogInterceptor } from './request-log.interceptor';

describe('ErrorLogInterceptor', () => {
  it('should be defined', () => {
    expect(new RequestLogInterceptor()).toBeDefined();
  });
});
