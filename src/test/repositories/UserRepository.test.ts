import { UserRepository } from '../../repositories/UserRepository';
import { getDB } from '../../../lib/orm';
import { Collection, ObjectId } from 'mongodb';

jest.mock('../../../lib/orm');

/**
 * @fileoverview This file contains the test suite for the UserRepository class.
 */
describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockCollection: jest.Mocked<Collection>;

  /**
   * @description This function is executed before each test case.
   */
  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnValue({
        toArray: jest.fn(),
      }),
      insertOne: jest.fn(),
      findOne: jest.fn(),
    } as any;
    (getDB as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    });
    userRepository = new UserRepository();
  });

  /**
   * @description This test case verifies that all users can be found.
   */
  it('should find all users', async () => {
    const users = [{ _id: new ObjectId(), email: 'test@test.com' }];
    (mockCollection.find().toArray as jest.Mock).mockResolvedValue(users);
    const result = await userRepository.findAll();
    expect(result).toEqual(users);
  });

  /**
   * @description This test case verifies that a user can be saved.
   */
  it('should save a user', async () => {
    const user = { email: 'test@test.com', hashedPassword: 'hash', salt: 'salt' };
    const insertedId = new ObjectId();
    mockCollection.insertOne.mockResolvedValue({ insertedId } as any);
    const result = await userRepository.save(user);
    expect(result).toEqual(insertedId);
  });

  /**
   * @description This test case verifies that a user can be found by email.
   */
  it('should find a user by email', async () => {
    const user = { _id: new ObjectId(), email: 'test@test.com' };
    mockCollection.findOne.mockResolvedValue(user);
    const result = await userRepository.findByEmail('test@test.com');
    expect(result).toEqual(user);
  });

  /**
   * @description This test case verifies that a user can be found by id.
   */
  it('should find a user by id', async () => {
    const id = new ObjectId();
    const user = { _id: id, email: 'test@test.com' };
    mockCollection.findOne.mockResolvedValue(user);
    const result = await userRepository.findById(id.toHexString());
    expect(result).toEqual(user);
  });
});