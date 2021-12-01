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
        bufferCommands: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptionsExt);

    return cached.conn ??= await cached.promise;
}

interface MongoObject {
    conn: typeof mongoose;
    promise: Promise<typeof mongoose>;
}

interface ConnectOptionsExt extends mongoose.ConnectOptions {
    /** False by default. If `true`, this connection will use `createIndex()` instead of `ensureIndex()` for automatic index builds via `Model.init()`. */
    useCreateIndex?: boolean;
    /** false by default. Set to `true` to make all connections set the `useNewUrlParser` option by default */
    useNewUrlParser?: boolean;
    /** false by default. Set to `true` to make all connections set the `useUnifiedTopology` option by default */
    useUnifiedTopology?: boolean;
}

declare const global: {
    mongoose: MongoObject;
};
