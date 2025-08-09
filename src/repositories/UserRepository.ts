import { Repository } from '../../lib/di/di';
import { User } from '../types/user';
import { getDB } from '../../lib/orm';
import { Collection, ObjectId } from 'mongodb';

/**
 * @class UserRepository
 * @description A repository for managing users in the database.
 */
@Repository()
export class UserRepository {
  /**
   * @method getCollection
   * @description Gets the users collection from the database.
   * @returns {Collection<User>} The users collection.
   */
  private getCollection(): Collection<User> {
    return getDB().collection<User>('users');
  }

  /**
   * @method findAll
   * @description Finds all users in the database.
   * @returns {Promise<User[]>} A list of all users.
   */
  public async findAll(): Promise<User[]> {
    return this.getCollection().find().toArray();
  }

  /**
   * @method save
   * @description Saves a new user to the database.
   * @param {Omit<User, '_id' | 'createdAt'>} user - The user to save.
   * @returns {Promise<ObjectId>} The ID of the newly created user.
   */
  public async save(user: Omit<User, '_id' | 'createdAt'>): Promise<ObjectId> {
    const result = await this.getCollection().insertOne({
      ...user,
      _id: new ObjectId(),
      createdAt: new Date(),
    });
    return result.insertedId;
  }

  /**
   * @method findByEmail
   * @description Finds a user by their email address.
   * @param {string} email - The email address to search for.
   * @returns {Promise<User | null>} The user if found, otherwise null.
   */
  public async findByEmail(email: string): Promise<User | null> {
    return this.getCollection().findOne({ email });
  }

  /**
   * @method findById
   * @description Finds a user by their ID.
   * @param {string} id - The ID of the user to find.
   * @returns {Promise<User | null>} The user if found, otherwise null.
   */
  public async findById(id: string): Promise<User | null> {
    return this.getCollection().findOne({ _id: new ObjectId(id) });
  }
}