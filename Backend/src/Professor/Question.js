

function TestSolutionCode(ws, req) {
    console.log('WebSocket connection established');

    ws.on('message', (message) => {
        console.log('Received message:', message);
        // Handle incoming messages
    });

    ws.on('close', () => {
        console.log('Connection closed');
        // Perform cleanup or logging
    });
}

module.exports = { TestSolutionCode };