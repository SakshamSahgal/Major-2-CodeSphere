const {readDB} = require('../db/mongoOperations')
const {professorsSchema} = require('../db/schema')

async function GetProfessor(id, college) {
    //read the professor from the database
    // return the professor object from the database Excluding Password
    if (!id || !college) {
        return {}
    }
    try {
        const thisProfessor = await readDB("Professors", college, { _id: id }, professorsSchema)

        if (thisProfessor.length > 0) {
            //return the professor object from the database Excluding Password
            return { Name: thisProfessor[0].Name }
        }
        else
            return {}
    }
    catch (error) {
        return {}
    }
}

module.exports = { GetProfessor}