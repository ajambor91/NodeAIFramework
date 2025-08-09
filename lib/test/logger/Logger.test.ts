import { Logger } from '../../logger/Logger';

/**
 * @fileoverview This file contains the test suite for the Logger class.
 */
describe('Logger', () => {
  let logger: Logger;
  let consoleLogSpy: jest.SpyInstance;

  /**
   * @description This function is executed before each test case.
   */
  beforeEach(() => {
    logger = Logger.getInstance();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  /**
   * @description This function is executed after each test case.
   */
  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  /**
   * @description This test case verifies that the getInstance method returns the same instance.
   */
  it('should return the same instance', () => {
    const anotherLogger = Logger.getInstance();
    expect(logger).toBe(anotherLogger);
  });

  /**
   * @description This test case verifies that a debug message is logged.
   */
  it('should log a debug message', () => {
    logger.debug('test message');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[DEBUG] test message'));
  });

  /**
   * @description This test case verifies that an info message is logged.
   */
  it('should log an info message', () => {
    logger.info('test message');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO] test message'));
  });

  /**
   * @description This test case verifies that a warning message is logged.
   */
  it('should log a warn message', () => {
    logger.warn('test message');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[WARN] test message'));
  });

  /**
   * @description This test case verifies that an error message is logged.
   */
  it('should log an error message', () => {
    logger.error('test message');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR] test message'));
  });

  /**
   * @description This test case verifies that a critical message is logged.
   */
  it('should log a critical message', () => {
    logger.critical('test message');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[CRITICAL] test message'));
  });
});