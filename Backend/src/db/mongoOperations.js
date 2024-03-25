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

async function checkIfExists(databaseName, collectionName, query, schema) {
    try {
        const thisModel = connections[databaseName].model(collectionName, schema, collectionName);
        const exists = await thisModel.exists(query);
        return exists; 
        //returning the result of the exists function
        //if the document exists, it will return true, else false
    } catch (error) {
        console.error(`Error checking if document exists: ${databaseName}.${collectionName}`, error);
        throw error; // Re-throw the error for handling in the calling function
    }
}

//we dont need validation while Read because it can have projection and we can use it to get only the required fields

async function readDB(databaseName, collectionName, query, schema, projection = {}) {
    try {
        const thisModel = connections[databaseName].model(collectionName, schema, collectionName);
        const data = await thisModel.find(query, projection);

        console.log(`Data read from ${collectionName} collection in ${databaseName} database`);

        // Make mutable copies of objects before returning
        const mutableData = data.map(obj => obj._doc);

        return mutableData;
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

async function deleteIfExistsDB(databaseName, collectionName, query, schema) {
    try {
        console.log(`Attempting to delete document from ${collectionName} collection in ${databaseName} database with query:`, query);

        const thisModel = connections[databaseName].model(collectionName, schema, collectionName);
        const deletedDocument = await thisModel.findOneAndDelete(query).exec();

        if (deletedDocument) {
            console.log(`Document successfully deleted from ${collectionName} collection in ${databaseName} database`);
        } else {
            console.log(`No document found to delete from ${collectionName} collection in ${databaseName} database with query:`, query);
        }

        return deletedDocument;
    } catch (error) {
        console.error(`Error deleting document from ${collectionName} collection in ${databaseName} database:`, error);
        throw error; // Rethrow the error to handle it where deleteIfExistsDB is called
    }
}



module.exports = { connectDB, writeDB, readDB, updateDB, deleteDB, deleteIfExistsDB, checkIfExists };