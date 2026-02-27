import * as SQLite from 'expo-sqlite';

export const dbName = 'myplanner.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

// Use asynchronous initialization for expo-sqlite
export const initDB = async () => {
    if (!dbInstance) {
        dbInstance = await SQLite.openDatabaseAsync(dbName);
    }
    return dbInstance;
};

export const getDB = () => {
    if (!dbInstance) {
        throw new Error('Database not initialized. Call initDB first.');
    }
    return dbInstance;
};
