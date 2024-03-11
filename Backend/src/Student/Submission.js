const { readDB } = require("../db/mongoOperations");
const { assignmentSchema } = require("../db/schema");
const { RunCpp, DeleteAfterExecution } = require("../Code/Run");
const readline = require('readline');
const fs = require('fs');

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
//This function compares two text files line by line and returns the line number where they differ, this is useful for large outputs as we can't load the entire file in memory
//Possible Outputs - 
// { success: true, different: true, line: lineCounter }
// { success: true, different: false }
// { success: false,  error: err }

function compareTextFilesLineByLine(file1Path, file2Path) {
    return new Promise((resolve, reject) => {
        console.log(`Recieved ${file1Path} ${file2Path}`)
        const file1Stream = fs.createReadStream(file1Path);
        const file2Stream = fs.createReadStream(file2Path);

        const file1LineReader = readline.createInterface({
            input: file1Stream
        });

        const file2LineReader = readline.createInterface({
            input: file2Stream
        });

        let lineCounter = 1;
        let filesDifferent = false;

        const file1Buffer = [];
        const file2Buffer = [];

        file1LineReader.on('line', (line1) => {
            file1Buffer.push(line1);
            checkBuffers();
        });

        file2LineReader.on('line', (line2) => {
            file2Buffer.push(line2);
            checkBuffers();
        });

        function checkBuffers() {
            while (file1Buffer.length > 0 && file2Buffer.length > 0) {
                const line1 = file1Buffer.shift();
                const line2 = file2Buffer.shift();
                console.log("comparing ", line1, line2)
                if (line1 !== line2) {
                    filesDifferent = true;
                    file1LineReader.close();
                    file2LineReader.close();
                    DeleteAfterExecution(file1Path, file2Path)
                    resolve({
                        success: true,
                        different: true,
                        line: lineCounter
                    });
                    return;
                }
                lineCounter++;
            }
        }

        file1LineReader.on('close', () => {
            if (!filesDifferent) {
                DeleteAfterExecution(file1Path, file2Path)
                resolve({
                    success: true,
                    different: false
                });
            }
        });

        file1LineReader.on('error', (err) => {
            DeleteAfterExecution(file1Path, file2Path)
            reject({
                success: false,
                error: err
            });
        });

        file2LineReader.on('error', (err) => {
            DeleteAfterExecution(file1Path, file2Path)
            reject({
                success: false,
                error: err
            });
        });
    });
}

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
                        // console.log("---")
                        // console.log("Solution CODE : ")
                        // console.log(req.ThisQuestion.SolutionCode)
                        // console.log("User code ")
                        // console.log(data.CodeToRun)
                        // console.log("Input")
                        // console.log(req.ThisQuestion.TestCases[i].input)
                        // console.log("---")
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
                                message: `Internal Server Error while comparing outputs of Testcase ${i + 1}: ${Comparison.error}`
                            }), () => {
                                ws.close(1011);  //1011 is the status code for Internal Error
                            });
                            return;
                        }
                        else {
                            if (Comparison.different === true) {
                                ws.send(JSON.stringify({
                                    success: false,
                                    message: `Output Mismatch in Testcase ${i + 1} at line ${Comparison.line}`
                                }), () => {
                                    ws.close(1008);  //1008 is the status code for Policy Violation
                                });
                                return;
                            }
                            else {
                                ws.send(JSON.stringify({
                                    success: true,
                                    message: `Testcase ${i + 1} Passed`,
                                    verdict: "Passed"
                                }));
                            }
                        }
                    }

                    if (PassedAllTestCases === true) {
                        ws.send(JSON.stringify({
                            success: true,
                            message: `All Testcases Passed`,
                            verdict: "Passed"
                        }));
                    } else {
                        ws.send(JSON.stringify({
                            success: false,
                            message: `Some Testcases Failed`,
                            verdict: "Failed"
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