const { exec } = require('child_process');
const { DeleteAfterExecution } = require('./Run');
const fs = require('fs');

//function outputs - 
//{ success: false, error: stderr } - if there is an error
//{ success: true, different: false } - if files are identical
//{ success: true, different: true } - if files are different

function compareTextFilesLineByLine(filePath1, filePath2) {
    console.log(`Comparing ${filePath1} and ${filePath2}`)
    return new Promise((resolve, reject) => {
        exec(`cmp ${filePath1} ${filePath2}`, (error, stdout, stderr) => {
            console.log('stdout:', stdout);
            if (stderr) {
                reject({
                    success: false,
                    error: stderr
                }, () => {
                    DeleteAfterExecution(filePath1, filePath2);
                });
            } else {
                // If stdout is empty, it means files are identical
                if (stdout.trim() === '') {
                    resolve({
                        success: true,
                        different: false
                    }, () => {
                        DeleteAfterExecution(filePath1, filePath2);
                    });
                } else {
                    resolve({
                        success: true,
                        different: true
                    }, () => {
                        DeleteAfterExecution(filePath1, filePath2);
                    });
                }
            }

        });
    });
}

// Asynchronous file reading function
function readFileAsync(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}


module.exports = { compareTextFilesLineByLine, readFileAsync };