const path = require('path');
const { RunCpp, DeleteAfterExecution } = require("../Code/Run")
const fs = require('fs');
const { writeDB, readDB, checkIfExists, deleteDB } = require('../db/mongoOperations');
const { QuestionSchema, assignmentSchema } = require('../db/schema');
const { GetProfessor } = require('../other/Common');

function ValidateSolutionCode(ws, req) {

    console.log('WebSocket connection established');

    ws.on('message', async (message) => {
        try {

            const data = JSON.parse(message);

            if (data.type === "Validation") {

                console.log(data)

                ws.send(JSON.stringify({ success: true, message: "Running the code...", verdict: "Processing.." }));

                let response = await RunCpp(data.SolutionCodeToTest, data.validationTestCaseValue, 5)

                //if the code is not executed successfully, send the error message as response and close the connection
                if (!response.success) {
                    ws.send(JSON.stringify(response), () => {
                        ws.close(1008);
                    });
                }
                else {

                    ws.send(JSON.stringify({ success: true, message: "Code executed successfully, matching the output...", verdict: "Comparing.." }));

                    //read the output file from response.outputFilePath and compare it with expectedOutputValue

                    ws.send(JSON.stringify({ success: true, message: "Reading the Generated Output from the Code...", verdict: "Reading Output.." }));

                    fs.readFile(response.outputFilePath, 'utf8', (err, readContent) => {
                        if (err) {
                            ws.send(JSON.stringify({
                                success: false,
                                message: `Error occured while reading the output file ${response.outputFilePath}`,
                                verdict: "Runtime Error"
                            }), () => {
                                ws.close(1008);
                            });
                        }
                        else {
                            if (readContent === data.expectedOutputValue) {
                                ws.send(JSON.stringify({
                                    success: true,
                                    message: "Output matched with expected output",
                                    verdict: "Accepted"
                                }), () => {
                                    ws.close(1000);
                                    DeleteAfterExecution(response.outputFilePath);
                                });
                            }
                            else {
                                ws.send(JSON.stringify({
                                    success: true,
                                    message: "Output did not match with expected output",
                                    verdict: "Wrong Answer"
                                }), () => {
                                    ws.close(1000);
                                    DeleteAfterExecution(response.outputFilePath);
                                });
                            }
                        }
                    });
                }
            }
            else {
                ws.send(JSON.stringify({
                    success: false,
                    message: "Invalid Type",
                }), () => {
                    ws.close(1008);  //1008 is the status code for Policy Violation
                });
            }
        }
        catch (e) {
            ws.send(JSON.stringify({
                success: false,
                message: "Invalid JSON format recieved from client",
            }), () => {
                ws.close(1008);  //1008 is the status code for Policy Violation
            });
        }

    });

    ws.on('close', () => {
        console.log('Connection closed');
        // Perform cleanup or logging
    });
}

function ValidateRandomTestCaseCode(ws, req) {

    console.log('WebSocket connection established');

    ws.on('message', async (message) => {
        try {

            const data = JSON.parse(message);

            if (data.type === "RunRandomTestCaseCode") {

                // console.log(data)

                ws.send(JSON.stringify({ success: true, message: "Running the code...", verdict: "Processing.." }));

                let response = await RunCpp(data.RandomTestCaseCode, "", 5)

                //if the code is not executed successfully, send the error message as response and close the connection
                if (!response.success) {
                    ws.send(JSON.stringify(response), () => {
                        ws.close(1008);
                    });
                }
                else {
                    try {
                        //copy the output file to the public/TemeroryCodeBase folder
                        ws.send(JSON.stringify({ success: true, message: "Code executed successfully, piping the output stream...", verdict: "Copying.." }));

                        //get the filename from the response.outputFilePath
                        let fileName = path.basename(response.outputFilePath);
                        let copyFilePath = path.join(__dirname, "..", "..", "public", "TemperoryCodeBase", fileName);

                        // Create read stream from response.outputFilePath
                        const readStream = fs.createReadStream(response.outputFilePath);

                        // Create write stream to copyFilePath in append mode
                        const writeStream = fs.createWriteStream(copyFilePath, { flags: 'a' });

                        // Pipe the read stream to the write stream
                        readStream.pipe(writeStream);

                        // Listen for events on the write stream
                        writeStream.on('finish', () => {
                            let outputLink = process.env.BackendHost + "/TemperoryCodeBase/" + fileName;
                            ws.send(JSON.stringify({
                                success: true,
                                message: "Output Link will expire in 5 minutes",
                                verdict: outputLink
                            }), () => {
                                ws.close(1000);
                                DeleteAfterExecution(response.outputFilePath);
                                //delete the Temp public file after 5 minutes
                                setTimeout(() => {
                                    console.log(`Deleting Temperory public File ${copyFilePath} after Timeout of 5 minutes`)
                                    DeleteAfterExecution(copyFilePath);
                                }, 300000);
                            });
                        });

                        writeStream.on('error', (err) => {
                            console.error(err);
                            ws.send(JSON.stringify({
                                success: false,
                                message: `Error occurred while writing the stream from ${response.outputFilePath} to ${copyFilePath}`,
                                verdict: "Internal Server Error"
                            }), () => {
                                ws.close(1008);
                                DeleteAfterExecution(response.outputFilePath);
                                DeleteAfterExecution(copyFilePath);
                            });
                        });
                    }
                    catch (e) {
                        ws.send(JSON.stringify({
                            success: false,
                            message: `Error occoured while `,
                            verdict: "Internal Server Error"
                        }), () => {
                            ws.close(1008);
                            DeleteAfterExecution(response.outputFilePath);
                        });
                    }


                }
            }
            else {
                ws.send(JSON.stringify({
                    success: false,
                    message: "Invalid Type",
                }), () => {
                    ws.close(1008);  //1008 is the status code for Policy Violation
                });
            }
        }
        catch (e) {
            ws.send(JSON.stringify({
                success: false,
                message: "Invalid JSON format recieved from client",
            }), () => {
                ws.close(1008);  //1008 is the status code for Policy Violation
            }
            );
        }
    });
}

function createQuestionRoute(req, res) {
    console.log(req.body);
    req.body.CreatedBy = req.decoded._id;
    req.body.CreatedOn = new Date();
    writeDB("QuestionBank", req.decoded.Institution, req.body, QuestionSchema).then((data) => {
        res.status(201).send({
            success: true,
            message: "Question Created Successfully"
        });
    }).catch((error) => {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Failed to Create Question, error: ${error.message}`
        });
    });
}

async function FetchFullQuestionDetailsRoute(req, res) {
    try {
        console.log(req.params._id);

        // Fetch the question details from the database
        const Querry = {
            _id: req.params._id // This is the Question ID
        };

        const Projection = {
            _id: 0,
            __v: 0
        };

        const data = await readDB("QuestionBank", req.decoded.Institution, Querry, QuestionSchema, Projection);

        if (data.length === 0) {
            res.status(404).send({
                success: false,
                message: "Question not found"
            });
        } else {
            // Fetch additional details about the creator
            data[0].CreatedBy = await GetProfessor(data[0].CreatedBy, req.decoded.Institution);

            res.status(200).send({
                success: true,
                message: "Full Question Details Fetched Successfully",
                Question: data[0]
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Failed to Fetch Question Details, error: ${error.message}`
        });
    }
}

async function checkIfQuestionExists(req, res, next) {

    let Query = {
        _id: req.params._id, // This is the Question ID
        CreatedBy: req.decoded._id
    };

    try {
        let exists = await checkIfExists("QuestionBank", req.decoded.Institution, Query, QuestionSchema);
        if (exists) {
            next();
        } else {
            res.send({
                success: false,
                message: "Question not found"
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Failed to Check if Question Exists, error: ${error.message}`
        });
    }
}


async function CheckIfAddedInAnyAssignment(req, res, next) {
    // Check if the question is added in any assignment
    //check if id exists in Questions array of any assignment in the Assignments collection
    let Query = {
        Questions: {
            $in: [req.params._id]
        }
    };

    //only return AssignmentName
    let Projection = {
        AssignmentName: 1
    };

    try {
        let response = await readDB("Assignments", req.decoded.Institution, Query, assignmentSchema, Projection);
        if (response.length > 0) {
            res.send({
                success: false,
                message: `Question is added in the following assignments, please remove it from the assignments first`,
                assignments: response
            });
        } else {
            console.log("Question is not added in any assignment");
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Failed to Check if Question is already added in any Assignment, error: ${error.message}`
        });
    }
}

async function deleteQuestionRoute(req, res) {

    let Query = {
        _id: req.params._id // This is the Question ID
    };

    try {
        let response = await deleteDB("QuestionBank", req.decoded.Institution, Query, QuestionSchema);
        console.log(response);
        res.send({
            success: true,
            message: "Question Deleted Successfully"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Failed to Delete Question with id ${req.params._id}, error: ${error.message}`
        });
    }
}

module.exports = { ValidateSolutionCode, ValidateRandomTestCaseCode, createQuestionRoute, FetchFullQuestionDetailsRoute, checkIfQuestionExists, CheckIfAddedInAnyAssignment, deleteQuestionRoute };