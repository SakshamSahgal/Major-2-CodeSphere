const mongoose = require('mongoose');
let connections = {};

async function connectDB() {
    try {
        const databaseNames = ['Assignments', 'Colleges', 'Professors', 'QuestionBank', 'Students', 'Evaluations', "AssignmentSubmissions", "EvaluationSubmissions"];

        for (let i = 0; i < databaseNames.length; i++) {
            const DBconnectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.882kcr0.mongodb.net/${databaseNames[i]}?retryWrites=true&w=majority`;

            const connection = await mongoose.createConnection(DBconnectionString);

            connection.on('connected', () => {
                connections[databaseNames[i]] = connection;
                console.log(`Connected to ${databaseNames[i]} database Successfully!`);
            });

            connection.on('error', (error) => {
                console.error(`Failed to connect to ${databaseNames[i]} database:`, error);
            });
        }
    } catch (error) {
        console.error('Error connecting to the databases:', error);
    }
}


async function writeDB(databaseName, collectionName, data, schema) {
    try {
        const thisModel = connections[databaseName].model(collectionName, schema, collectionName);
        await thisModel.create(data)
        console.log(`Data written to ${collectionName} collection in ${databaseName} database`);
    } catch (error) {
        console.error(`Error writing to the database: ${databaseName} collection : ${collectionName}, error : `, error);
        throw error; // Rethrow the error to handle it where writeDB is called
    }
}

async function readDB(databaseName, collectionName, query, schema) {
    try {
        const thisModel = connections[databaseName].model(collectionName, schema, collectionName);
        const data = await thisModel.find(query);

        // Validate data against the schema
        data.forEach((document) => {
            const validationResult = thisModel.validate(document);
            if (validationResult.error) {
                console.error(`Validation error for document in ${collectionName} collection in ${databaseName} database:`, validationResult.error);
                throw new Error(`Data validation failed for document in ${collectionName} collection`);
            }
        });

        console.log(`Data read from ${collectionName} collection in ${databaseName} database`);
        return data;
    } catch (error) {
        console.error(`Error reading from the database: ${databaseName} collection: ${collectionName}, error: `, error);
        throw error; // Rethrow the error to handle it where readDB is called
    }
}

async function updateDB(databaseName, collectionName, FindQuerry, UpdateQuerry, schema) {
    try {
        const thisModel = connections[databaseName].model(collectionName, schema, collectionName);
        const data = await thisModel.updateOne(FindQuerry, UpdateQuerry)
        console.log(`Data updated in ${collectionName} collection in ${databaseName} database`);
        return data;
    } catch (error) {
        console.error(`Error updating the database: ${databaseName} collection : ${collectionName}, error : `, error);
        throw error; // Rethrow the error to handle it where updateDB is called
    }
}

async function deleteDB(databaseName, collectionName, query, schema) {
    try {
        const thisModel = connections[databaseName].model(collectionName, schema, collectionName);
        const data = await thisModel.deleteOne(query)
        console.log(`Data deleted from ${collectionName} collection in ${databaseName} database`);
        return data;
    } catch (error) {
        console.error(`Error deleting from the database: ${databaseName} collection : ${collectionName}, error : `, error);
        throw error; // Rethrow the error to handle it where deleteDB is called
    }
}


module.exports = { connectDB, writeDB, readDB, updateDB, deleteDB };