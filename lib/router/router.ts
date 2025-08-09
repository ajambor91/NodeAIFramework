import { IncomingMessage, ServerResponse } from 'http';
import { container } from '../di/di';
import { RouteDefinition } from './routes';
import { Controller, IRouterMiddleware, Next } from './types';
import { AppError, MethodNotAllowedError } from '../errors/errors';

/**
 * @function router
 * @description Creates a new router middleware.
 * @returns {IRouterMiddleware} The router middleware.
 */
export const router = (): IRouterMiddleware => {
  const routes: RouteDefinition[] = [];

  /**
   * @function routerMiddleware
   * @description The router middleware.
   * @param {IncomingMessage} req - The request object.
   * @param {ServerResponse} res - The response object.
   * @param {Next} next - The next middleware function.
   */
  const routerMiddleware = (
    req: IncomingMessage,
    res: ServerResponse,
    next: Next
  ) => {
    let route: RouteDefinition | undefined;
    let params: { [key: string]: string } = {};
    let queryParams: { [key: string]: string } = {};

    const url = new URL(req.url!, `http://${req.headers.host}`);
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    for (const r of routes) {
      const routeParts = r.path.split('/').filter(p => p);
      const urlParts = url.pathname.split('/').filter(p => p);

      if (routeParts.length !== urlParts.length) {
        continue;
      }

      let match = true;
      const currentParams: { [key: string]: string } = {};

      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          currentParams[routeParts[i].substring(1)] = urlParts[i];
        } else if (routeParts[i] !== urlParts[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        route = r;
        params = currentParams;
        break;
      }
    }

    if (route && route.controller) {
      if (route.method !== req.method?.toLowerCase()) {
        const error = new MethodNotAllowedError();
        res.statusCode = error.statusCode;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: error.message }));
        return;
      }

      try {
        const controller = container.resolve(route.controller);
        const securityClass = Reflect.getMetadata('security', controller.constructor, route.action);
        if (securityClass) {
          const security = new securityClass();
          security.authenticate(req);
        }

        if (route.contentType) {
          res.setHeader('Content-Type', route.contentType);
        }
        const bodyParams: number[] = Reflect.getMetadata('body', controller.constructor, route.action) || [];
        const validators: { index: number, validator: new () => any }[] = Reflect.getMetadata('validators', controller.constructor, route.action) || [];

        const pathParams: { index: number, name: string }[] = Reflect.getMetadata('pathParams', controller.constructor, route.action) || [];
        const queryParamsMetadata: number[] = Reflect.getMetadata('queryParams', controller.constructor, route.action) || [];

        const args: any[] = [];
        pathParams.forEach(p => {
          args[p.index] = params[p.name];
        });

        if (queryParamsMetadata.length > 0) {
          queryParamsMetadata.forEach(p => {
            args[p] = queryParams;
          });
        }

        if (bodyParams.length > 0) {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const parsedBody = JSON.parse(body);
              validators.forEach(v => {
                if (v.index === bodyParams[0]) {
                  const validator = new v.validator();
                  validator.validate(parsedBody);
                }
              });
              args[bodyParams[0]] = parsedBody;
              args.push(req, res);
              controller[route.action](...args);
            } catch (error) {
              if (error instanceof AppError) {
                res.statusCode = error.statusCode;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: error.message }));
              } else {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
              }
            }
          });
        } else {
          args.push(req, res);
          controller[route.action](...args);
        }
      } catch (error) {
        if (error instanceof AppError) {
          res.statusCode = error.statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: error.message }));
        } else {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
      }
    } else {
      next();
    }
  };

  /**
   * @method register
   * @description Registers a controller with the router.
   * @param {Controller} controller - The controller to register.
   */
  routerMiddleware.register = (controller: Controller) => {
    const controllerInstance = container.resolve(controller);
    const controllerRoutes: RouteDefinition[] =
      Reflect.getMetadata('routes', controllerInstance.constructor) || [];
    controllerRoutes.forEach((route: RouteDefinition) => {
      routes.push({ ...route, controller: controllerInstance.constructor as Controller });
    });
  };

  return routerMiddleware as IRouterMiddleware;
};