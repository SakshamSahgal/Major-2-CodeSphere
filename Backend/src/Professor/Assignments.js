const { readDB, writeDB, deleteIfExistsDB } = require("../db/mongoOperations");
const { assignmentSchema, registeredCollegesSchema, QuestionSchema } = require("../db/schema");

function getProfessorAssignmentsRoute(req, res) {
    Querry = {
        PostedBy: req.decoded._id //only the assignments posted by this professor will be fetched
    }

    //remove the PostedBy field from the projection, as it is not required
    Projection = {
        PostedBy: 0
    }

    readDB("Assignments", req.decoded.Institution, Querry, assignmentSchema, Projection)

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

    Projection = {
        QuestionName: 1,
        _id: 1,
    }

    readDB("QuestionBank", req.decoded.Institution, Querry, QuestionSchema, Projection)

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

    Projection = {
        QuestionName: 1,
        _id: 1,
    }

    Querry = {
        CreatedBy: { $ne: req.decoded._id } //only the questions posted by other professors will be fetched
    }

    readDB("QuestionBank", req.decoded.Institution, Querry, QuestionSchema, Projection)

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

function createAssignmentRoute(req, res) {

    console.log(`Recieved request to add assignment with details: `)
    console.log(req.body);

    let thisAssignment = req.body;
    thisAssignment.PostedBy = req.decoded._id;
    thisAssignment.PostedOn = new Date();

    console.log(thisAssignment)

    writeDB("Assignments", req.decoded.Institution, thisAssignment, assignmentSchema).then(() => {
        console.log("Assignment added successfully");
        res.status(200).json({
            success: true,
            message: "Assignment added successfully",
        });

    }).catch((error) => {
        res.status(500).json({
            success: false,
            message: `Failed to add Assignment, err : ${error.message}`,
        });
    });

}

async function deleteAssignmentRoute(req, res) {
    console.log(`Received request to delete assignment with id: ${req.params._id}`);

    try {
        const query = { _id: req.params._id, PostedBy: req.decoded._id };
        const deletedAssignment = await deleteIfExistsDB("Assignments", req.decoded.Institution, query, assignmentSchema);

        if (!deletedAssignment) {
            res.status(403).json({
                success: false,
                message: "Either you are not authorized to delete this assignment, or the assignment does not exist",
            });
            return;
        }

        console.log("Assignment deleted successfully");
        res.status(200).json({
            success: true,
            message: "Assignment deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete assignment:", error);
        res.status(500).json({
            success: false,
            message: `Failed to delete assignment, error: ${error.message}`,
        });
    }
}
module.exports = { getProfessorAssignmentsRoute, getBatchesRoute, getMyQuestionsRoute, getOtherQuestionsRoute, createAssignmentRoute, deleteAssignmentRoute };