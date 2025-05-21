import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGO_DB_URI as string

if (!MONGODB_URI) {
    throw new Error('Mongo DB uri is not defined')
}

interface MongooseCache {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache;
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = {conn: null, promise: null}
}

const dbConnect = async (): Promise<Mongoose>  => {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: 'Bunker'
        })
            .then((result) => {
                console.log('Connected to MongoDb')
                return result
            }).catch((error) => {
                console.error("Error connection to MongoDb", error)
                throw error
            })
    }

    cached.conn = await cached.promise

    return cached.conn
}

export default dbConnect