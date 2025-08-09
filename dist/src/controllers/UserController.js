"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const index_1 = require("@lib/index");
const UserService_1 = require("../services/UserService");
const http_1 = require("http");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    index(req, res) {
        const users = this.userService.findAll();
        index_1.JsonResponse.for(res).status(200).body(users).send();
    }
    hello(req, res) {
        index_1.JsonResponse.for(res).status(200).body({ message: 'Hello, world!' }).send();
    }
};
exports.UserController = UserController;
__decorate([
    (0, index_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, http_1.ServerResponse]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "index", null);
__decorate([
    (0, index_1.Get)('/hello'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [http_1.IncomingMessage, http_1.ServerResponse]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "hello", null);
exports.UserController = UserController = __decorate([
    (0, index_1.ControllerDecorator)(),
    __metadata("design:paramtypes", [UserService_1.UserService])
], UserController);
