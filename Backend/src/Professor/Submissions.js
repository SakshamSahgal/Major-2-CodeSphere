const { readDB, checkIfExists, deleteDB, updateDB } = require("../db/mongoOperations");
const { SubmitAssignmentsSchema, assignmentSchema } = require("../db/schema");
const { GetStudent, getQuestionName } = require('../other/Common');
const ExcelJS = require("exceljs");

async function CheckAssignment(req, res, next) {
    const assignmentId = req.params._id;
    try {
        let findQuery = { _id: assignmentId };
        let assignmentExist = await checkIfExists("Assignments", req.decoded.Institution, findQuery, assignmentSchema);

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
        };
        let submissions = await readDB("AssignmentSubmissions", req.decoded.Institution, findQuery, SubmitAssignmentsSchema, Projection);

        for (let i = 0; i < submissions.length; i++) {
            let thisStudent = await GetStudent(submissions[i].StudentId, req.decoded.Institution);
            submissions[i].Student = thisStudent;
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
        let Projection = { __v: 0 };

        let submission = await readDB("AssignmentSubmissions", req.decoded.Institution, findQuery, SubmitAssignmentsSchema, Projection);

        if (submission.length == 0) {
            res.status(404).json({
                success: false,
                message: "Submission not found"
            });
            return;
        }

        let thisSubmission = submission[0];
        let thisStudent = await GetStudent(thisSubmission.StudentId, req.decoded.Institution);
        thisSubmission.Student = thisStudent;

        let Submissions = JSON.parse(JSON.stringify(thisSubmission.Submission));
        for (let i = 0; i < thisSubmission.Submission.length; i++) {
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

async function CheckSubmission(req, res, next) {
    let query1 = {
        StudentId: req.decoded._id,
        AssignmentId: req.params._id,
    };
    let exists1 = await checkIfExists("AssignmentSubmissions", req.decoded.Institution, query1, SubmitAssignmentsSchema);
    if (!exists1) {
        res.status(404).send({
            success: false,
            message: "Submission not found in AssignmentSubmissions database"
        });
        return;
    }

    let query2 = {
        _id: req.params._id,
        SubmittedBy: { $in: req.decoded._id }
    };
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
            StudentId: req.decoded._id,
            AssignmentId: req.params._id,
        };
        let deleteResponseFromAssignmentSubmissions = await deleteDB("AssignmentSubmissions", req.decoded.Institution, deleteQuery1);
        console.log(deleteResponseFromAssignmentSubmissions);

        let updateQuery = {
            _id: req.params._id,
            SubmittedBy: { $in: req.decoded._id }
        };
        let update = { $pull: { SubmittedBy: req.decoded._id } };
        let updateResponseFromAssignments = await updateDB("Assignments", req.decoded.Institution, updateQuery, update);
        console.log(updateResponseFromAssignments);

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

/**
 * 📌 NEW: Export submissions to Excel
 */
async function exportSubmissions(req, res) {
    const assignmentId = req.params._id;
    try {
        let findQuery = { AssignmentId: assignmentId };
        let submissions = await readDB("AssignmentSubmissions", req.decoded.Institution, findQuery, SubmitAssignmentsSchema);

        if (!submissions.length) {
            return res.status(404).json({ success: false, message: "No submissions found." });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Submissions");

        worksheet.columns = [
            { header: "Student Name", key: "studentName", width: 25 },
            { header: "Student Email", key: "studentEmail", width: 30 },
            { header: "Question ID", key: "questionId", width: 25 },
            { header: "Submitted Code", key: "submittedCode", width: 50 },
            { header: "Score Obtained", key: "scoreObtained", width: 15 },
            { header: "Total Score", key: "totalScore", width: 15 },
            { header: "Submitted On", key: "submittedOn", width: 25 }
        ];

        for (let submission of submissions) {
            let student = await GetStudent(submission.StudentId, req.decoded.Institution);
            for (let q of submission.Submission) {
                worksheet.addRow({
                    studentName: student?.name || "N/A",
                    studentEmail: student?.email || "N/A",
                    questionId: q.QuestionId,
                    submittedCode: q.SubmittedCode,
                    scoreObtained: q.ScoreObtained,
                    totalScore: q.TotalScore,
                    submittedOn: submission.SubmittedOn.toISOString()
                });
            }
        }

        worksheet.getRow(1).font = { bold: true };
        
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=submissions_${assignmentId}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: `Error generating Excel: ${err}` });
    }
}

module.exports = {
    CheckAssignment,
    getSubmissions,
    analyzeSubmission,
    CheckSubmission,
    unsubmitAssignment,
    exportSubmissions
};
