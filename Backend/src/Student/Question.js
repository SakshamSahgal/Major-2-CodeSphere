const { readDB } = require("../db/mongoOperations");
const { QuestionSchema } = require("../db/schema");

//this funciton returns the public details of a question, which are visible to the students
async function GetPublicQuestionDetails(_id, Institution) {

    let Querry = {
        _id: _id,
    }

    let Projection = {
        RandomTestCode: 0,
        SolutionCode: 0,
    };
    console.log(Institution);
    try {
        let response = await readDB("QuestionBank", Institution, Querry, QuestionSchema, Projection);
        console.log(response);
        if (response.length === 0)
            return {};
        return response[0];
    }
    catch (error) {
        console.log(`Failed to fetch Question Details, err : ${error.message}`)
        return {};
    }

}

module.exports = { GetPublicQuestionDetails };