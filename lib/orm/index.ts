import { MongoClient, Db } from 'mongodb';
import { DbConnectionConfig } from '../types/db';

let db: Db;

/**
 * @function connectDB
 * @description Connects to the MongoDB database.
 * @param {DbConnectionConfig} config - The database connection configuration.
 */
export const connectDB = async (config: DbConnectionConfig) => {
    try {
        const client = new MongoClient(config.url, config.options);
        await client.connect();
        db = client.db(config.dbName);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Could not connect to MongoDB', error);
        process.exit(1);
    }
};

/**
 * @function getDB
 * @description Gets the database instance.
 * @returns {Db} The database instance.
 */
export const getDB = (): Db => {
    if (!db) {
        throw new Error('DB not initialized');
    }
    return db;
};