
function countLines(code) {
    return String(code).split(';').length - 1;
}

function countComments(code) {
    const cppComments = code.match(/\/\/.*|\/\*[\s\S]*?\*\//g);
    return cppComments ? cppComments.length : 0;
}

//Cyclomatic complexity is a measure used to quantify the complexity of a program by counting the number of decision points in the control flow graph of the program
function cyclomaticComplexity(code) {
    try {
        // Initialize variables to store the count of decision points and exits
        let decisionPoints = 0;
        let exits = 0;

        // Match all words in the code using regular expression
        const words = code.match(/\b\w+\b/g) || [];
        // Loop through each word found in the code
        words.forEach(word => {
            // Check if the word is one of the decision points
            if (["if", "else", "while", "for", "switch", "case", "try", "catch"].includes(word)) {
                // If it is, increment the decision points count
                decisionPoints++;
                // Check if the word is one of the exits
            } else if (["return", "break", "continue", "goto", "throw"].includes(word)) {
                // If it is, increment the exits count
                exits++;
            }
        });

        // Calculate the cyclomatic complexity
        const complexity = decisionPoints + 1 - exits;
        // Return the calculated complexity
        return complexity;
    } catch (error) {
        // If an error occurs during processing, log the error message
        console.error(`Error processing code: ${error}`);
        // Return null to indicate failure
        return null;
    }
}

function countIndents(code) {
    const numIndents = (code.match(/{/g) || []).length;
    return numIndents;
}

function countLoops(code) {
    const loopKeywords = ['for', 'while', 'if'];
    const lowerCaseCode = code.toLowerCase();
    const count = loopKeywords.reduce((acc, keyword) => {
        const regex = new RegExp(keyword, 'g');
        return acc + (lowerCaseCode.match(regex) || []).length;
    }, 0);
    return count;
}

function countIdentifiers(code) {
    try {
        const identifierKeywords = ["int", "float", "double", "string", "char", "const", "bool", "void", "struct", "class", "namespace"];
        const regex = new RegExp(`\\b(${identifierKeywords.join('|')})\\b`, 'g');
        const matches = (code.match(regex) || []);
        return matches.length;
    } catch (error) {
        console.error(`Error processing code: ${error}`);
        return null;
    }
}


module.exports = { countLines, countComments, cyclomaticComplexity, countIndents, countLoops, countIdentifiers }