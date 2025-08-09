"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const di_1 = require("../di/di");
const router = () => {
    const routes = [];
    const routerMiddleware = (req, res, next) => {
        const route = routes.find((r) => r.path === req.url && r.method === req.method?.toLowerCase());
        if (route && route.controller) {
            if (route.contentType) {
                res.setHeader('Content-Type', route.contentType);
            }
            const controller = di_1.container.resolve(route.controller);
            const result = controller[route.action](req, res);
            res.end(result);
        }
        else {
            next();
        }
    };
    routerMiddleware.register = (controller) => {
        const controllerInstance = new controller();
        const controllerRoutes = Reflect.getMetadata('routes', controllerInstance) || [];
        controllerRoutes.forEach((route) => {
            routes.push({ ...route, controller });
        });
    };
    return routerMiddleware;
};
exports.router = router;
