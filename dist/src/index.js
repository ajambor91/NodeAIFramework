"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const http_1 = __importDefault(require("http"));
const index_1 = require("@lib/index");
const UserController_1 = require("./controllers/UserController");
index_1.container.load(__dirname);
(0, index_1.connectDB)();
const appRouter = (0, index_1.router)();
appRouter.register(UserController_1.UserController);
const app = http_1.default.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    appRouter(req, res, () => {
        res.statusCode = 404;
        res.end('Not Found');
    });
});
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
