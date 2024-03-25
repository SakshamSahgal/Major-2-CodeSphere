const { readDB } = require('../db/mongoOperations')
const { professorsSchema } = require('../db/schema')

async function GetProfessor(id, college) {
    //read the professor from the database
    // return the professor name from the database
    if (!id || !college) {
        return {}
    }
    try {

        let projection = { Name: 1 }

        const thisProfessor = await readDB("Professors", college, { _id: id }, professorsSchema, projection)

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

async function GetStudent(id, college) {
    //read the student from the database
    // return the student name from the database
    if (!id || !college) {
        return {}
    }
    try {

        let projection = { Name: 1 }

        const thisStudent = await readDB("Students", college, { _id: id }, professorsSchema, projection)

        if (thisStudent.length > 0) {
            //return the student object from the database Excluding Password
            return { Name: thisStudent[0].Name }
        }
        else
            return {}
    }
    catch (error) {
        return {}
    }
}

module.exports = { GetProfessor, GetStudent }