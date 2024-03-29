const { readDB } = require("../db/mongoOperations");
const { QuestionSchema } = require("../db/schema");
const { GetProfessor } = require('../other/Common');

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
        // console.log(response);
        if (response.length === 0)
            return {};
        else {
            response[0].TestCases = response[0].TestCases.filter(testcase => testcase.sampleTestCase); //only send the sample testcases to the student
            response[0].CreatedBy = await GetProfessor(response[0].CreatedBy, Institution);
            return response[0];
        }
    }
    catch (error) {
        console.log(`Failed to fetch Question Details, err : ${error.message}`)
        return {};
    }

}

async function FetchPublicQuestionDetails(req, res) {

    try {
        let response = await GetPublicQuestionDetails(req.params._id, req.decoded.Institution)
        if (response != {}) {
            res.status(200).json({
                success: true,
                message: "Question's Public Details fetched successfully",
                Question: response
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Internal Server Error, err: ${error}`
        });
    }
}

module.exports = { GetPublicQuestionDetails, FetchPublicQuestionDetails };