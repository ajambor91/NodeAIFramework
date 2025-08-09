"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerDecorator = exports.Repository = exports.Service = exports.DependencyInjectionContainer = exports.container = void 0;
var di_1 = require("./di/di");
Object.defineProperty(exports, "container", { enumerable: true, get: function () { return di_1.container; } });
Object.defineProperty(exports, "DependencyInjectionContainer", { enumerable: true, get: function () { return di_1.DependencyInjectionContainer; } });
Object.defineProperty(exports, "Service", { enumerable: true, get: function () { return di_1.Service; } });
Object.defineProperty(exports, "Repository", { enumerable: true, get: function () { return di_1.Repository; } });
Object.defineProperty(exports, "ControllerDecorator", { enumerable: true, get: function () { return di_1.Controller; } });
__exportStar(require("./http/JsonResponse"), exports);
__exportStar(require("./orm"), exports);
__exportStar(require("./router/router"), exports);
__exportStar(require("./router/routes"), exports);
__exportStar(require("./router/types"), exports);
