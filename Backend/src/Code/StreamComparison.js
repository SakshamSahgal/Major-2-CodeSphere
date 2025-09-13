// StreamComparison.js
const fs = require('fs');
const { DeleteAfterExecution } = require('./Run');

// Compare two text files in a cross-platform way.
// Returns Promise resolving to:
//  - { success: true, different: false }  (identical)
//  - { success: true, different: true }   (different)
//  - { success: false, error: "..." }     (error)
function compareTextFilesLineByLine(filePath1, filePath2) {
    console.log(`Comparing ${filePath1} and ${filePath2}`);
    return new Promise(async (resolve) => {
        try {
            const [raw1, raw2] = await Promise.all([
                fs.promises.readFile(filePath1, 'utf8'),
                fs.promises.readFile(filePath2, 'utf8')
            ]);

            // Normalize line endings and trailing spaces on each line:
            const normalize = (s) =>
                s
                    .replace(/\r\n/g, '\n')
                    .split('\n')
                    .map(line => line.replace(/\s+$/, '')) // strip trailing whitespace
                    .join('\n')
                    .replace(/\s+$/g, ''); // trim end

            const n1 = normalize(raw1);
            const n2 = normalize(raw2);

            const identical = n1 === n2;

            // Delete both output files after comparison (non-blocking)
            DeleteAfterExecution(filePath1, filePath2);

            resolve({
                success: true,
                different: !identical
            });
        } catch (err) {
            console.log('Error comparing files:', err);
            // try to delete files anyway
            DeleteAfterExecution(filePath1, filePath2);
            resolve({
                success: false,
                error: err.message || String(err)
            });
        }
    });
}

function readFileAsync(filePath) {
    return fs.promises.readFile(filePath, 'utf8');
}

module.exports = { compareTextFilesLineByLine, readFileAsync };
