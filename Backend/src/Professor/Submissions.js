const { readDB, checkIfExists, deleteDB, updateDB } = require("../db/mongoOperations");
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

//this middleware is used to check if the submission exists in AssignmentSubmissions Database and Assignments
async function CheckSubmission(req, res, next) {
    let query1 = {
        StudentId: req.decoded._id, //StudentId 
        AssignmentId: req.params._id, //AssignmentId
    }
    let exists1 = await checkIfExists("AssignmentSubmissions", req.decoded.Institution, query1, SubmitAssignmentsSchema);
    if (!exists1) {
        res.status(404).send({
            success: false,
            message: "Submission not found in AssignmentSubmissions database"
        });
        return;
    }
    //submitted by is an array of student ids who have submitted the assignment
    let query2 = {
        _id: req.params._id,                        //assignment id 
        SubmittedBy: { $in: req.decoded._id }       // Student should be in the list of submitted students
    }

    let exists2 = await checkIfExists("Assignments", req.decoded.Institution, query2, assignmentSchema);
    if (!exists2) {
        res.status(404).send({
            success: false,
            message: "Submission not found in Assignments database"
        });
        return;
    }
    next();
}

async function unsubmitAssignment(req, res) {

    try {

        let deleteQuery1 = {
            StudentId: req.decoded._id, //StudentId
            AssignmentId: req.params._id, //AssignmentId
        }

        let deleteResponseFromAssignmentSubmissions = await deleteDB("AssignmentSubmissions", req.decoded.Institution, deleteQuery1);
        console.log(deleteResponseFromAssignmentSubmissions)

        // write an update query to remove req.decoded._id from SubmittedBy array in Assignments
        let updateQuery = {
            _id: req.params._id,                        //assignment id 
            SubmittedBy: { $in: req.decoded._id }       // Student should be in the list of submitted students
        }

        let update = {
            $pull: {
                SubmittedBy: req.decoded._id
            }
        }
        let updateResponseFromAssignments = await updateDB("Assignments", req.decoded.Institution, updateQuery, update);
        console.log(updateResponseFromAssignments)

        res.status(200).send({
            success: true,
            message: "Assignment Unsubmitted successfully"
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: `Internal Server Error, err: ${err}`
        });
    }
}

module.exports = { CheckAssignment, getSubmissions, analyzeSubmission, CheckSubmission, unsubmitAssignment };