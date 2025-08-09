import { ServerResponse } from 'http';

/**
 * @class JsonResponse
 * @description A helper class for creating JSON responses.
 */
export class JsonResponse {
  private _body: any;
  private _statusCode: number = 200;
  private res: ServerResponse;

  /**
   * @constructor
   * @param {ServerResponse} res - The server response object.
   */
  private constructor(res: ServerResponse) {
    this.res = res;
  }

  /**
   * @method for
   * @description Creates a new JsonResponse instance.
   * @param {ServerResponse} res - The server response object.
   * @returns {JsonResponse} A new JsonResponse instance.
   */
  public static for(res: ServerResponse): JsonResponse {
    return new JsonResponse(res);
  }

  /**
   * @method status
   * @description Sets the status code of the response.
   * @param {number} status - The status code.
   * @returns {this} The JsonResponse instance.
   */
  public status(status: number): this {
    this._statusCode = status;
    return this;
  }

  /**
   * @method body
   * @description Sets the body of the response.
   * @param {any} data - The data to send in the response.
   * @returns {this} The JsonResponse instance.
   */
  public body(data: any): this {
    this._body = data;
    return this;
  }

  /**
   * @method send
   * @description Sends the response.
   */
  public send(): void {
    this.res.statusCode = this._statusCode;
    this.res.setHeader('Content-Type', 'application/json');
    this.res.end(JSON.stringify(this._body));
  }
}