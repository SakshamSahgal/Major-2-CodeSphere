const { writeDB, readDB } = require("../db/mongoOperations.js");
const { RequestedCollegesSchema, registeredCollegesSchema } = require("../db/schema.js");


async function registeredCollegeRoute(req, res) {
    try {
        const colleges = await readDB("Colleges", "Registered", {}, registeredCollegesSchema);
        console.log("Fetched colleges:", colleges); 
        res.json({
            success: true,
            message: "College List",
            result: colleges
        });
    } catch (err) {
        console.error("Error fetching colleges:", err); // <-- Add this line
        res.status(500).json({
            success: false,
            message: "Error fetching colleges",
            error: err.message
        });
    }
}

// This is the function to register a college. 
// It will take the collegeName, Name, Email and PhoneNo from the request body 
// and write it to the Colleges DB / Requested Collection.

function registerCollegeRoute(req, res) {
    console.log(`Recieved request to register college with collegeName: ${req.body.CollegeName} and Name: ${req.body.Name} and Email: ${req.body.Email} and PhoneNo: ${req.body.PhoneNo}`)
    console.log(req.body);
    const { CollegeName, Name, Email, PhoneNo } = req.body;

    writeDB("Colleges", "Requested", { CollegeName: CollegeName, Name: Name, Email: Email, PhoneNo: parseInt(PhoneNo) }, RequestedCollegesSchema).then((result) => {
        res.json({
            success: true,
            message: "Registration Request sent successfully! We will contact you soon.",
        })
        return;
    }).catch((err) => {
        console.log(err);
        res.json({
            success: false,
            message: `Registration Request failed, err : ${err}`
        })
        return;
    })
}

module.exports = { registeredCollegeRoute, registerCollegeRoute }