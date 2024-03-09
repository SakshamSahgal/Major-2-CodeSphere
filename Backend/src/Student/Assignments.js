const { readDB } = require("../db/mongoOperations");
const { assignmentSchema } = require("../db/schema");
const { GetProfessor } = require('../other/Common');
const { GetPublicQuestionDetails } = require("./Question");
// This function is used to get the Pending assignments for the student, which are not submitted yet and are due
function getStudentPendingAssignmentsRoute(req, res) {

    Querry = {
        Batches: { $in: req.decoded.DB.Batch },     // Batch should be in the list of batches
        Year: req.decoded.DB.Year,                  // Year should be same as the student's year
        DueTimestamp: { $gte: new Date() }          // Due date should be greater than or equal to current date
    }

    // Query the Assignments collection based on batch, year, and due date
    readDB("Assignments", req.decoded.Institution, Querry, assignmentSchema)

        .then(async (data) => {

            //iterate through the assignments and get the professor details for each assignment
            await Promise.all(data.map(async (assignment) => {
                let thisProfessor = await GetProfessor(assignment.PostedBy, req.decoded.Institution);
                assignment.PostedBy = thisProfessor;
            }));

            res.status(200).json({
                success: true,
                message: "Pending Assignments fetched successfully",
                Assignments: data,
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: `Failed to fetch Pending Assignments, err : ${error.message}`,
            });
        });
}

// This function is used to get the submitted assignments for the student
function getStudentSubmittedAssignmentsRoute(req, res) {

    Querry = {
        Batches: { $in: req.decoded.DB.Batch },     // Batch should be in the list of batches
        Year: req.decoded.DB.Year,                  // Year should be same as the student's year
        SubmittedBy: { $in: req.decoded._id }       // Student should be in the list of submitted students
    }

    readDB("Assignments", req.decoded.Institution, Querry, assignmentSchema)
        .then(async (data) => {

            //iterate through the assignments and get the professor details for each assignment
            await Promise.all(data.map(async (assignment) => {
                let thisProfessor = await GetProfessor(assignment.PostedBy, req.decoded.Institution);
                assignment.PostedBy = thisProfessor;
            }));

            res.status(200).json({
                success: true,
                message: "Submitted Assignments fetched successfully",
                Assignments: data,
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: `Failed to fetch Submitted Assignments, err : ${error.message}`,
            });
        });
}

// This function is used to get the missed assignments for the student
function getStudentMissedAssignmentsRoute(req, res) {

    Querry = {
        Batches: { $in: req.decoded.DB.Batch },     // Batch should be in the list of batches
        Year: req.decoded.DB.Year,                  // Year should be same as the student's year
        DueTimestamp: { $lt: new Date() },          // Due date should be less than current date
        SubmittedBy: { $nin: req.decoded._id }      // Student should not be in the list of submitted students
    }

    readDB("Assignments", req.decoded.Institution, Querry, assignmentSchema)
        .then(async (data) => {
            //iterate through the assignments and get the professor details for each assignment
            await Promise.all(data.map(async (assignment, index) => {
                let thisProfessor = await GetProfessor(assignment.PostedBy, req.decoded.Institution);
                assignment.PostedBy = thisProfessor;
            }));
            res.status(200).json({
                success: true,
                message: "Missed Assignments fetched successfully",
                Assignments: data,
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: `Failed to fetch Missed Assignments, err : ${error.message}`,
            });
        });
}

function getThisPendingAssignment(req, res) {

    let Querry = {
        _id: req.params._id,                     // The assignment id should be the same as the one in the request
        Year: req.decoded.DB.Year,              // This Student's year should be same as the assignment's year
        Batches: { $in: req.decoded.DB.Batch },  // This Student's batch should be in the list of batches
        SubmittedBy: { $nin: req.decoded._id }, // This Student should not be in the list of submitted students
        DueTimestamp: { $gte: new Date() }      // Due date should be greater than or equal to current date, so that the assignment is still pending
    }


    readDB("Assignments", req.decoded.Institution, Querry, assignmentSchema)
        .then(async (data) => {
            console.log(data);
            if (data.length > 0) {
                let thisProfessor = await GetProfessor(data[0].PostedBy, req.decoded.Institution);
                data[0].PostedBy = thisProfessor;

                //iterate through all the question of this assignment and get the public details of each question

                let thisQuestionPublicDetailsArray = [];

                await Promise.all(data[0].Questions.map(async (questionid, index) => {
                    let thisQuestionPublicDetails = await GetPublicQuestionDetails(questionid, req.decoded.Institution);
                    thisQuestionPublicDetails.TestCases = thisQuestionPublicDetails.TestCases.filter(testcase => testcase.sampleTestCase); //only send the sample testcases to the student
                    thisQuestionPublicDetailsArray.push(thisQuestionPublicDetails);
                }));

                data[0].Questions = thisQuestionPublicDetailsArray;

                res.status(200).json({
                    success: true,
                    message: "Assignment fetched successfully",
                    Assignment: data[0],
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "Assignment not found",
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: `Failed to fetch Assignment, err : ${error.message}`,
            });
        });
}



module.exports = { getStudentPendingAssignmentsRoute, getStudentSubmittedAssignmentsRoute, getStudentMissedAssignmentsRoute, getThisPendingAssignment };
