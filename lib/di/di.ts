import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';

const DECORATOR_KEY = 'custom:decorator';

export type Token<T> = new (...args: any[]) => T;

/**
 * @decorator Controller
 * @description A class decorator that marks a class as a controller.
 * @returns {ClassDecorator}
 */
export const Controller = (): ClassDecorator => (target: object) => Reflect.defineMetadata(DECORATOR_KEY, 'controller', target);
/**
 * @decorator Service
 * @description A class decorator that marks a class as a service.
 * @returns {ClassDecorator}
 */
export const Service = (): ClassDecorator => (target: object) => Reflect.defineMetadata(DECORATOR_KEY, 'service', target);
/**
 * @decorator Repository
 * @description A class decorator that marks a class as a repository.
 * @returns {ClassDecorator}
 */
export const Repository = (): ClassDecorator => (target: object) => Reflect.defineMetadata(DECORATOR_KEY, 'repository', target);

/**
 * @class DependencyInjectionContainer
 * @description A container for managing dependencies.
 */
export class DependencyInjectionContainer {
    private dependencies: Map<Token<any>, any> = new Map();

    /**
     * @method register
     * @description Registers a dependency with the container.
     * @param {Token<T>} token - The token to register the dependency with.
     * @param {T} instance - The instance of the dependency.
     */
    public register<T>(token: Token<T>, instance: T): void {
        if (!this.dependencies.has(token)) {
            this.dependencies.set(token, instance);
        }
    }

    /**
     * @method resolve
     * @description Resolves a dependency from the container.
     * @param {Token<T>} token - The token of the dependency to resolve.
     * @returns {T} The resolved dependency.
     */
    public resolve<T>(token: Token<T>): T {
        const instance = this.dependencies.get(token);
        if (!instance) {
            throw new Error(`Dependency not found for token: ${token.name || token}`);
        }
        return instance;
    }

    /**
     * @method load
     * @description Loads all dependencies from a directory.
     * @param {string} srcPath - The path to the directory to load dependencies from.
     */
    public load(srcPath: string): void {
        const absolutePath = path.resolve(srcPath);
        this.loadFromDirectory(absolutePath);
    }

    /**
     * @method loadFromDirectory
     * @description Recursively loads all dependencies from a directory.
     * @param {string} directory - The directory to load dependencies from.
     */
    private loadFromDirectory(directory: string): void {
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && path.basename(fullPath) !== 'lib' && path.basename(fullPath) !== 'test') {
                this.loadFromDirectory(fullPath);
            } else if (stat.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.js'))) {
                this.loadDependenciesFromFile(fullPath);
            }
        }
    }

    /**
     * @method loadDependenciesFromFile
     * @description Loads all dependencies from a file.
     * @param {string} filePath - The path to the file to load dependencies from.
     */
    private loadDependenciesFromFile(filePath: string): void {
        const module = require(filePath);
        for (const key in module) {
            const exported = module[key];
            if (typeof exported === 'function' && Reflect.getMetadata(DECORATOR_KEY, exported)) {
                this.resolveAndRegister(exported);
            }
        }
    }

    /**
     * @method resolveAndRegister
     * @description Resolves and registers a dependency and its dependencies.
     * @param {T} target - The dependency to resolve and register.
     */
    private resolveAndRegister<T extends { new(...args: any[]): {} }>(target: T): void {
        if (this.dependencies.has(target)) {
            return;
        }

        const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
        const resolvedDependencies = paramTypes.map((param: Token<any>) => {
            this.resolveAndRegister(param);
            return this.resolve(param);
        });

        const instance = new target(...resolvedDependencies);
        this.register(target, instance);
        console.log(`Loaded: ${target.name}`);
    }
}
export const container = new DependencyInjectionContainer();