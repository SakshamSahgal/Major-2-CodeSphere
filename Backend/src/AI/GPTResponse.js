const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


async function GetGPTResponse(code, problemStatement, SystemQuestion) {
    const messages = [
        {
            role: 'system',
            content: `C++ Code Analysis. You will be given a code along with its problem statement. Use concise language that is suitable for students. ${SystemQuestion}`
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
        return (response.choices[0].message.content);
    } catch (e) {
        console.log(e);
        return ("Error Generating AI response. Please try again later.");
    }
}

async function getImprovementAIAssistance(req, res) {
    console.log(`recieved GPT Assistance Request. CODE : ${req.body.code} PROBLEM : ${req.body.problem}`)
    let GPTResponse = await GetGPTResponse(req.body.code, req.body.problem, "Based on Problem Statement and code, provide suggestions for improving the code with regard to complexity, readability. etc.");
    res.send({
        success: true,
        message: "Successfully generated AI response for the improvement tab.",
        response: GPTResponse
    });
}

async function getAltApproachesAIAssistance(req, res) {
    console.log(`recieved GPT Assistance Request. CODE : ${req.body.code} PROBLEM : ${req.body.problem}`)
    let GPTResponse = await GetGPTResponse(req.body.code, req.body.problem, "Based on Problem Statement and code, suggest alternative approaches for solving the problem.");
    res.send({
        success: true,
        message: "Successfully generated AI response for the alternative approaches tab.",
        response: GPTResponse
    });
}

async function getErrorAIAssistance(req, res) {
    console.log(`recieved GPT Assistance Request. CODE : ${req.body.code} PROBLEM : ${req.body.problem}`)
    let GPTResponse = await GetGPTResponse(req.body.code, req.body.problem, "Based on Problem Statement and code, identify any syntax errors or logical issues in the code provided, if present.");
    res.send({
        success: true,
        message: "Successfully generated AI response for the error tab.",
        response: GPTResponse
    });
}


module.exports = { getImprovementAIAssistance, getAltApproachesAIAssistance, getErrorAIAssistance };