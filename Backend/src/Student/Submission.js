const { readDB } = require("../db/mongoOperations");
const { assignmentSchema } = require("../db/schema");
const { RunCpp } = require("../Code/Run");
const readline = require('readline');
const fs = require('fs');
const { compareTextFilesLineByLine } = require("../Code/StreamComparison");


//validation phase
async function ValidateInputs(ws, req, next) {
    if (req.params.assignmentId == undefined || req.params.questionId == undefined) {
        ws.send(JSON.stringify({
            success: false,
            message: `Invalid Inputs`,
            phase: `Validation`
        }), () => {
            ws.close(1008);  //1008 is the status code for Policy Violation
        });
        return;
    }
    else {
        next();
    }
}

//validation phase
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

    ws.send(JSON.stringify({
        success: true,
        message: `Checking if the question is in the assignment`,
        phase: `Validation`
    }));

    try {
        let response = await readDB("Assignments", req.decoded.Institution, Querry, assignmentSchema);
        if (response.length == 0) {
            ws.send(JSON.stringify({
                success: false,
                message: "Invalid assignmentId or questionId",
                phase: `Validation`
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
            message: `Internal Server Error : ${err.message}`,
            phase: `Validation`
        }), () => {
            ws.close(1011);  //1011 is the status code for Internal Error
        });
        return;
    }
}

//searching phase
async function findQuestion(ws, req, next) {

    ws.send(JSON.stringify({
        success: true,
        message: "Checking if the question exists in the QuestionBank",
        phase: `Searching`
    }));

    try {
        let response = await readDB("QuestionBank", req.decoded.Institution, { _id: req.params.questionId });
        if (response.length == 0) {
            ws.send(JSON.stringify({
                success: false,
                message: `Question not found in the QuestionBank`,
                phase: `Searching`
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
            message: `Internal Server Error : ${err.message}`,
            phase: `Searching`
        }), () => {
            ws.close(1011);  //1011 is the status code for Internal Error
        });
        return;
    }
}

//searching phase
async function ValidateTestCases(ws, req, next) {
    console.log("Validating TestCases");
    ws.send(JSON.stringify({
        success: true,
        message: "Validating TestCases for the question",
        phase: `Searching`
    }));
    if (req.ThisQuestion.TestCases.length == 0) {
        ws.send(JSON.stringify({
            success: false,
            message: "No TestCases found for the question",
            phase: `Searching`
        }), () => {
            ws.close(1008);  //1008 is the status code for Policy Violation
        });
        return;
    } else {
        next();
    }
}

//running phase and comparison and verdict
async function RunOutputComparison(ws, req) {

    ws.send("start");

    ws.on('message', async (message) => {
        try {

            const data = JSON.parse(message);

            if (data.CodeToRun === undefined || data.CodeToRun === "") {
                ws.send(JSON.stringify({
                    success: false,
                    message: "Invalid Code",
                    phase: `Running`
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
                        phase: `Running`
                    }));

                    let solutionCodeResponse;
                    let studentCodeResponse;

                    try {
                        solutionCodeResponse = await RunCpp(req.ThisQuestion.SolutionCode, req.ThisQuestion.TestCases[i].input, 5000);
                    } catch (err) {
                        ws.send(JSON.stringify({
                            success: false,
                            message: `Internal Server Error while running Solution Code on Testcase ${i + 1} : ${err.message}`,
                            phase: `Running`
                        }), () => {
                            ws.close(1011);  //1011 is the status code for Internal Error
                        });
                        return;
                    }

                    ws.send(JSON.stringify({
                        success: true,
                        message: `Running Student Code on Testcase ${i + 1}`,
                        phase: `Running`
                    }));

                    try {
                        studentCodeResponse = await RunCpp(data.CodeToRun, req.ThisQuestion.TestCases[i].input, 5000);
                    } catch (err) {
                        PassedAllTestCases = false;
                        ws.send(JSON.stringify({
                            success: false,
                            message: `Internal Server Error while running Student Code on Testcase ${i + 1}: ${err.message}`,
                            phase: `Running`
                        }), () => {
                            ws.close(1011);  //1011 is the status code for Internal Error
                        });
                        return;
                    }

                    //if Solution Code fails to run
                    if (solutionCodeResponse.success === false) {
                        solutionCodeResponse.message += ` [Solution Code, Testcase ${i + 1}]`
                        solutionCodeResponse.phase = `Running`
                        ws.send(JSON.stringify(solutionCodeResponse), () => {
                            ws.close(1011);  //1011 is the status code for Internal Error
                        });
                        return;
                    }

                    //if Student Code fails to run
                    if (studentCodeResponse.success === false) {
                        PassedAllTestCases = false;
                        studentCodeResponse.message += ` [Student Code, Testcase ${i + 1}]`
                        studentCodeResponse.phase = `Running`
                        studentCodeResponse.success = true; //because we don't want to close the connection and test for other testcases as well
                        ws.send(JSON.stringify(studentCodeResponse));
                        ws.send(JSON.stringify({
                            success: true,
                            message: studentCodeResponse.message,
                            verdict: studentCodeResponse.verdict,
                            phase: `Verdict`,
                            testcase: i + 1
                        }));
                    }
                    else {
                        //if both run successfully

                        ws.send(JSON.stringify({
                            success: true,
                            message: `Comparing Output Streams of Testcase ${i + 1}`,
                            phase: `Comparison`,
                            testcase: i + 1,
                        }));

                        let Comparison;

                        try {
                            Comparison = await compareTextFilesLineByLine(solutionCodeResponse.outputFilePath, studentCodeResponse.outputFilePath);
                        }
                        catch (e) {
                            console.log(e)
                            ws.send(JSON.stringify({
                                success: false,
                                message: `Internal Server Error while comparing outputs of Testcase ${i + 1}: ${e.error}`,
                                phase: `Comparison`,
                                testcase: i + 1,
                            }), () => {
                                ws.close(1011);  //1011 is the status code for Internal Error
                            });
                            return;
                        }

                        if (Comparison.success === false) {
                            ws.send(JSON.stringify({
                                success: false,
                                message: `Unable to compare outputs of Testcase ${i + 1}: ${Comparison.error}`,
                                phase: `Comparison`,
                                testcase: i + 1,
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
                                    verdict: "Wrong Answer",
                                    phase: `Verdict`,
                                    testcase: i + 1
                                }));
                                PassedAllTestCases = false;
                            }
                            else {
                                ws.send(JSON.stringify({
                                    success: true,
                                    message: `Testcase ${i + 1} Passed`,
                                    verdict: "Accepted",
                                    phase: `Verdict`,
                                    testcase: i + 1
                                }));
                            }
                        }
                    }
                }
                if (PassedAllTestCases) {
                    ws.send(JSON.stringify({
                        success: true,
                        message: `All Testcases Passed`,
                        verdict: "Accepted",
                        phase: `Decision`
                    }), () => {
                        ws.close(1000);  //1000 is the status code for Normal Closure
                    });
                } else {
                    ws.send(JSON.stringify({
                        success: false,
                        message: `Some Testcases Failed`,
                        verdict: "Wrong Answer",
                        phase: `Decision`
                    }), () => {
                        ws.close(1008);  //1008 is the status code for Policy Violation
                    });
                }
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