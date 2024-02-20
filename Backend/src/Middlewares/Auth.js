const jwt = require('jsonwebtoken');

// This middleware is used to validate the token in the cookies
// if the token is not present it will send a response with status 401
// if the token is invalid it will send a response with status 401
// if the token is valid it will call the next middleware

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

module.exports = { ValidateToken, isStudent, isProfessor }

