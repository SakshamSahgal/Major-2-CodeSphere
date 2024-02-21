const dotenv = require("dotenv");
require("dotenv").config();
dotenv.config();

const { app } = require("./app");
const { connectDB } = require("./db/mongoOperations");
const { loginRoute, logoutRoute, getProfileRoute } = require("./Auth/jwt");
const { ValidateToken, isStudent, isProfessor } = require("./Middlewares/Auth");
const { registerCollegeRoute, registeredCollegeRoute } = require("./other/Colleges");
const { getStudentPendingAssignmentsRoute, getStudentSubmittedAssignmentsRoute, getStudentMissedAssignmentsRoute } = require("./Student/Assignments");
const { getProfessorAssignmentsRoute, getBatchesRoute } = require("./Professor/Assignments.js");
const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});


app.post("/login", loginRoute);
app.delete("/logout", ValidateToken, logoutRoute);

app.get("/registeredColleges", registeredCollegeRoute);
app.post("/registerCollege", registerCollegeRoute);
app.get("/getProfile", ValidateToken, getProfileRoute);

app.get("/students/assignments/pending", ValidateToken, isStudent, getStudentPendingAssignmentsRoute);
app.get("/students/assignments/submitted", ValidateToken, isStudent, getStudentSubmittedAssignmentsRoute);
app.get("/students/assignments/missed", ValidateToken, isStudent, getStudentMissedAssignmentsRoute);

app.get("/professors/myAssignments", ValidateToken, isProfessor, getProfessorAssignmentsRoute);
app.get("/getBatches", ValidateToken, isProfessor, getBatchesRoute);