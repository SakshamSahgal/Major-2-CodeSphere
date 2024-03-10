const jwt = require('jsonwebtoken');

// This middleware is used to validate the token in the cookies
// It takes the token from req.cookies.token
// If the token is not present it will send a response with status 401
// If the token is invalid it will send a response with status 401
// If the token is valid it will call the next middleware , the decoded payload is stored in req.decoded

function ValidateToken(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                // console.log("Error in verifying token")
                res.status(401).json({
                    success: false,
                    message: "Invalid Token"
                })
            }
            else {
                req.decoded = decoded; // This is the decoded payload
                next();
            }
        })
    }
    else {
        // console.log("Token not found")
        res.status(401).json({
            success: false,
            message: "Token not found"
        })
    }
}

// This middleware is used to authenticate the websocket connection
function ValidateWsToken(ws, req, next) {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                // console.log("Error in verifying token");
                ws.send(JSON.stringify({
                    success: false,
                    message: "Invalid Token"
                }), () => {
                    ws.close(1008); //1008 is the status code for Policy Violation
                });
            } else {
                console.log('JWT verified. User:', decoded);
                req.decoded = decoded; // Attach user information to WebSocket object if needed
                next();
            }
        });
    } else {
        ws.send(JSON.stringify({
            success: false,
            message: "Token not found"
        }), () => {
            ws.close(1008);  //1008 is the status code for Policy Violation
        });
    }
}


// This Middleware is used to check if the user is a student
// It checks the req.decoded.LoginType
// If the user is a student it will call the next middleware
// If the user is not a student it will send a response with status 401 which means unauthorized

function isStudent(req, res, next) {
    if (req.decoded.LoginType === "Students") {
        next();
    }
    else {
        res.status(401).json({
            success: false,
            message: "You are not authorized to access this route"
        })
    }
}

// This Middleware is used to check if the user is a professor
// It checks the req.decoded.LoginType
// If the user is a professor it will call the next middleware
// If the user is not a professor it will send a response with status 401 which means unauthorized

function isProfessor(req, res, next) {
    if (req.decoded.LoginType === "Professors") {
        next();
    }
    else {
        res.status(401).json({
            success: false,
            message: "You are not authorized to access this route"
        })
    }
}

function isProfessorWs(ws, req, next) {
    if (req.decoded.LoginType === "Professors") {
        next();
    } else {
        ws.send(JSON.stringify({
            success: false,
            message: "You are not authorized to access this route"
        }), () => {
            ws.close(1008);  //1008 is the status code for Policy Violation
        });
    }
}

module.exports = { ValidateToken, isStudent, isProfessor, isProfessorWs, ValidateWsToken }

