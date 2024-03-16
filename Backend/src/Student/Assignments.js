const { readDB } = require("../db/mongoOperations");
const { assignmentSchema } = require("../db/schema");
const { GetProfessor } = require('../other/Common');
const { GetPublicQuestionDetails } = require("./Question");
const { EvaluateQuestion } = require("../Code/codeEvaluation");
const e = require("express");
// This function is used to get the Pending assignments for the student, which are not submitted yet and are due
function getStudentPendingAssignmentsRoute(req, res) {

    Querry = {
        Batches: { $in: req.decoded.DB.Batch },     // Batch should be in the list of batches
        Year: req.decoded.DB.Year,                  // Year should be same as the student's year
        DueTimestamp: { $gte: new Date() },         // Due date should be greater than or equal to current date
        SubmittedBy: { $nin: req.decoded._id }      // Student should not be in the list of submitted students
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

// This function is used to check if the assignmentId is provided in the request
function ValidateAssignmentId(ws, req, next) {

    ws.send(JSON.stringify({
        success: true,
        message: `Validating assignmentId ${req.params.assignmentId}`,
        type: `logs`
    }));

    if (req.params.assignmentId == undefined) {
        ws.send(JSON.stringify({
            success: false,
            message: `assignmentId Not provided`,
            type: `logs`
        }), () => {
            ws.close(1008);  //1008 is the status code for Policy Violation
        });
        return;
    }
    else {
        next();
    }
}

// This function is used to find the assignment with the given assignmentId from the database
async function FindAssignment(ws, req, next) {

    ws.send(JSON.stringify({
        success: true,
        message: `Fetching Assignment with id ${req.params.assignmentId}`,
        type: `logs`
    }));

    let Querry = {
        _id: req.params.assignmentId
    }

    try {
        let data = await readDB("Assignments", req.decoded.Institution, Querry, assignmentSchema);
        if (data.length > 0) {
            req.Assignment = data[0];
            next();
        }
        else {
            ws.send(JSON.stringify({
                success: false,
                message: `Assignment not found`,
                type: `logs`
            }), () => {
                ws.close(1008);  //1008 is the status code for Policy Violation
            });
        }
    } catch (error) {
        ws.send(JSON.stringify({
            success: false,
            message: `Failed to fetch Assignment, err : ${error.message}`,
            type: `logs`
        }), () => {
            ws.close(1008);  //1008 is the status code for Policy Violation
        });
    }
}

//This function is used to check if the questions are present in the assignment
async function ValidateQuestionsInAssignment(ws, req, next) {

    ws.send(JSON.stringify({
        success: true,
        message: `Checking if questions are present in the assignment`,
        type: `logs`
    }));

    if (req.Assignment.Questions.length === 0) {
        ws.send(JSON.stringify({
            success: false,
            message: `No questions present in the assignment`,
            type: `logs`
        }), () => {
            ws.close(1008);  //1008 is the status code for Policy Violation
        });
        return;
    }
    else {
        let Questions = []
        for (let i = 0; i < req.Assignment.Questions.length; i++) {
            try {
                let thisQuestion = await readDB("QuestionBank", req.decoded.Institution, { _id: req.Assignment.Questions[i] });
                if (thisQuestion.length === 0) {
                    Questions.push({});
                } else {
                    Questions.push(thisQuestion[0]);
                }
            } catch (err) {
                console.log(err);
                Questions.push({});
            }
        }
        req.Assignment.Questions = Questions;
        next();
    }
}
//This function is used to check if the student is allowed to submit the assignment
async function CheckIfAllowedToSubmit(ws, req, next) {
    ws.send(JSON.stringify({
        success: true,
        message: `Checking if allowed to submit assignment`,
        type: `logs`
    }));
    console.log(req.Assignment)
    if (req.Assignment.SubmittedBy.includes(req.decoded._id)) {
        ws.send(JSON.stringify({
            success: false,
            message: `You have already submitted this assignment`,
            type: `logs`
        }), () => {
            ws.close(1008);  //1008 is the status code for Policy Violation
        });
        return;
    }
    if (req.Assignment.DueTimestamp < new Date()) {
        ws.send(JSON.stringify({
            success: false,
            message: `Assignment is already over`,
            type: `logs`
        }), () => {
            ws.close(1008);  //1008 is the status code for Policy Violation
        });
        return;
    }
    if (!(req.Assignment.Batches.includes(req.decoded.DB.Batch) && req.Assignment.Year == req.decoded.DB.Year)) {
        ws.send(JSON.stringify({
            success: false,
            message: `This Asignment is not assigned to you.`,
            type: `logs`
        }), () => {
            ws.close(1008);  //1008 is the status code for Policy Violation
        });
        return;
    }
    next();
}


async function EvaluateAssignment(ws, req) {

    ws.send("start");

    ws.on("message", async (msg) => {
        try {
            let data = JSON.parse(msg);
            console.log(data);
            //data.solutionCodes is an array of code written by the student for each question
            if (data.solutionCodes.length === req.Assignment.Questions.length) {
                console.log(req.Assignment);
                let result = [];
                for (let i = 0; i < req.Assignment.Questions.length; i++) {
                    console.log(req.Assignment.Questions[i])
                    let result = await EvaluateQuestion(ws, req.Assignment.Questions[i], data.solutionCodes[i]);
                    if (result === undefined) {
                        result.push({
                            SubmittedCode: data.solutionCodes[i],
                            QuestionId: req.Assignment.Questions[i]._id,
                            ScoreObtained: 0,
                            TotalScore: req.Assignment.Questions[i].TestCases.length + (req.Assignment.Questions[i].RandomTestChecked ? 1 : 0),
                        })
                    }
                    else {
                        result.push({
                            SubmittedCode: data.solutionCodes[i],
                            QuestionId: req.Assignment.Questions[i]._id,
                            ScoreObtained: result.ScoreObtained,
                            TotalScore: result.TotalScore,
                        })
                    }
                }
            }
            else {
                ws.send(JSON.stringify({
                    success: false,
                    message: `Question count mismatch, expected ${req.Assignment.Questions.length}, got ${data.solutionCodes.length}`,
                    type: `logs`
                }), () => {
                    ws.close(1008);  //1008 is the status code for Policy Violation
                });
            }
        } catch (err) {
            console.log(err);
            ws.send(JSON.stringify({
                success: false,
                message: `Failed to parse message, err : ${err.message}`,
                type: `logs`
            }), () => {
                ws.close(1008);  //1008 is the status code for Policy Violation
            });
        }
    });

}



module.exports = { getStudentPendingAssignmentsRoute, getStudentSubmittedAssignmentsRoute, getStudentMissedAssignmentsRoute, getThisPendingAssignment, ValidateAssignmentId, FindAssignment, CheckIfAllowedToSubmit, ValidateQuestionsInAssignment, EvaluateAssignment };
