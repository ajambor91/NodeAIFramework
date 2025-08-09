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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = exports.DependencyInjectionContainer = exports.Repository = exports.Service = exports.Controller = void 0;
require("reflect-metadata");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const DECORATOR_KEY = 'custom:decorator';
const Controller = () => (target) => Reflect.defineMetadata(DECORATOR_KEY, 'controller', target);
exports.Controller = Controller;
const Service = () => (target) => Reflect.defineMetadata(DECORATOR_KEY, 'service', target);
exports.Service = Service;
const Repository = () => (target) => Reflect.defineMetadata(DECORATOR_KEY, 'repository', target);
exports.Repository = Repository;
class DependencyInjectionContainer {
    constructor() {
        this.dependencies = new Map();
    }
    register(token, instance) {
        if (!this.dependencies.has(token)) {
            this.dependencies.set(token, instance);
        }
    }
    resolve(token) {
        const instance = this.dependencies.get(token);
        if (!instance) {
            throw new Error(`Dependency not found for token: ${token.name || token}`);
        }
        return instance;
    }
    load(srcPath) {
        const absolutePath = path.resolve(srcPath);
        this.loadFromDirectory(absolutePath);
    }
    loadFromDirectory(directory) {
        const files = fs.readdirSync(directory);
        for (const file of files) {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory() && path.basename(fullPath) !== 'lib') {
                this.loadFromDirectory(fullPath);
            }
            else if (stat.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.js'))) {
                this.loadDependenciesFromFile(fullPath);
            }
        }
    }
    loadDependenciesFromFile(filePath) {
        const module = require(filePath);
        for (const key in module) {
            const exported = module[key];
            if (typeof exported === 'function' && Reflect.getMetadata(DECORATOR_KEY, exported)) {
                this.resolveAndRegister(exported);
            }
        }
    }
    resolveAndRegister(target) {
        if (this.dependencies.has(target)) {
            return;
        }
        const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
        const resolvedDependencies = paramTypes.map((param) => {
            this.resolveAndRegister(param);
            return this.resolve(param);
        });
        const instance = new target(...resolvedDependencies);
        this.register(target, instance);
        console.log(`Loaded: ${target.name}`);
    }
}
exports.DependencyInjectionContainer = DependencyInjectionContainer;
exports.container = new DependencyInjectionContainer();
