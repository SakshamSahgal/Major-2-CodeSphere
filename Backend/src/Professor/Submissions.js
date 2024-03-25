const { readDB, checkIfExists } = require("../db/mongoOperations");
const { SubmitAssignmentsSchema, assignmentSchema } = require("../db/schema");
const { GetStudent } = require('../other/Common')

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
        
        if(submission.length == 0){
            res.status(404).json({
                success: false,
                message: "Submission not found"
            });
            return;
        }

        //iterate over the submissions and fetch student details from student

        for (let i = 0; i < submission.length; i++) {
            let thisStudent = await GetStudent(submission[i].StudentId, req.decoded.Institution)
            submission[i].Student = thisStudent
        }

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submission : submission[0]
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