const fs = require('fs');
const path = require('path');
const { execFile, spawn } = require('child_process');

function DeleteAfterExecution(...filePaths) {
    filePaths.forEach(filePath => {
        fs.unlink(filePath, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.log(`File ${filePath} does not exist`);
                } else {
                    console.log(`Error occurred while deleting the ${filePath} file, err : ${err}`);
                }
            } else {
                console.log(`Successfully deleted the ${filePath} file`);
            }
        });
    });
}

async function writeCppToFile(code, scriptPath) {
    return new Promise((resolve, reject) => {
        fs.writeFile(scriptPath, code, (err) => {
            if (err) {
                console.log(`Error occurred while writing the ${scriptPath} file, err : ${err}`);
                reject(err);
            } else {
                console.log(`Successfully written the ${scriptPath} file`);
                resolve();
            }
        });
    });
}

function prepareCppSource(snippet) {
    if (/\bmain\s*\(/.test(snippet)) {
        return snippet;
    }
    // You can enable the wrapper logic here if you need
    return snippet;
}

async function RunCpp(code, input = "", TimeLimit = 5) {
    return new Promise(async (resolve, reject) => {
        const scriptName = Date.now().toString();
        const scriptPath = path.join(__dirname, `${scriptName}.cpp`);
        const exeName = process.platform === 'win32' ? `${scriptName}.exe` : `${scriptName}.out`;
        const executablePath = path.join(__dirname, exeName);
        const outputFilePath = path.join(__dirname, `${scriptName}.txt`);

        const maxFileSize = parseInt(process.env.MemoryLimitForOutputFileInBytes || '', 10) || (5 * 1024 * 1024);

        const sourceToWrite = prepareCppSource(code);

        try {
            await writeCppToFile(sourceToWrite, scriptPath);
        } catch (err) {
            resolve({
                success: false,
                message: `Error occurred while writing the ${scriptPath} file`,
                verdict: "Compilation Error"
            });
            return;
        }

        execFile('g++', [scriptPath, '-o', executablePath], { timeout: 20000 }, (compileErr, stdoutCompile, stderrCompile) => {
            if (compileErr) {
                console.log(`Compilation failed: ${stderrCompile || compileErr.message}`);
                DeleteAfterExecution(scriptPath, executablePath);
                resolve({
                    success: false,
                    message: `Error occurred while Compiling the code: ${stderrCompile || compileErr.message}`,
                    verdict: "Compilation Error"
                });
                return;
            }

            const writeStream = fs.createWriteStream(outputFilePath, { flags: 'w' });
            let bytesWritten = 0;
            let killedDueTo = null;
            let stderrBuffer = "";

            const child = spawn(executablePath, [], { windowsHide: true });

            const killTimer = setTimeout(() => {
                killedDueTo = "tle";
                try { child.kill('SIGKILL'); } catch (e) { }
            }, TimeLimit * 1000);

            child.stdout.on('data', chunk => {
                const chunkBuf = Buffer.from(chunk);
                const remaining = maxFileSize - bytesWritten;
                if (remaining <= 0) {
                    killedDueTo = "mle";
                    try { child.kill('SIGKILL'); } catch (e) { }
                    return;
                }
                if (chunkBuf.length > remaining) {
                    writeStream.write(chunkBuf.slice(0, remaining), () => {
                        bytesWritten += remaining;
                        killedDueTo = "mle";
                        try { child.kill('SIGKILL'); } catch (e) { }
                    });
                } else {
                    writeStream.write(chunkBuf, () => {
                        bytesWritten += chunkBuf.length;
                    });
                }
            });
            child.stderr.on('data', data => {
                stderrBuffer += data.toString();
            });
            if (input) {
                try {
                    child.stdin.write(input);
                } catch (e) { }
            }
            try { child.stdin.end(); } catch (e) { }

            child.on('error', (err) => {
                clearTimeout(killTimer);
                writeStream.end();
                console.log("Execution spawn error:", err);
                DeleteAfterExecution(scriptPath, executablePath);
                fs.unlink(outputFilePath, () => {
                    resolve({
                        success: false,
                        message: `Error occured while running the script ${executablePath}: ${err.message}`,
                        verdict: "Runtime Error"
                    });
                });
            });

            child.on('close', (code, signal) => {
                clearTimeout(killTimer);
                writeStream.end(async () => {
                    if (killedDueTo === "tle") {
                        fs.unlink(outputFilePath, () => {
                            DeleteAfterExecution(scriptPath, executablePath);
                            resolve({
                                success: false,
                                message: `script took too long to execute.`,
                                verdict: "Time Limit Exceeded"
                            });
                            DeleteAfterExecution(scriptPath, executablePath);
                        });
                        return;
                    }
                    if (killedDueTo === "mle") {
                        fs.unlink(outputFilePath, () => {
                            DeleteAfterExecution(scriptPath, executablePath);
                            resolve({
                                success: false,
                                message: `Output File size exceeds ${(maxFileSize / (1024 * 1024)).toFixed(2)} MB`,
                                verdict: "Memory Limit Exceeded"
                            });
                        });
                        return;
                    }
                    if (code !== 0) {
                        fs.unlink(outputFilePath, () => {
                            DeleteAfterExecution(scriptPath, executablePath);
                            resolve({
                                success: false,
                                message: `Runtime Error: ${stderrBuffer || `exit code ${code}`}`,
                                verdict: "Runtime Error"
                            });
                        });
                        return;
                    }

                    fs.readFile(outputFilePath, 'utf8', (err, Outdata) => {
                        DeleteAfterExecution(scriptPath, executablePath);
                        if (err) {
                            console.log(`Student Code Output: <empty> (failed to read output)`);
                            resolve({
                                success: true,
                                outputFilePath,
                                output: "",
                                verdict: "Run Successful (but failed to read output)"
                            });
                        } else {
                            console.log(`Student Code Output: ${Outdata}`);
                            resolve({
                                success: true,
                                outputFilePath,
                                output: Outdata,
                                verdict: "Run Successful"
                            });
                        }
                    });
                });
            });

        });
    });
}

module.exports = { RunCpp, DeleteAfterExecution };
