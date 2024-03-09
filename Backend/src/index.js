const dotenv = require("dotenv");
require("dotenv").config();
dotenv.config();

const { app } = require("./app");
const { connectDB } = require("./db/mongoOperations");
const { loginRoute, logoutRoute, getProfileRoute } = require("./Auth/jwt");
const { ValidateToken, isStudent, isProfessor, ValidateWsToken } = require("./Middlewares/Auth");
const { registerCollegeRoute, registeredCollegeRoute } = require("./other/Colleges");
const { getStudentPendingAssignmentsRoute, getStudentSubmittedAssignmentsRoute, getStudentMissedAssignmentsRoute, getThisPendingAssignment } = require("./Student/Assignments");
const { getProfessorAssignmentsRoute, getBatchesRoute, getMyQuestionsRoute, getOtherQuestionsRoute, createAssignmentRoute, deleteAssignmentRoute } = require("./Professor/Assignments.js");
const { ValidateSolutionCode, ValidateRandomTestCaseCode, createQuestionRoute, FetchQuestionDetailsRoute } = require("./Professor/Question.js");
const { GetPublicQuestionDetails } = require("./Student/Question.js");
const path = require("path");

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});


app.post("/login", loginRoute);
app.delete("/logout", ValidateToken, logoutRoute);

app.post("/registerCollege", registerCollegeRoute);
app.get("/registeredColleges", registeredCollegeRoute);
app.get("/getProfile", ValidateToken, getProfileRoute);

app.get("/students/assignments/pending", ValidateToken, isStudent, getStudentPendingAssignmentsRoute);
app.get("/students/assignments/submitted", ValidateToken, isStudent, getStudentSubmittedAssignmentsRoute);
app.get("/students/assignments/missed", ValidateToken, isStudent, getStudentMissedAssignmentsRoute);
app.get("/students/getPendingAssignment/:_id", ValidateToken, isStudent, getThisPendingAssignment);                //Fetches the details of a pending assignment with the given id, called when the student clicks on submit, on a pending assignment


app.get("/getBatches", ValidateToken, isProfessor, getBatchesRoute);                                        //Sends the Batches to display in Create Assignment Modal
app.get("/professors/myAssignments", ValidateToken, isProfessor, getProfessorAssignmentsRoute);
app.get("/professors/getMyQuestions", ValidateToken, isProfessor, getMyQuestionsRoute);
app.get("/professors/getQuestionDetails/:_id", ValidateToken, isProfessor, FetchQuestionDetailsRoute)        //Fetches the details of a question with the given id (returns all details)
app.get("/professors/getOtherQuestions", ValidateToken, isProfessor, getOtherQuestionsRoute);
app.post("/professors/createAssignment", ValidateToken, isProfessor, createAssignmentRoute);                //Creates an assignment
app.delete("/professors/deleteAssignment/:_id", ValidateToken, isProfessor, deleteAssignmentRoute);         //Deletes an assignment
app.post("/professors/createQuestion", ValidateToken, isProfessor, createQuestionRoute);                    //Creates a Question


app.ws('/validateSolutionCode', ValidateWsToken, ValidateSolutionCode);
app.ws("/RunRandomTestCaseCode", ValidateWsToken, ValidateRandomTestCaseCode);




//this route is used to serve the react app
//it should be the last route because it is a catch all route, so if no other route is matched then this route is used
//this is done so that the react app can handle the routing, and the server doesn't interfere with it

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", 'build', 'index.html'));
});