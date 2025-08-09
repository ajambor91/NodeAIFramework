import 'reflect-metadata';
import { Body, Valid, PathParam, QueryParams } from '../../router/params';
import { Validator } from '../../validation/validators';

class TestController {
  public testMethod(
    @Body() body: any,
    @Valid(class implements Validator {
      validate(data: any): void {}
    })
    @Body()
    validatedBody: any,
    @PathParam('id') id: string,
    @QueryParams() query: any
  ) {}
}

/**
 * @fileoverview This file contains the test suite for the parameter decorators.
 */
describe('Parameter Decorators', () => {
  /**
   * @description This test case verifies that the Body decorator defines the correct metadata.
   */
  it('should define body metadata', () => {
    const bodyParams = Reflect.getMetadata('body', TestController, 'testMethod');
    expect(bodyParams).toEqual([1, 0]);
  });

  /**
   * @description This test case verifies that the Valid decorator defines the correct metadata.
   */
  it('should define validator metadata', () => {
    const validators = Reflect.getMetadata('validators', TestController, 'testMethod');
    expect(validators).toHaveLength(1);
    expect(validators[0].index).toBe(1);
    expect(new validators[0].validator().validate).toBeDefined();
  });

  /**
   * @description This test case verifies that the PathParam decorator defines the correct metadata.
   */
  it('should define pathParam metadata', () => {
    const pathParams = Reflect.getMetadata('pathParams', TestController, 'testMethod');
    expect(pathParams).toHaveLength(1);
    expect(pathParams[0].index).toBe(2);
    expect(pathParams[0].name).toBe('id');
  });

  /**
   * @description This test case verifies that the QueryParams decorator defines the correct metadata.
   */
  it('should define queryParams metadata', () => {
    const queryParams = Reflect.getMetadata('queryParams', TestController, 'testMethod');
    expect(queryParams).toEqual([3]);
  });
});