const {MongoClient} = require("mongodb");

let db;

async function connectMongo() {
    if (db) return db;

    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MongoDB_URI not set");

    const client  = new MongoClient(uri);
    await client.connect();

    db = client.db();
    console.log("MongoDB connected");
    return db;
}

function getDB(){
    if (!db) throw new Error("DB not connected");
    return db;
}

module.exports = {connectMongo, getDB};