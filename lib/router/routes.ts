import { Controller } from './types';

/**
 * @interface RouteDefinition
 * @description An interface for defining a route.
 */
export interface RouteDefinition {
  path: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  action: string;
  controller?: Controller;
  contentType?: string;
}
import 'reflect-metadata';

/**
 * @function createRouteDecorator
 * @description A factory function for creating route decorators.
 * @param {('get' | 'post' | 'put' | 'patch' | 'delete')} method - The HTTP method.
 * @returns {((path: string, options?: { contentType: string }) => MethodDecorator)} A method decorator.
 */
const createRouteDecorator =
  (method: 'get' | 'post' | 'put' | 'patch' | 'delete') =>
  (path: string, options?: { contentType: string }): MethodDecorator => {
    return (target, propertyKey) => {
      if (!Reflect.hasMetadata('routes', target.constructor)) {
        Reflect.defineMetadata('routes', [], target.constructor);
      }

      const routes: RouteDefinition[] = Reflect.getMetadata('routes', target.constructor);
      routes.push({
        method,
        path,
        action: propertyKey as string,
        contentType: options?.contentType || 'application/json',
      });
    };
  };

/**
 * @decorator Get
 * @description A method decorator for defining a GET route.
 */
export const Get = createRouteDecorator('get');
/**
 * @decorator Post
 * @description A method decorator for defining a POST route.
 */
export const Post = createRouteDecorator('post');
/**
 * @decorator Put
 * @description A method decorator for defining a PUT route.
 */
export const Put = createRouteDecorator('put');
/**
 * @decorator Patch
 * @description A method decorator for defining a PATCH route.
 */
export const Patch = createRouteDecorator('patch');
/**
 * @decorator Delete
 * @description A method decorator for defining a DELETE route.
 */
export const Delete = createRouteDecorator('delete');