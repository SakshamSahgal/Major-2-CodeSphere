const { writeDB, readDB } = require("../db/mongoOperations.js");
const { RequestedCollegesSchema, registeredCollegesSchema } = require("../db/schema.js");

module.exports = (app) => {

    app.post("/registerCollege", (req, res) => {
        console.log(`Recieved request to register college with collegeName: ${req.body.collegeName} and Name: ${req.body.Name} and Email: ${req.body.Email} and PhoneNo: ${req.body.PhoneNo}`)
        // console.log(req.body);
        const { collegeName, Name, Email, PhoneNo } = req.body;

        writeDB("Colleges", "Requested", { collegeName: collegeName, Name: Name, Email: Email, PhoneNo: parseInt(PhoneNo) }, RequestedCollegesSchema).then((result) => {
            res.json({
                success: true,
                message: "Registration Request sent successfully! We will contact you soon.",
            })
            return;
        }).catch((err) => {
            console.log(err);
            res.json({
                success: false,
                message: `Registration Request failed, Error while writing RegistrationRequests DB and Colleges Collection`
            })
            return;
        })
    })

    app.get("/registeredColleges", (req, res) => {
        console.log(`Recieved request to get list of registered colleges`)
        readDB("Colleges", "Registered", {}, registeredCollegesSchema).then((result) => {
            res.json({
                success: true,
                message: "College List",
                result: result
            })
        }).catch((err) => {
            console.log(err);
            res.json({
                success: false,
                message: "Error while reading Colleges DB / Registered Collection"
            })
        })
    })
}