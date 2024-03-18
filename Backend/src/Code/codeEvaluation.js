const { RunCpp } = require("./Run");
const { compareTextFilesLineByLine } = require("./StreamComparison");
const { DeleteAfterExecution } = require("./Run");
const { readFileAsync } = require("./StreamComparison");


//This function runs the code and returns the response
async function RunCode(ws, Code, TestCase, Type, RunOn) {

    ws.send(JSON.stringify({
        success: true,
        message: `Running ${Type} Code [${RunOn}]`,
        type: `logs`
    }));

    try {
        console.log(`Running code : ${Code}`);
        console.log(`On TestCase : ${TestCase}`);
        
        let CodeResponse = await RunCpp(Code, TestCase, 5);
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
//QuestionPlaceHolder is the name of the question (used as a label in the verdict logs)
async function RunAndCompare(ws, SolutionCode, StudentCode, TestCase, RunOn, QuestionPlaceHolder = "") {

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
            Question: QuestionPlaceHolder,
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
            Question: QuestionPlaceHolder,
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
            Question: QuestionPlaceHolder,
            score: 1
        }));
        return true; //continue to next testcase as this testcase passed
    }
}

//This function evaluates the question by running and comparing the solution code and student code for each testcase
//It return undefined if there is an error, else it returns an object with TotalScore and ScoreObtained
async function EvaluateQuestion(ws, Question, CodeToRun, QuestionPlaceHolder) {

    ws.send(JSON.stringify({
        success: true,
        message: `Evaluating Question ${Question._id}`,
        type: `logs`
    }));

    //iterating over all testcases of this question
    let PassedAllTestCases = true;
    let TotalScore = 0;
    let ScoreObtained = 0;

    //iterating over all testcases of this question
    for (let i = 0; i < Question.TestCases.length; i++) {

        let RunResponse = await RunAndCompare(ws, Question.SolutionCode, CodeToRun, Question.TestCases[i].input, `Testcase ${i + 1}`, QuestionPlaceHolder);
        if (RunResponse === undefined) return;
        if (RunResponse === false) {
            TotalScore += 1;
            PassedAllTestCases = false;
        } else {
            TotalScore += 1;
            ScoreObtained += 1;
        }
    }
    //if RandomTestChecked is true, then run the RandomTestCode and compare the output
    if (Question.RandomTestChecked) {

        ws.send(JSON.stringify({
            success: true,
            message: `Running Random TestCode`,
            type: `logs`
        }))

        let RandomTestCodeResponse = await RunCode(ws, Question.RandomTestCode, "", "Random TestCase Generator", "");

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

        RunResponse = await RunAndCompare(ws, Question.SolutionCode, CodeToRun, RandomInput, `Random Input`, QuestionPlaceHolder);

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
            ScoreObtained: ScoreObtained,
            Question: QuestionPlaceHolder
        }), () => {
            return {
                TotalScore: TotalScore,
                ScoreObtained: ScoreObtained
            }; //all testcases passed
        });
    } else {
        ws.send(JSON.stringify({
            success: true,
            message: `Some Testcases Failed`,
            verdict: "Wrong Answer",
            TotalScore: TotalScore,
            ScoreObtained: ScoreObtained,
            type: `Decision`,
            Question: QuestionPlaceHolder
        }), () => {
            return {
                TotalScore: TotalScore,
                ScoreObtained: ScoreObtained
            }; //some testcases failed
        });
    }
}

module.exports = { RunAndCompare, RunCode, CompareOutputs, EvaluateQuestion };