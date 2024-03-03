
const path = require('path');
const { RunCpp, DeleteAfterExecution } = require('../Code/Run');
const fs = require('fs');

function ValidateSolutionCode(ws, req) {

    console.log('WebSocket connection established');

    ws.on('message', async (message) => {
        try {

            const data = JSON.parse(message);

            if (data.type === "Validation") {

                console.log(data)

                ws.send(JSON.stringify({ success: true, message: "Running the code...", verdict: "Processing.." }));

                let response = await RunCpp(data.SolutionCodeToTest, data.validationTestCaseValue, 5000)

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

                console.log(data)

                ws.send(JSON.stringify({ success: true, message: "Running the code...", verdict: "Processing.." }));

                let response = await RunCpp(data.RandomTestCaseCode, "", 5000)

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

module.exports = { ValidateSolutionCode, ValidateRandomTestCaseCode };