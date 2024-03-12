const { exec } = require('child_process');
const { DeleteAfterExecution } = require('./Run');

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

module.exports = { compareTextFilesLineByLine };