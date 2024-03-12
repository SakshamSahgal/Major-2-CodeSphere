const { readDB } = require("../db/mongoOperations");
const { assignmentSchema } = require("../db/schema");
const { RunCpp } = require("../Code/Run");
const readline = require('readline');
const fs = require('fs');
const { compareTextFilesLineByLine } = require("../Code/StreamComparison");

async function ValidateInputs(ws, req, next) {
    if (req.params.assignmentId == undefined || req.params.questionId == undefined) {
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

//Outputs - 
//{ success: false, message: "Invalid Code" } - if CodeToRun is empty

async function RunOutputComparison(ws, req) {

    console.log("Running Output Comparison");

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === "DryRunCode") {

                if (data.CodeToRun === undefined || data.CodeToRun === "") {
                    ws.send(JSON.stringify({
                        success: false,
                        message: "Invalid Code",
                    }), () => {
                        ws.close(1008);  //1008 is the status code for Policy Violation
                    });
                }
                else {
                    //iterating over all testcases of this question
                    let PassedAllTestCases = true;

                    for (let i = 0; i < req.ThisQuestion.TestCases.length; i++) {

                        ws.send(JSON.stringify({
                            success: true,
                            message: `Running Solution Code on Testcase ${i + 1}`,
                            verdict: "Running.."
                        }));

                        let solutionCodeResponse;
                        let studentCodeResponse;

                        try {
                            solutionCodeResponse = await RunCpp(req.ThisQuestion.SolutionCode, req.ThisQuestion.TestCases[i].input, 5000);
                        } catch (err) {
                            ws.send(JSON.stringify({
                                success: false,
                                message: `Internal Server Error while running Solution Code on Testcase ${i + 1} : ${err.message}`
                            }), () => {
                                ws.close(1011);  //1011 is the status code for Internal Error
                            });
                            return;
                        }

                        try {
                            studentCodeResponse = await RunCpp(data.CodeToRun, req.ThisQuestion.TestCases[i].input, 5000);
                        } catch (err) {
                            ws.send(JSON.stringify({
                                success: false,
                                message: `Internal Server Error while running Student Code on Testcase ${i + 1}: ${err.message}`
                            }), () => {
                                ws.close(1011);  //1011 is the status code for Internal Error
                            });
                            return;
                        }
                        //if Solution Code fails to run
                        if (solutionCodeResponse.success === false) {
                            solutionCodeResponse.message += `[Solution Code failed to run on Testcase ${i + 1}]`
                            ws.send(JSON.stringify(solutionCodeResponse), () => {
                                ws.close(1011);  //1011 is the status code for Internal Error
                            });
                            return;
                        }
                        //if Student Code fails to run
                        if (studentCodeResponse.success === false) {
                            studentCodeResponse.message += `[Student Code failed to run on Testcase ${i + 1}]`
                            ws.send(JSON.stringify(studentCodeResponse), () => {
                                ws.close(1011);  //1011 is the status code for Internal Error
                            });
                            return;
                        }

                        //if both run successfully

                        ws.send(JSON.stringify({
                            success: true,
                            message: `Comparing Output Streams of Testcase ${i + 1}`,
                            verdict: "Comparing.."
                        }));

                        let Comparison;

                        try {
                            Comparison = await compareTextFilesLineByLine(solutionCodeResponse.outputFilePath, studentCodeResponse.outputFilePath);
                        }
                        catch (e) {
                            ws.send(JSON.stringify({
                                success: false,
                                message: `Internal Server Error while comparing outputs of Testcase ${i + 1}: ${e.message}`
                            }), () => {
                                ws.close(1011);  //1011 is the status code for Internal Error
                            });
                            return;
                        }
                        console.log(Comparison)
                        if (Comparison.success === false) {
                            ws.send(JSON.stringify({
                                success: false,
                                message: `Unable to compare outputs of Testcase ${i + 1}: ${Comparison.error}`
                            }), () => {
                                ws.close(1011);  //1011 is the status code for Internal Error
                            });
                            return;
                        }
                        else {

                            if (Comparison.different === true) {
                                ws.send(JSON.stringify({
                                    success: true,
                                    message: `Output Mismatch in Testcase ${i + 1}`,
                                    verdict: "Failed",
                                    testcase: i + 1
                                }));
                                PassedAllTestCases = false;
                            }
                            else {
                                ws.send(JSON.stringify({
                                    success: true,
                                    message: `Testcase ${i + 1} Passed`,
                                    verdict: "Passed",
                                    testcase: i + 1
                                }));
                            }
                        }
                    }

                    if (PassedAllTestCases === true) {
                        ws.send(JSON.stringify({
                            success: true,
                            message: `All Testcases Passed`,
                            verdict: "AC"
                        }));
                    } else {
                        ws.send(JSON.stringify({
                            success: false,
                            message: `Some Testcases Failed`,
                            verdict: "WA"
                        }), () => {
                            ws.close(1008);  //1008 is the status code for Policy Violation
                        });
                    }
                }
            }
            else {
                ws.send(JSON.stringify({
                    success: false,
                    message: "Invalid Type",
                }), () => {
                    PassedAllTestCases = false;
                    ws.close(1008);  //1008 is the status code for Policy Violation
                });
            }
        } catch (e) {
            ws.send(JSON.stringify({
                success: false,
                message: "Invalid JSON format recieved from client",
            }), () => {
                ws.close(1008);  //1008 is the status code for Policy Violation
            });
        }
    });

}

module.exports = { ValidateInputs, CheckQuestionInAssignment, findQuestion, ValidateTestCases, RunOutputComparison }