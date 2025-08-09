"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonResponse = void 0;
class JsonResponse {
    constructor(res) {
        this._statusCode = 200;
        this.res = res;
    }
    static for(res) {
        return new JsonResponse(res);
    }
    status(status) {
        this._statusCode = status;
        return this;
    }
    body(data) {
        this._body = data;
        return this;
    }
    send() {
        this.res.statusCode = this._statusCode;
        this.res.setHeader('Content-Type', 'application/json');
        this.res.end(JSON.stringify(this._body));
    }
}
exports.JsonResponse = JsonResponse;
