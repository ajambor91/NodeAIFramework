import { ControllerDecorator as Controller, Get, Post, JsonResponse, Body, Valid, Security, PathParam, QueryParams } from '../../lib';
import { UserService } from '../services/UserService';
import { IncomingMessage, ServerResponse } from 'http';
import { CreateUserDto } from '../types/user';
import { AppError } from '../../lib/errors/errors';
import { RegisterValidator } from '../../lib/validation/validators';
import { JWTSecurity } from '../../lib/security/security';

/**
 * @class UserController
 * @description A controller for handling user-related requests.
 */
@Controller()
export class UserController {
  /**
   * @constructor
   * @param {UserService} userService - The user service.
   */
  constructor(private readonly userService: UserService) {}

  /**
   * @method index
   * @description Gets all users.
   * @param {IncomingMessage} req - The request object.
   * @param {ServerResponse} res - The response object.
   */
  @Get('/')
  public async index(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const users = await this.userService.findAll();
    JsonResponse.for(res).status(200).body(users).send();
  }

  /**
   * @method register
   * @description Registers a new user.
   * @param {CreateUserDto} createUserDto - The user data.
   * @param {IncomingMessage} req - The request object.
   * @param {ServerResponse} res - The response object.
   */
  @Post('/register')
  public async register(@Valid(RegisterValidator) @Body() createUserDto: CreateUserDto, req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const newUser = await this.userService.createUser(createUserDto);
      JsonResponse.for(res).status(201).body(newUser).send();
    } catch (error) {
      if (error instanceof AppError) {
        JsonResponse.for(res).status(error.statusCode).body({ message: error.message }).send();
      } else {
        JsonResponse.for(res).status(500).body({ message: 'Internal Server Error' }).send();
      }
    }
  }

  /**
   * @method login
   * @description Logs in a user.
   * @param {CreateUserDto} createUserDto - The user credentials.
   * @param {IncomingMessage} req - The request object.
   * @param {ServerResponse} res - The response object.
   */
  @Post('/login')
  public async login(@Body() createUserDto: CreateUserDto, req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const loginResult = await this.userService.login(createUserDto);
      JsonResponse.for(res).status(200).body(loginResult).send();
    } catch (error) {
      if (error instanceof AppError) {
        JsonResponse.for(res).status(error.statusCode).body({ message: error.message }).send();
      } else {
        JsonResponse.for(res).status(500).body({ message: 'Internal Server Error' }).send();
      }
    }
  }

  /**
   * @method getUserById
   * @description Gets a user by their ID.
   * @param {string} id - The user ID.
   * @param {IncomingMessage} req - The request object.
   * @param {ServerResponse} res - The response object.
   */
  @Get('/get-user/:id')
  @Security(JWTSecurity)
  public async getUserById(@PathParam('id') id: string, req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      console.log(id)
      const user = await this.userService.getUserById(id);
      JsonResponse.for(res).status(200).body(user).send();
    } catch (error) {
      if (error instanceof AppError) {
        JsonResponse.for(res).status(error.statusCode).body({ message: error.message }).send();
      } else {
        JsonResponse.for(res).status(500).body({ message: 'Internal Server Error' }).send();
      }
    }
  }

  /**
   * @method hello
   * @description A simple hello world endpoint.
   * @param {IncomingMessage} req - The request object.
   * @param {ServerResponse} res - The response object.
   */
  @Get('/hello')
  @Security(JWTSecurity)
  public hello(req: IncomingMessage, res: ServerResponse): void {
    JsonResponse.for(res).status(200).body({ message: 'Hello, world!' }).send();
  }

  /**
   * @method getQueryParams
   * @description Gets the query parameters from the request.
   * @param {object} queryParams - The query parameters.
   * @param {IncomingMessage} req - The request object.
   * @param {ServerResponse} res - The response object.
   */
  @Get('/query-params')
  public getQueryParams(@QueryParams() queryParams: object, req: IncomingMessage, res: ServerResponse): void {
    JsonResponse.for(res).status(200).body(queryParams).send();
  }
}