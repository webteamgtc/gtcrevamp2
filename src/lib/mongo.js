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
  const db = process.env.MONGODB_DB;
  if (!db) throw new Error('MONGODB_DB is not set');
  return (await client()).db(db).collection(name);
}

/** Margin Bonus applications → database `margin_bonus`, collection `bonus-form`. */
export async function marginBonusCollection() {
  const db = process.env.MONGODB_MARGIN_BONUS_DB || 'margin_bonus';
  const coll = process.env.MONGODB_MARGIN_BONUS_COLLECTION || 'bonus-form';
  return (await client()).db(db).collection(coll);
}

export async function marginBonusEmailExists(email) {
  const normalized = String(email ?? '').trim().toLowerCase();
  if (!normalized) return false;
  const coll = await marginBonusCollection();
  return Boolean(await coll.findOne({ email: normalized }, { projection: { _id: 1 } }));
}
