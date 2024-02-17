const jwt = require('jsonwebtoken');

function ValidateToken(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log("Error in verifying token")
                res.json({
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
        console.log("Token not found")
        res.json({
            success: false,
            message: "Token not found"
        })
    }
}

module.exports = { ValidateToken }

