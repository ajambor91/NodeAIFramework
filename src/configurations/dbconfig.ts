import dotenv from 'dotenv';

dotenv.config();

/**
 * @const dbConfig
 * @description The database connection configuration.
 */
export const dbConfig = {
    url: process.env.MONGO_URI || 'mongodb://localhost:27017/test',
};