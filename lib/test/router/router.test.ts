import 'reflect-metadata';
import { router } from '../../router/router';
import { Get } from '../../router/routes';
import { PathParam, QueryParams } from '../../router/params';
import { IRouterMiddleware } from '../../router/types';
import { Controller } from '../../di/di';
import { IncomingMessage, ServerResponse } from 'http';
import { Writable } from 'stream';
import { container } from '../../di/di';

@Controller()
class TestController {
  @Get('/test/:id')
  public testMethod(@PathParam('id') id: string, req: IncomingMessage, res: ServerResponse) {
    res.statusCode = 200;
    res.end(id);
  }

  @Get('/test-query')
  public testQuery(@QueryParams() query: any, req: IncomingMessage, res: ServerResponse) {
    res.statusCode = 200;
    res.end(JSON.stringify(query));
  }
}

/**
 * @fileoverview This file contains the test suite for the router.
 */
describe('Router', () => {
  let appRouter: IRouterMiddleware;
  let mockRequest: IncomingMessage;
  let mockResponse: ServerResponse;
  let mockSocket: Writable;

  /**
   * @description This function is executed before each test case.
   */
  beforeEach(() => {
    mockSocket = new Writable();
    mockRequest = new IncomingMessage(mockSocket as any);
    mockResponse = new ServerResponse(mockRequest);
    mockResponse.end = jest.fn();
    mockResponse.setHeader = jest.fn();

    container.register(TestController, new TestController());
    appRouter = router();
    appRouter.register(TestController);
  });

  /**
   * @description This test case verifies that a route is matched and the controller method is called.
   */
  it('should match a route and call the controller method', () => {
    mockRequest.url = '/test/123';
    mockRequest.method = 'GET';
    appRouter(mockRequest, mockResponse, () => {});
    expect(mockResponse.statusCode).toBe(200);
    expect(mockResponse.end).toHaveBeenCalledWith('123');
  });

  /**
   * @description This test case verifies that query parameters are extracted.
   */
  it('should extract query parameters', () => {
    mockRequest.url = '/test-query?foo=bar&baz=qux';
    mockRequest.method = 'GET';
    appRouter(mockRequest, mockResponse, () => {});
    expect(mockResponse.statusCode).toBe(200);
    expect(mockResponse.end).toHaveBeenCalledWith(JSON.stringify({ foo: 'bar', baz: 'qux' }));
  });

  /**
   * @description This test case verifies that the next function is called if no route is matched.
   */
  it('should call next if no route is matched', () => {
    const next = jest.fn();
    mockRequest.url = '/not-found';
    mockRequest.method = 'GET';
    appRouter(mockRequest, mockResponse, next);
    expect(next).toHaveBeenCalled();
  });

  /**
   * @description This test case verifies that a 405 error is returned for a method mismatch.
   */
  it('should return a 405 error for a method mismatch', () => {
    mockRequest.url = '/test/123';
    mockRequest.method = 'POST';
    appRouter(mockRequest, mockResponse, () => {});
    expect(mockResponse.statusCode).toBe(405);
  });
});