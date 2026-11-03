/**
 * Marketing MongoDB (server only). Env: MONGODB_URI (connection string, includes the credentials), MONGODB_DB.
 * One client per server process, reused across requests (kept on `global` so dev reloads don't open new ones).
 */
import { MongoClient } from 'mongodb';

function client() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  global.__gtcMongo ??= new MongoClient(uri, { serverSelectionTimeoutMS: 8000 }).connect().catch((err) => {
    global.__gtcMongo = undefined;
    throw err;
  });
  return global.__gtcMongo;
}

/** A collection of the MONGODB_DB database. */
export async function collection(name) {
  return (await client()).db(process.env.MONGODB_DB).collection(name);
}
