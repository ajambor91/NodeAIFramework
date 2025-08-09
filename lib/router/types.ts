import { IncomingMessage, ServerResponse } from 'http';

export type Next = () => void;
export type Controller = new (...args: any[]) => any;

export interface IRouterMiddleware {
  (req: IncomingMessage, res: ServerResponse, next: Next): void;
  register(controller: Controller): void;
}