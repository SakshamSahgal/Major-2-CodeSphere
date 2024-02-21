const { readDB } = require("../db/mongoOperations");
const { assignmentSchema, registeredCollegesSchema, QuestionSchema } = require("../db/schema");


function getProfessorAssignmentsRoute(req, res) {
    Querry = {
        PostedBy: req.decoded._id //only the assignments posted by this professor will be fetched
    }

    readDB("Assignments", req.decoded.Institution, Querry, assignmentSchema)

        .then(async (data) => {

            res.status(200).json({
                success: true,
                message: "Assignments fetched successfully",
                Assignments: data,
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: `Failed to fetch Assignments, err : ${error.message}`,
            });
        });
}


function getBatchesRoute(req, res) {

    readDB("Colleges", "Registered", { Name: req.decoded.Institution }, registeredCollegesSchema).then((data) => {
        if (data.length === 0) {
            res.status(404).json({
                success: false,
                message: "College not found",
            });
            return;
        }
        else {
            res.status(200).json({
                success: true,
                message: "Batches fetched successfully",
                Batches: data[0].Batches,
            });
        }
    }).catch((error) => {
        res.status(500).json({
            success: false,
            message: `Failed to fetch Batches, err : ${error.message}`,
        });
    });
}

function getMyQuestionsRoute(req, res) {

    Querry = {
        CreatedBy: req.decoded._id //only the questions posted by this professor will be fetched
    }

    readDB("QuestionBank", req.decoded.Institution, Querry, QuestionSchema)

        .then(async (data) => {
            res.status(200).json({
                success: true,
                message: "Questions fetched successfully",
                Questions: data,
            });
        })
        .catch((error) => {
            //status 500 is for internal server error
            res.status(500).json({
                success: false,
                message: `Failed to fetch Questions, err : ${error.message}`,
            });
        });
}

function getOtherQuestionsRoute(req, res) {

    Querry = {
        CreatedBy: { $ne: req.decoded._id } //only the questions posted by other professors will be fetched
    }

    readDB("QuestionBank", req.decoded.Institution, Querry, QuestionSchema)

        .then(async (data) => {
            res.status(200).json({
                success: true,
                message: "Questions fetched successfully",
                Questions: data,
            });
        })
        .catch((error) => {
            //status 500 is for internal server error
            res.status(500).json({
                success: false,
                message: `Failed to fetch Questions, err : ${error.message}`,
            });
        });
}

module.exports = { getProfessorAssignmentsRoute, getBatchesRoute, getMyQuestionsRoute, getOtherQuestionsRoute };