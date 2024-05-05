
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function GetGiminiResponse(code, problemStatement, SystemQuestion) {

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const generationConfig = {
            maxOutputTokens: 250,
            temperature: 0, //this is used to control the randomness of the output, it ranges from 0 to 1, the higher the value the more random the output
            topP: 1,
            topK: 16, //this is used to control the diversity of the output, it ranges from 1 to infinity, the higher the value the more diverse the output
        };

        const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

        const prompt = `You will be given a C++ code along with its problem statement. Use concise language that is suitable for students. ${SystemQuestion},Problem Statement: ${problemStatement}\nCode: ${code}`

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return (text);
    } catch (e) {
        console.log(e);
        return ("Error Generating AI response. Please try again later.");
    }


}

async function getAIAssistance(req, res) {
    console.log(`recieved GPT Assistance Request. CODE : ${req.body.code} PROBLEM : ${req.body.problem}`)
    let GeminiResponse = await GetGiminiResponse(req.body.code, req.body.problem, "Based on Problem Statement and code, Suggest improvements, alternative approaches and identify any errors in the code provided, if present.");
    res.send({
        success: true,
        message: "Successfully generated AI response for the error tab.",
        response: GeminiResponse
    });
}

module.exports = { getAIAssistance };