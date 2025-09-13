const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/'; // Use your actual connection string
const dbName = 'Colleges';
const collectionName = 'Registered';

async function test() {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const data = await db.collection(collectionName).find({}).toArray();
    console.log("Data in Colleges.Registered:", data);
    await client.close();
}

test();