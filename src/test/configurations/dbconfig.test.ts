import { dbConfig } from '../../configurations/dbconfig';

/**
 * @fileoverview This file contains the test suite for the database configuration.
 */
describe('DB Config', () => {
  const originalMongoUri = process.env.MONGO_URI;

  /**
   * @description This function is executed after each test case.
   */
  afterEach(() => {
    process.env.MONGO_URI = originalMongoUri;
  });

  /**
   * @description This test case verifies that the default mongo uri is used if the MONGO_URI environment variable is not set.
   */
  it('should use the default mongo uri if MONGO_URI is not set', () => {
    delete process.env.MONGO_URI;
    // We need to re-import the module to get the new config
    jest.resetModules();
    const { dbConfig } = require('../../configurations/dbconfig');
    expect(dbConfig.url).toBe('mongodb://localhost:27017/test');
  });

  /**
   * @description This test case verifies that the MONGO_URI environment variable is used if it is set.
   */
  it('should use the MONGO_URI environment variable if it is set', () => {
    process.env.MONGO_URI = 'mongodb://test:27017/test';
    jest.resetModules();
    const { dbConfig } = require('../../configurations/dbconfig');
    expect(dbConfig.url).toBe('mongodb://test:27017/test');
  });
});