import { UserController } from '../../controllers/UserController';
import { UserService } from '../../services/UserService';
import { JsonResponse } from '../../../lib/http/JsonResponse';
import { IncomingMessage, ServerResponse } from 'http';
import { Writable } from 'stream';

jest.mock('../../services/UserService');
jest.mock('../../../lib/http/JsonResponse');

/**
 * @fileoverview This file contains the test suite for the UserController class.
 */
describe('UserController', () => {
  let userController: UserController;
  let mockUserService: jest.Mocked<UserService>;
  let mockResponse: ServerResponse;
  let mockSocket: Writable;
  let mockJsonResponse: jest.Mocked<JsonResponse>;

  /**
   * @description This function is executed before each test case.
   */
  beforeEach(() => {
    mockSocket = new Writable();
    mockResponse = new ServerResponse({
        method: 'GET',
        httpVersion: '1.1',
        headers: {},
        socket: mockSocket,
    } as any);
    mockUserService = new (UserService as any)();
    userController = new UserController(mockUserService);
    mockJsonResponse = {
      status: jest.fn().mockReturnThis(),
      body: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;
    (JsonResponse.for as jest.Mock).mockReturnValue(mockJsonResponse);
  });

  /**
   * @description This test case verifies that all users can be retrieved.
   */
  it('should get all users', async () => {
    const users = [{ id: '1', email: 'test@test.com' }];
    mockUserService.findAll.mockResolvedValue(users as any);
    await userController.index({} as IncomingMessage, mockResponse);
    expect(mockJsonResponse.status).toHaveBeenCalledWith(200);
    expect(mockJsonResponse.body).toHaveBeenCalledWith(users);
    expect(mockJsonResponse.send).toHaveBeenCalled();
  });

  /**
   * @description This test case verifies that a user can be registered.
   */
  it('should register a user', async () => {
    const user = { email: 'test@test.com', password: 'password1' };
    mockUserService.createUser.mockResolvedValue(user as any);
    await userController.register(user, {} as IncomingMessage, mockResponse);
    expect(mockJsonResponse.status).toHaveBeenCalledWith(201);
    expect(mockJsonResponse.body).toHaveBeenCalledWith(user);
    expect(mockJsonResponse.send).toHaveBeenCalled();
  });

  /**
   * @description This test case verifies that a user can be logged in.
   */
  it('should login a user', async () => {
    const user = { email: 'test@test.com', password: 'password1' };
    const loginResult = { user: { _id: '1', email: 'test@test.com', createdAt: new Date().toISOString() }, jwt: 'token' };
    mockUserService.login.mockResolvedValue(loginResult);
    await userController.login(user, {} as IncomingMessage, mockResponse);
    expect(mockJsonResponse.status).toHaveBeenCalledWith(200);
    expect(mockJsonResponse.body).toHaveBeenCalledWith(loginResult);
    expect(mockJsonResponse.send).toHaveBeenCalled();
  });

  /**
   * @description This test case verifies that a user can be retrieved by their ID.
   */
  it('should get a user by id', async () => {
    const user = { id: '1', email: 'test@test.com' };
    mockUserService.getUserById.mockResolvedValue(user as any);
    await userController.getUserById('1', {} as IncomingMessage, mockResponse);
    expect(mockJsonResponse.status).toHaveBeenCalledWith(200);
    expect(mockJsonResponse.body).toHaveBeenCalledWith(user);
    expect(mockJsonResponse.send).toHaveBeenCalled();
  });

  /**
   * @description This test case verifies that the hello endpoint returns a "Hello, world!" message.
   */
  it('should say hello', () => {
    userController.hello({} as IncomingMessage, mockResponse);
    expect(mockJsonResponse.status).toHaveBeenCalledWith(200);
    expect(mockJsonResponse.body).toHaveBeenCalledWith({ message: 'Hello, world!' });
    expect(mockJsonResponse.send).toHaveBeenCalled();
  });

  /**
   * @description This test case verifies that the query parameters are returned.
   */
  it('should return query params', () => {
    const query = { foo: 'bar' };
    userController.getQueryParams(query, {} as IncomingMessage, mockResponse);
    expect(mockJsonResponse.status).toHaveBeenCalledWith(200);
    expect(mockJsonResponse.body).toHaveBeenCalledWith(query);
    expect(mockJsonResponse.send).toHaveBeenCalled();
  });
});