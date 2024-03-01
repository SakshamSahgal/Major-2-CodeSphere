const fs = require('fs');
const { spawn } = require("child_process");
const path = require('path');


function DeleteAfterExecution(...filePaths) {
    filePaths.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Error occured while deleting the ${filePath} file, err : ${err}`)
                }
                else {
                    console.log(`Successfully deleted the ${filePath} file`)
                }
            });
        }
    });
}


//this route will be used to run the c++ code
//it first takes the code and input in body of the request
//Then it writes the code to a .cpp file
//Then it compiles and runs the .cpp file
//Then it passes the input to the stdin of the running script
//Then it writes the output to a .txt file

async function RunCpp(code, input, TimeLimit) {
    return new Promise((resolve, reject) => {
        let Response_sent = false;

        let scriptName = Date.now();
        let scriptPath = path.join(__dirname, `${scriptName}.cpp`)
        let executablePath = path.join(__dirname, `${scriptName}.exe`)
        let outputFilePath = path.join(__dirname, `${scriptName}.txt`)
        let scriptProcess = null;
        let executionTimeout = TimeLimit; //Timeout for the script execution to prevent infinite loops and detect TLEs
        let ProcessKillingStarted = false;

        //this will be used to kill the process if it takes too long to execute and it will run after the executionTimeout time
        const timeoutId = setTimeout(() => {

            if (scriptProcess) {
                scriptProcess.kill();
                if (!ProcessKillingStarted)
                    console.log('Killling the process because of timeout...');
                ProcessKillingStarted = true;
            }
            else
                console.log("Process Killed Successfully...")

            if (!Response_sent) {
                Response_sent = true;
                DeleteAfterExecution(scriptPath, executablePath, outputFilePath);
                resolve({ success: false, message: `script took too long to execute.`, verdict: "Time Limit Exceeded" });
            }
        }, executionTimeout);

        //write the code to a .cpp file synchronously
        try {
            fs.writeFileSync(scriptPath, code);
            console.log(`successfully written the code to ${scriptPath}`);
        } catch (err) {
            console.log(`error while writing the code to ${scriptPath}, err : ${err}`);
            if (!Response_sent) {
                Response_sent = true;
                clearTimeout(timeoutId);
                DeleteAfterExecution(scriptPath, executablePath, outputFilePath);
                resolve({ success: false, message: `Error occurred while writing the ${scriptPath} file`, verdict: "Runtime Error" });
            }
        }

        //compile and run the .cpp file
        const compileAndRunCommand = `g++ -o ${executablePath} ${scriptPath} && ${executablePath}`;
        scriptProcess = spawn('sh', ['-c', compileAndRunCommand], { stdio: ['pipe', 'pipe', 'pipe'] }); // piping the stdin, stdout and stderr of the child process

        //writing the input to the stdin of the child process
        scriptProcess.stdin.write(input); // Write input to stdin
        scriptProcess.stdin.end();

        let chunkCounter = 0; // Initialize chunk counter
        scriptProcess.stdout.on('data', (data) => {

            if (!Response_sent) {
                // Write the output to a text file
                fs.appendFile(outputFilePath, data, (err) => {
                    if (err) {
                        console.log(`error while appending stdout to the output to ${outputFilePath}, err : ${err}`);
                        Response_sent = true; // Set Response_sent to true to indicate response is sent
                        clearTimeout(timeoutId); // Clear the TLE timeout
                        DeleteAfterExecution(scriptPath, executablePath, outputFilePath);
                        resolve({ success: false, message: `Error occurred while appending data to the ${outputFilePath} file`, verdict: "Runtime Error" });
                    } else {
                        console.log(`appending chunk ${++chunkCounter} stdout to the output to ${outputFilePath}`);
                    }
                });
            } else {
                // If response is already sent, stop further writing
                //kill the process if not already killed
                if (scriptProcess) {
                    scriptProcess.kill();
                    if (!ProcessKillingStarted)
                        console.log('Killing the process while writing to the output file, because response is already sent.');
                    ProcessKillingStarted = true;
                }
                else
                    console.log("Process Killed Successfully, because the response is already sent...")

                console.log('Response already sent. Stopping further writing.');
                scriptProcess.stdout.removeAllListeners('data'); // Stop listening for further data
                DeleteAfterExecution(scriptPath, executablePath, outputFilePath);
            }
        });

        //if any error occurs while running the script, send the error message as response
        scriptProcess.stderr.on('data', (data) => {
            console.log(`error while executing script, stderr: ${data}`);
            if (!Response_sent) {
                Response_sent = true;
                clearTimeout(timeoutId);
                DeleteAfterExecution(scriptPath, executablePath, outputFilePath);
                resolve({ success: false, message: `Error occured while running the script ${executablePath}`, verdict: "Compilation Error" });
            }
        });

        //when the script is finished running, read the output file and send it as response
        scriptProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (!Response_sent) {
                Response_sent = true;
                clearTimeout(timeoutId);
                DeleteAfterExecution(scriptPath, executablePath);
                resolve({ success: true, outputFilePath: outputFilePath, verdict: "Run Successful" });
            }
        });
    });
}


module.exports = { RunCpp, DeleteAfterExecution };