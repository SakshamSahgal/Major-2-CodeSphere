const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getGPTResponse(req, res) {
    console.log(`recieved GPT Assistance Request. CODE : ${req.body.code} PROBLEM : ${req.body.problem}`)

    const problemStatement = req.body.problem
    console.log(problemStatement);

    // Read code from file
    const code = req.body.code
    console.log(code);
    console.log(problemStatement);

    const messages = [
        {
            role: 'system',
            content: `C++ Code Analysis. You will be given a code along with its problem statement. Use concise language that is suitable for students.
                        Questions:
                        1. Provide suggestions for improving the code with regard to complexity, readability. etc.
                        2. Suggest alternative approaches for solving the problem.
                        3. Identify any syntax errors or logical issues in the code provided, if present`,
        },
        {
            role: 'user',
            content: `Problem Statement: ${problemStatement}\nCode: ${code}`,
        },
    ];

    const parameters = {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0, // this parameter is used to control the randomness of the output
        max_tokens: 250, // this parameter is used to control the length of the output to 250 tokens
        top_p: 1, // this parameter is used to control the randomness of the output
        frequency_penalty: 0,
        presence_penalty: 0,
    };
    try {
        const response = await client.chat.completions.create(parameters);
        console.log(response);
        res.send(response.choices[0].message.content);
    } catch (e) {
        console.log(e);
        res.send("Error Generating AI response. Please try again later.");
    }
}


module.exports = { getGPTResponse };