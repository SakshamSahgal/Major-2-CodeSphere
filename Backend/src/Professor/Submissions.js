const { readDB, checkIfExists } = require("../db/mongoOperations");
const { SubmitAssignmentsSchema, assignmentSchema } = require("../db/schema");
const { GetStudent, getQuestionName } = require('../other/Common')

async function CheckAssignment(req, res, next) {
    const assignmentId = req.params._id;
    try {
        let findQuery = { _id: assignmentId };
        let assignmentExist = await checkIfExists("Assignments", req.decoded.Institution, findQuery, assignmentSchema)

        if (!assignmentExist) {
            res.status(404).json({
                success: false,
                message: "Assignment not found"
            });
            return;
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: `Internal Server Error, err: ${err}`
        });
    }
}

async function getSubmissions(req, res) {
    const assignmentId = req.params._id;
    try {
        let findQuery = { AssignmentId: assignmentId };
        let Projection = {
            Submission: 0,
            __v: 0,
        }
        let submissions = await readDB("AssignmentSubmissions", req.decoded.Institution, findQuery, SubmitAssignmentsSchema, Projection);

        //iterate over the submissions and fetch student details from student

        for (let i = 0; i < submissions.length; i++) {
            let thisStudent = await GetStudent(submissions[i].StudentId, req.decoded.Institution)
            submissions[i].Student = thisStudent
        }

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submissions
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: `Internal Server Error, err: ${err}`
        });
    }
}

async function analyzeSubmission(req, res) {
    const SubmissionId = req.params._id;

    try {
        let findQuery = { _id: SubmissionId };

        let Projection = {
            __v: 0,
        }

        let submission = await readDB("AssignmentSubmissions", req.decoded.Institution, findQuery, SubmitAssignmentsSchema, Projection);

        if (submission.length == 0) {
            res.status(404).json({
                success: false,
                message: "Submission not found"
            });
            return;
        }

        let thisSubmission = submission[0];

        //fetch student details from student

        let thisStudent = await GetStudent(thisSubmission.StudentId, req.decoded.Institution)
        thisSubmission.Student = thisStudent

        let Submissions = JSON.parse(JSON.stringify(thisSubmission.Submission)); //creating a deep copy of the submissions array so that i can add the Question name to it
        //iterate over all the questions and find there name

        for (let i = 0; i < thisSubmission.Submission.length; i++) {
            //fetching the question name using QuestionId from QuestionBank
            let thisQuestion = await getQuestionName(thisSubmission.Submission[i].QuestionId, req.decoded.Institution);
            Submissions[i].Question = thisQuestion;
        }

        thisSubmission.Submission = Submissions;


        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submission: thisSubmission
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: `Internal Server Error, err: ${err}`
        });
    }
}

module.exports = { CheckAssignment, getSubmissions, analyzeSubmission };