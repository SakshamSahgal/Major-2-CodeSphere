const { readDB } = require("../db/mongoOperations");
const { assignmentSchema } = require("../db/schema");
const { RunCpp, DeleteAfterExecution } = require("../Code/Run");

async function ValidateInputs(ws, req, next) {
    if (!req.body.Code || req.params.assignmentId == undefined || req.params.questionId == undefined) {
        ws.send(JSON.stringify({
            success: false,
            message: `Invalid Inputs`
        }), () => {
            ws.close(1008);  //1008 is the status code for Policy Violation
        });
        return;
    }
    else {
        next();
    }
}

async function CheckQuestionInAssignment(ws, req, next) {
    //check if assignmentId exists
    //check if questionId exists in that assignment
    let assignmentId = req.params.assignmentId;
    let questionId = req.params.questionId;
    //questions is an array of ids
    let Querry = {
        _id: assignmentId,
        Questions: { $in: questionId }
    }
    console.log("Checking Question in Assignment");
    ws.send(JSON.stringify({
        success: true,
        message: "Checking if the question is in the assignment",
        verdict: "Checking.."
    }));

    try {

        let response = await readDB("Assignments", req.decoded.Institution, Querry, assignmentSchema);
        if (response.length == 0) {
            ws.send(JSON.stringify({
                success: false,
                message: "Invalid assignmentId or questionId"
            }), () => {
                ws.close(1008);  //1008 is the status code for Policy Violation
            });
            return;
        }
        else {
            next();
        }
    } catch (err) {
        ws.send(JSON.stringify({
            success: false,
            message: `Internal Server Error : ${err.message}`
        }), () => {
            ws.close(1011);  //1011 is the status code for Internal Error
        });
        return;
    }
}

async function findQuestion(ws, req, next) {
    console.log("Finding Question");
    ws.send(JSON.stringify({
        success: true,
        message: "Checking if the question exists in the QuestionBank",
        verdict: "Checking.."
    }));

    try {
        let response = await readDB("QuestionBank", req.decoded.Institution, { _id: req.params.questionId });
        if (response.length == 0) {
            ws.send(JSON.stringify({
                success: false,
                message: "Question not found in the QuestionBank"
            }), () => {
                ws.close(1008);  //1008 is the status code for Policy Violation
            });
            return;
        }
        else {
            req.ThisQuestion = response[0];
            next();
        }
    } catch (err) {
        ws.send(JSON.stringify({
            success: false,
            message: `Internal Server Error : ${err.message}`
        }), () => {
            ws.close(1011);  //1011 is the status code for Internal Error
        });
        return;
    }
}

async function ValidateTestCases(ws, req, next) {
    console.log("Validating TestCases");
    ws.send(JSON.stringify({
        success: true,
        message: "Validating TestCases for the question",
        verdict: "Validating.."
    }));
    if (req.ThisQuestion.TestCases.length == 0) {
        ws.send(JSON.stringify({
            success: false,
            message: "No TestCases found for the question"
        }), () => {
            ws.close(1008);  //1008 is the status code for Policy Violation
        });
        return;
    } else {
        next();
    }
}
//This function compares two files in a streaming manner (chunks), so that large files can be compared without using a lot of memory
function compareFiles(file1Path, file2Path) {
    return new Promise((resolve, reject) => {

        let responseSent = false;
        const stream1 = fs.createReadStream(file1Path);
        const stream2 = fs.createReadStream(file2Path);

        //reading chunks from stream1 and comparing them with chunks from stream2
        stream1.on('data', chunk1 => {
            const chunk2 = stream2.read(chunk1.length);
            if (chunk1.compare(chunk2) !== 0) {
                stream1.close();
                stream2.close();
                if (!responseSent) {
                    responseSent = true;
                    DeleteAfterExecution(file1Path, file2Path); //delete the files after comparison
                    resolve({
                        success: false,
                        message: "Output Mismatch",
                        verdict: "Failed"
                    });
                }
            }
        });

        stream1.on('end', () => {

            if (!responseSent) {

                responseSent = true;
                const remainingData2 = stream2.read(); //check if there is any remaining data in stream2
                DeleteAfterExecution(file1Path, file2Path); //delete the files after comparison

                if (remainingData2 !== null) {
                    resolve({
                        success: false,
                        message: "Output Mismatch",
                        verdict: "Failed"
                    });
                }
                else {
                    resolve({
                        success: true,
                        message: "Output Match",
                        verdict: "Passed"
                    });
                }

            }
        });

        stream1.on('error', (err) => {
            stream1.close();
            stream2.close();
            DeleteAfterExecution(file1Path, file2Path); //delete the files after comparison
            if (!responseSent) {
                responseSent = true;
                reject({
                    success: false,
                    message: err.message,
                    verdict: "Error while comparing files"
                });
            }
        });

        stream2.on('error', (err) => {
            stream1.close();
            stream2.close();
            DeleteAfterExecution(file1Path, file2Path); //delete the files after comparison
            if (!responseSent) {
                responseSent = true;
                reject({
                    success: false,
                    message: err.message,
                    verdict: "Error while comparing files"
                });
            }
        });
    });
}

async function RunSolutionCode(ws, req, next) {

    //iterating over all testcases of this question
    for (let i = 0; i < req.ThisQuestion.TestCases.length; i++) {

        ws.send(JSON.stringify({
            success: true,
            message: `Running Solution Code on Testcase ${i + 1}`,
            verdict: "Running.."
        }));

        let solutionCodeResponse = await RunCpp(req.ThisQuestion.SolutionCode, req.ThisQuestion.TestCases[i], 5000);
        if (!solutionCodeResponse.success) {
            ws.send(JSON.stringify(solutionCodeResponse), () => {
                ws.close(1008);  //1008 is the status code for Policy Violation
            });
            return;
        }
        else {
            let userCodeResponse = await RunCpp(req.body.Code, req.ThisQuestion.TestCases[i], 5000);
            if (!userCodeResponse.success) {
                ws.send(JSON.stringify(userCodeResponse), () => {
                    ws.close(1008);  //1008 is the status code for Policy Violation
                });
                return;
            }
            else {
                //read both outputFilePath and compare them
                //compare both text files line by line, keeping in mind that the outputs can be large
                let comparisonResponse = await compareFiles(solutionCodeResponse.outputFilePath, userCodeResponse.outputFilePath);
                if (!comparisonResponse.success) {
                    ws.send(JSON.stringify(comparisonResponse), () => {
                        ws.close(1008);  //1008 is the status code for Policy Violation
                    });
                    return;
                }
            }
        }
    }
    next();
}

module.exports = { ValidateInputs, CheckQuestionInAssignment, findQuestion, ValidateTestCases, RunSolutionCode }