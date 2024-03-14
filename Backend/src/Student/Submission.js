const { readDB } = require("../db/mongoOperations");
const { assignmentSchema } = require("../db/schema");
const { RunCpp, DeleteAfterExecution } = require("../Code/Run");
const { compareTextFilesLineByLine, readFileAsync } = require("../Code/StreamComparison");


async function ValidateInputs(ws, req, next) {
    if (req.params.assignmentId == undefined || req.params.questionId == undefined) {
        ws.send(JSON.stringify({
            success: false,
            message: `Invalid Inputs`,
            type: `Logs`
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

    ws.send(JSON.stringify({
        success: true,
        message: `Finding Question in the assignment`,
        type: `logs`
    }));

    try {
        let response = await readDB("Assignments", req.decoded.Institution, Querry, assignmentSchema);
        if (response.length == 0) {
            ws.send(JSON.stringify({
                success: false,
                message: "Invalid assignmentId or questionId",
                type: `logs`
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
            type: `logs`
        }), () => {
            ws.close(1011);  //1011 is the status code for Internal Error
        });
        return;
    }
}

async function findQuestion(ws, req, next) {

    ws.send(JSON.stringify({
        success: true,
        message: "Finding Question in QuestionBank",
        type: `logs`
    }));

    try {
        let response = await readDB("QuestionBank", req.decoded.Institution, { _id: req.params.questionId });
        if (response.length == 0) {
            ws.send(JSON.stringify({
                success: false,
                message: `Question not found in the QuestionBank`,
                type: `logs`
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
            type: `logs`
        }), () => {
            ws.close(1011);  //1011 is the status code for Internal Error
        });
        return;
    }
}

async function ValidateTestCases(ws, req, next) {
    ws.send(JSON.stringify({
        success: true,
        message: "Validating TestCases for the question",
        type: `logs`
    }));
    if (req.ThisQuestion.TestCases.length == 0) {
        ws.send(JSON.stringify({
            success: false,
            message: "No TestCases found for the question",
            type: `logs`
        }), () => {
            ws.close(1008);  //1008 is the status code for Policy Violation
        });
        return;
    } else {
        next();
    }
}

async function RunCode(ws, Code, TestCase, Type, RunOn) {

    ws.send(JSON.stringify({
        success: true,
        message: `Running ${Type} Code [${RunOn}]`,
        type: `logs`
    }));

    try {
        let CodeResponse = await RunCpp(Code, TestCase, 5000);
        return CodeResponse;
    } catch (err) {
        ws.send(JSON.stringify({
            success: false,
            message: `Internal Server Error while running ${Type} Code [${RunOn}] : ${err.message}`,
            type: `logs`
        }), () => {
            ws.close(1011);  //1011 is the status code for Internal Error
        });
        return;
    }
}

//this function takes the response of RunCode function and compares the output files
async function CompareOutputs(ws, solutionCodeResponse, studentCodeResponse, RunOn) {
    ws.send(JSON.stringify({
        success: true,
        message: `Comparing Output Streams of ${RunOn}`,
        type: `logs`
    }));

    try {
        let Comparison = await compareTextFilesLineByLine(solutionCodeResponse.outputFilePath, studentCodeResponse.outputFilePath); //this function automatically deletes the files after comparison
        if (Comparison.success === false) {
            ws.send(JSON.stringify({
                success: false,
                message: `Unable to compare outputs of ${RunOn}: ${Comparison.error}`,
                type: `logs`
            }), () => {
                ws.close(1011);  //1011 is the status code for Internal Error
            });
            return;
        }
        else {
            return Comparison;
        }
    }
    catch (e) {
        console.log(e)
        ws.send(JSON.stringify({
            success: false,
            message: `Internal Server Error while comparing outputs of ${RunOn}: ${e.error}`,
            type: `logs`
        }), () => {
            ws.close(1011);  //1011 is the status code for Internal Error
        });
        return;
    }
}

//This function runs the solution code and student code for each testcase and compares the outputs
//RunOn is the name of the testcase (used as a label in the logs)
async function RunAndCompare(ws, SolutionCode, StudentCode, TestCase, RunOn) {

    let solutionCodeResponse = await RunCode(ws, SolutionCode, TestCase, "Solution", RunOn);
    if (solutionCodeResponse === undefined) return;
    let studentCodeResponse = await RunCode(ws, StudentCode, TestCase, "Student", RunOn);
    if (studentCodeResponse === undefined) return;

    //if Solution Code fails to run
    //output file will automatically be deleted by RunCpp funciton if the code fails
    if (solutionCodeResponse.success === false) {
        solutionCodeResponse.message += ` [Solution Code, ${RunOn}]`
        solutionCodeResponse.type = `logs`
        ws.send(JSON.stringify(solutionCodeResponse), () => {
            ws.close(1011);  //1011 is the status code for Internal Error
        });
        return;
    }

    //if Student Code fails to run
    //output file will automatically be deleted by RunCpp funciton if the code fails
    if (studentCodeResponse.success === false) {
        ws.send(JSON.stringify({
            success: true,
            message: studentCodeResponse.message,
            verdict: studentCodeResponse.verdict,
            type: `Verdict`,
            testcase: RunOn,
            score: 0
        }));
        return false; //continue to next testcase as this testcase failed
    }

    //if both run successfully, then compare the outputs
    let Comparison = await CompareOutputs(ws, solutionCodeResponse, studentCodeResponse, RunOn); //this function automatically deletes the files after comparison
    if (Comparison === undefined) return; //this means there was an error while comparing the outputs

    if (Comparison.different === true) {
        ws.send(JSON.stringify({
            success: true,
            message: `Output Mismatch in ${RunOn}`,
            verdict: "Wrong Answer",
            type: `Verdict`,
            testcase: RunOn,
            score: 0
        }));
        return false; //continue to next testcase as this testcase failed
    }
    else {
        ws.send(JSON.stringify({
            success: true,
            message: `${RunOn} Passed`,
            verdict: "Accepted",
            type: `Verdict`,
            testcase: RunOn,
            score: 1
        }));
        return true; //continue to next testcase as this testcase passed
    }
}

async function RunOutputComparison(ws, req) {

    ws.send("start");

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            console.log(data);
            if (data.CodeToRun === undefined || data.CodeToRun === "") {
                ws.send(JSON.stringify({
                    success: false,
                    message: "Invalid Code",
                    type: `logs`
                }), () => {
                    ws.close(1008);  //1008 is the status code for Policy Violation
                });
            }
            else {
                //iterating over all testcases of this question
                let PassedAllTestCases = true;
                let TotalScore = 0;
                let ScoreObtained = 0;

                for (let i = 0; i < req.ThisQuestion.TestCases.length; i++) {

                    let RunResponse = await RunAndCompare(ws, req.ThisQuestion.SolutionCode, data.CodeToRun, req.ThisQuestion.TestCases[i].input, `Testcase ${i + 1}`);
                    if (RunResponse === undefined) return;
                    if (RunResponse === false) {
                        TotalScore += 1;
                        PassedAllTestCases = false;
                    } else {
                        TotalScore += 1;
                        ScoreObtained += 1;
                    }
                }

                if (req.ThisQuestion.RandomTestChecked) {

                    ws.send(JSON.stringify({
                        success: true,
                        message: `Running Random TestCode`,
                        type: `logs`
                    }))

                    let RandomTestCodeResponse = await RunCode(ws, req.ThisQuestion.RandomTestCode, "", "Random TestCase Generator", "");

                    if (RandomTestCodeResponse === undefined) return;

                    if (RandomTestCodeResponse.success === false) {
                        ws.send(JSON.stringify({
                            success: false,
                            message: RandomTestCodeResponse.message + ` Random TestCode failed to run`,
                            verdict: RandomTestCodeResponse.verdict,
                            type: `logs`
                        }), () => {
                            ws.close(1011);  //1011 is the status code for Internal Error
                        });
                        return;
                    }

                    ws.send(JSON.stringify({
                        success: true,
                        message: `Random TestCode ran successfully`,
                        type: `logs`
                    }));

                    let RandomInput;

                    //use the output file of RandomTestCode as input for the student code asynchronously
                    try {
                        RandomInput = await readFileAsync(RandomTestCodeResponse.outputFilePath);
                    }
                    catch (e) {
                        ws.send(JSON.stringify({
                            success: false,
                            message: `Internal Server Error while reading RandomTestCode output: ${e.message}`,
                            type: `logs`
                        }), () => {
                            ws.close(1011);  //1011 is the status code for Internal Error
                        });
                        return;
                    }


                    ws.send(JSON.stringify({
                        success: true,
                        message: `Random Input Generated: ${RandomInput}`,
                        type: `logs`
                    }));

                    RunResponse = await RunAndCompare(ws, req.ThisQuestion.SolutionCode, data.CodeToRun, RandomInput, `Random Input`);

                    DeleteAfterExecution(RandomTestCodeResponse.outputFilePath) //Delete the random Input after running and comparing

                    if (RunResponse === undefined) return;
                    if (RunResponse === false) {
                        TotalScore += 1;
                        PassedAllTestCases = false;
                    } else {
                        TotalScore += 1;
                        ScoreObtained += 1;
                    }
                }
                
                if (PassedAllTestCases) {
                    ws.send(JSON.stringify({
                        success: true,
                        message: `All Testcases Passed`,
                        verdict: "Accepted",
                        type: `Decision`,
                        TotalScore: TotalScore,
                        ScoreObtained: ScoreObtained
                    }), () => {
                        ws.close(1000);  //1000 is the status code for Normal Closure
                    });
                } else {
                    ws.send(JSON.stringify({
                        success: false,
                        message: `Some Testcases Failed`,
                        verdict: "Wrong Answer",
                        TotalScore: TotalScore,
                        ScoreObtained: ScoreObtained,
                        type: `Decision`
                    }), () => {
                        ws.close(1008);  //1008 is the status code for Policy Violation
                    });
                }
            }

        } catch (e) {
            ws.send(JSON.stringify({
                success: false,
                message: `Internal Server Error : ${e.message}`,
                type: `logs`
            }), () => {
                ws.close(1008);  //1008 is the status code for Policy Violation
            });
        }
    });

}

module.exports = { ValidateInputs, CheckQuestionInAssignment, findQuestion, ValidateTestCases, RunOutputComparison }