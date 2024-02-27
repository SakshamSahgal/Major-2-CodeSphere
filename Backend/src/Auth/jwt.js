const jwt = require('jsonwebtoken');
const { readDB } = require("../db/mongoOperations");
const { StudentsSchema, professorsSchema } = require('../db/schema');


function loginRoute(req, res) {
    console.log(req.body)
    console.log(`Recieved request to login with Username: ${req.body.Username} and Password: ${req.body.Password} and Institution: ${req.body.Institution} and LoginType: ${req.body.LoginType}`)

    const { Username, Password, Institution, LoginType } = req.body;

    const requiredFields = ['LoginType', 'Username', 'Password', 'Institution'];

    for (const field of requiredFields) {
        if (req.body[field] === undefined) {
            return res.json({
                success: false,
                message: `Login failed, ${field} not recieved!`
            });
        }
    }

    //LoginType can be = "Students" or "Professors"

    //if login type is not Students or Professors
    if (!["Students", "Professors"].includes(LoginType)) {
        res.json({
            success: false,
            message: `Login failed, invalid Login Type ${LoginType}, it should be either Students or Professors`
        })
        return;
    }

    //Institution can be = any Institution name
    //username and password are the credentials entered by the user

    let SchemaToBeUsed = (LoginType == "Students") ? StudentsSchema : professorsSchema

    readDB(LoginType, Institution, { Username: Username, Password: Password }, SchemaToBeUsed).then((result) => {

        if (result.length == 1) {

            const payload = {
                Username: Username,
                Password: Password,
                LoginType: LoginType,
                Institution: Institution,
                _id: result[0]._id,
                DB: result[0]
            }

            console.log("Payload : ")
            console.log(payload);
            const secretKey = process.env.JWT_SECRET_KEY;
            const token = jwt.sign(payload, secretKey);

            console.log('Generated Token:', token);

            res.status(200).cookie(`token`, token, {
                sameSite: 'none',
                secure: true,                   // Set to true to ensure the cookie is only sent over HTTPS
            }).json({
                success: true,
                message: "Login Successful",
            })

            return;

        } else {

            res.json({
                success: false,
                message: "Login failed, invalid credentials"
            })

            return;
        }
    }).catch((err) => {
        console.log(err);
        res.json({
            success: false,
            message: `Login failed, Error while reading ${LoginType} ${Institution} DB`
        })
        return;
    })
}

function logoutRoute(req, res) {
    console.log("Recieved request to logout")
    console.log(req.cookies)
    res.clearCookie('token').json({
        success: true,
        message: "Logout Successful"
    })
}

//This route is used to get the profile of the user
//It will send the profile of the user based on req.decoded.LoginType
//If the user is a student it will send the profile of the student containing Batch, Name, Username, Year and Institution
//If the user is a professor it will send the profile of the professor, containing Name, Username and Institution

function getProfileRoute(req, res) {
    console.log("Recieved request to get profile")
    console.log(req.decoded)
    if(req.decoded.LoginType == "Professors"){
        res.json({
            success: true,
            message: "Profile fetched successfully",
            profile: {
                Name : req.decoded.DB.Name,
                Username : req.decoded.DB.Username,
                Institution : req.decoded.Institution,
            }
        })
        return;
    }
    else if(req.decoded.LoginType == "Students"){
        res.json({
            success: true,
            message: "Profile fetched successfully",
            profile: {
                Batch : req.decoded.DB.Batch,
                Name : req.decoded.DB.Name,
                Username : req.decoded.DB.Username,
                Year : req.decoded.DB.Year,
                Institution : req.decoded.Institution,
            }
        })
        return;
    }
}

module.exports = { loginRoute, logoutRoute, getProfileRoute }