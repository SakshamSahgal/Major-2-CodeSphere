const { readDB } = require("../db/mongoOperations");
const { assignmentSchema } = require("../db/schema");


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

module.exports = { getProfessorAssignmentsRoute };