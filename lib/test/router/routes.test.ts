import 'reflect-metadata';
import { Get, Post, Put, Patch, Delete, RouteDefinition } from '../../router/routes';

class TestController {
  @Get('/test')
  public getTest() {}

  @Post('/test')
  public postTest() {}

  @Put('/test')
  public putTest() {}

  @Patch('/test')
  public patchTest() {}

  @Delete('/test')
  public deleteTest() {}
}

/**
 * @fileoverview This file contains the test suite for the route decorators.
 */
describe('Route Decorators', () => {
  /**
   * @description This test case verifies that the @Get decorator defines the correct route metadata.
   */
  it('should define route metadata for @Get', () => {
    const routes: RouteDefinition[] = Reflect.getMetadata('routes', TestController);
    const route = routes.find(r => r.action === 'getTest');
    expect(route).toBeDefined();
    expect(route?.method).toBe('get');
    expect(route?.path).toBe('/test');
  });

  /**
   * @description This test case verifies that the @Post decorator defines the correct route metadata.
   */
  it('should define route metadata for @Post', () => {
    const routes: RouteDefinition[] = Reflect.getMetadata('routes', TestController);
    const route = routes.find(r => r.action === 'postTest');
    expect(route).toBeDefined();
    expect(route?.method).toBe('post');
    expect(route?.path).toBe('/test');
  });

  /**
   * @description This test case verifies that the @Put decorator defines the correct route metadata.
   */
  it('should define route metadata for @Put', () => {
    const routes: RouteDefinition[] = Reflect.getMetadata('routes', TestController);
    const route = routes.find(r => r.action === 'putTest');
    expect(route).toBeDefined();
    expect(route?.method).toBe('put');
    expect(route?.path).toBe('/test');
  });

  /**
   * @description This test case verifies that the @Patch decorator defines the correct route metadata.
   */
  it('should define route metadata for @Patch', () => {
    const routes: RouteDefinition[] = Reflect.getMetadata('routes', TestController);
    const route = routes.find(r => r.action === 'patchTest');
    expect(route).toBeDefined();
    expect(route?.method).toBe('patch');
    expect(route?.path).toBe('/test');
  });

  /**
   * @description This test case verifies that the @Delete decorator defines the correct route metadata.
   */
  it('should define route metadata for @Delete', () => {
    const routes: RouteDefinition[] = Reflect.getMetadata('routes', TestController);
    const route = routes.find(r => r.action === 'deleteTest');
    expect(route).toBeDefined();
    expect(route?.method).toBe('delete');
    expect(route?.path).toBe('/test');
  });
});