import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? '';

if (MONGODB_URI === '') throw new Error('Please define the MONGODB_URI environment variable inside .env.local');

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose ?? {};

export async function connect(): Promise<MongoObject['conn']> {
    cached.promise ??= mongoose.connect(MONGODB_URI, {
        bufferCommands: false
    });

    return cached.conn ??= await cached.promise;
}

interface MongoObject {
    conn: typeof mongoose;
    promise: Promise<typeof mongoose>;
}

declare const global: {
    mongoose: MongoObject;
};
