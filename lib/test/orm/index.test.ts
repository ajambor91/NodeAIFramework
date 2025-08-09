import { connectDB, getDB } from '../../database';
import { MongoClient, Db } from 'mongodb';

jest.mock('mongodb');

const mockDb = {
  collection: jest.fn(),
} as unknown as Db;

const mockMongoClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  db: jest.fn().mockReturnValue(mockDb),
};

(MongoClient as unknown as jest.Mock).mockReturnValue(mockMongoClient);

/**
 * @fileoverview This file contains the test suite for the ORM functions.
 */
describe('ORM', () => {
  /**
   * @description This test case verifies that an error is thrown if getDB is called before connectDB.
   */
  it('should throw an error if getDB is called before connectDB', () => {
    expect(() => getDB()).toThrow('DB not initialized');
  });

  /**
   * @description This test case verifies that the database can be connected to and the db instance can be retrieved.
   */
  it('should connect to the database and return the db instance', async () => {
    await connectDB({ url: 'mongodb://localhost:27017', dbName: 'test' });
    const db = getDB();
    expect(db).toBe(mockDb);
  });
});