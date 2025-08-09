"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDB = exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("./config");
let db;
const connectDB = async () => {
    try {
        const client = new mongodb_1.MongoClient(config_1.dbConfig.url);
        await client.connect();
        db = client.db();
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Could not connect to MongoDB', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const getDB = () => {
    if (!db) {
        throw new Error('DB not initialized');
    }
    return db;
};
exports.getDB = getDB;
