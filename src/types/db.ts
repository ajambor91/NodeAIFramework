import { MongoClientOptions } from 'mongodb';

export interface DbConnectionConfig {
    url: string;
    dbName?: string;
    options?: MongoClientOptions;
}