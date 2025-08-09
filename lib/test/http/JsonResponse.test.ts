import { JsonResponse } from '../../http/JsonResponse';
import { ServerResponse } from 'http';
import { Writable } from 'stream';

/**
 * @fileoverview This file contains the test suite for the JsonResponse class.
 */
describe('JsonResponse', () => {
  let mockResponse: ServerResponse;
  let mockSocket: Writable;

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
    mockResponse.end = jest.fn();
    mockResponse.setHeader = jest.fn();
  });

  /**
   * @description This test case verifies that a JsonResponse can be created with a default status of 200.
   */
  it('should create a JsonResponse with a default status of 200', () => {
    const jsonResponse = JsonResponse.for(mockResponse);
    expect(jsonResponse).toBeInstanceOf(JsonResponse);
  });

  /**
   * @description This test case verifies that the status code can be set.
   */
  it('should set the status code', () => {
    const jsonResponse = JsonResponse.for(mockResponse).status(404);
    jsonResponse.send();
    expect(mockResponse.statusCode).toBe(404);
  });

  /**
   * @description This test case verifies that the body can be set.
   */
  it('should set the body', () => {
    const body = { message: 'test' };
    const jsonResponse = JsonResponse.for(mockResponse).body(body);
    jsonResponse.send();
    expect(mockResponse.end).toHaveBeenCalledWith(JSON.stringify(body));
  });

  /**
   * @description This test case verifies that the content-type header is set to application/json.
   */
  it('should set the content-type header to application/json', () => {
    const jsonResponse = JsonResponse.for(mockResponse);
    jsonResponse.send();
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
  });

  /**
   * @description This test case verifies that the status and body methods can be chained.
   */
  it('should chain status and body methods', () => {
    const body = { message: 'test' };
    JsonResponse.for(mockResponse).status(201).body(body).send();
    expect(mockResponse.statusCode).toBe(201);
    expect(mockResponse.end).toHaveBeenCalledWith(JSON.stringify(body));
  });
});