"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete = exports.Patch = exports.Put = exports.Post = exports.Get = void 0;
require("reflect-metadata");
const createRouteDecorator = (method) => (path, options) => {
    return (target, propertyKey) => {
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }
        const routes = Reflect.getMetadata('routes', target.constructor);
        routes.push({
            method,
            path,
            action: propertyKey,
            contentType: options?.contentType || 'application/json',
        });
    };
};
exports.Get = createRouteDecorator('get');
exports.Post = createRouteDecorator('post');
exports.Put = createRouteDecorator('put');
exports.Patch = createRouteDecorator('patch');
exports.Delete = createRouteDecorator('delete');
