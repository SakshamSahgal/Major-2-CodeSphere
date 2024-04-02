const dotenv = require("dotenv");
require("dotenv").config();
dotenv.config();

const { app } = require("./app");
const { connectDB } = require("./db/mongoOperations");
const { loginRoute, logoutRoute, getProfileRoute } = require("./Auth/jwt");
const { ValidateToken, isStudent, isProfessor, ValidateWsToken, isProfessorWs, isStudentWs } = require("./Middlewares/Auth");
const { registerCollegeRoute, registeredCollegeRoute } = require("./other/Colleges");
const { getStudentPendingAssignmentsRoute, getStudentSubmittedAssignmentsRoute, getStudentMissedAssignmentsRoute, getThisPendingAssignment } = require("./Student/Assignments");
const { getProfessorAssignmentsRoute, getBatchesRoute, getMyQuestionsRoute, getOtherQuestionsRoute, createAssignmentRoute, deleteAssignmentRoute } = require("./Professor/Assignments.js");
const { ValidateSolutionCode, ValidateRandomTestCaseCode, createQuestionRoute, FetchFullQuestionDetailsRoute, CheckIfQuestionExists, CheckIfAddedInAnyAssignment, deleteQuestionRoute } = require("./Professor/Question.js");
const { ValidateInputs, CheckQuestionInAssignment, findQuestion, ValidateTestCases, RunOutputComparison } = require("./Student/Submission.js");
const { ValidateAssignmentId, FindAssignment, ValidateQuestionsInAssignment, CheckIfAllowedToSubmit, EvaluateAssignment } = require("./Student/Assignments.js");
const { CheckAssignment, getSubmissions, analyzeSubmission } = require("./Professor/Submissions.js");
const { FetchPublicQuestionDetails } = require("./Student/Question.js");
const path = require("path");

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});


app.post("/login", loginRoute);                                   //called when any user logs in, this function validates fields and sets a JWT token in the cookies
app.delete("/logout", ValidateToken, logoutRoute);                //called when any user logs out, clears the JWT token from the cookies

app.post("/registerCollege", registerCollegeRoute);               //called when a new college is registered
app.get("/registeredColleges", registeredCollegeRoute);           //called when the list of registered colleges is fetched for the dropdown in the login page
app.get("/getProfile", ValidateToken, getProfileRoute);           //called when any user clicks on the profile button, returns the profile of the user

app.get("/students/assignments/pending", ValidateToken, isStudent, getStudentPendingAssignmentsRoute);      //called when the student clicks on the pending assignments tab
app.get("/students/assignments/submitted", ValidateToken, isStudent, getStudentSubmittedAssignmentsRoute);  //called when the student clicks on the submitted assignments tab
app.get("/students/assignments/missed", ValidateToken, isStudent, getStudentMissedAssignmentsRoute);        //called when the student clicks on the missed assignments tab
app.get("/students/getPendingAssignment/:_id", ValidateToken, isStudent, getThisPendingAssignment);         //Fetches the details of a pending assignment with the given id, called when the student clicks on solve, on a pending assignment
app.ws(`/students/assignments/runCode/:assignmentId/:questionId`, ValidateWsToken, isStudentWs, ValidateInputs, CheckQuestionInAssignment, findQuestion, ValidateTestCases, RunOutputComparison);  //called when the student clicks on the run button of any question while solving an assignment
app.ws("/students/assignments/evaluateAssignment/:assignmentId", ValidateWsToken, isStudentWs, ValidateAssignmentId, FindAssignment, ValidateQuestionsInAssignment, CheckIfAllowedToSubmit, EvaluateAssignment);  //called when the student clicks on the submit button of an assignment

app.get("/getBatches", ValidateToken, isProfessor, getBatchesRoute);                                                                                   //Sends the Batches to display in Create Assignment Modal, to be used in checkboxes for selecting batches
app.get("/professors/myAssignments", ValidateToken, isProfessor, getProfessorAssignmentsRoute);                                                        //called when the professor clicks on the assignments tab, returns the list of assignments created by the professor
app.get("/professors/getMyQuestions", ValidateToken, isProfessor, getMyQuestionsRoute);                                                                //called when the create assignment modal/ Questions Tab is opened, returns the list of questions created by the professor to be used in the assignment
app.get("/professors/getOtherQuestions", ValidateToken, isProfessor, getOtherQuestionsRoute);                                                          //called when the create assignment modal/ Questions Tab is opened, returns the list of questions created by other professors to be used in the assignment  
app.get("/professors/getQuestionDetails/:_id", ValidateToken, isProfessor, FetchFullQuestionDetailsRoute)                                              //Fetches the details of a question with the given id (returns all details), used when the professor clicks on a question
app.post("/professors/createAssignment", ValidateToken, isProfessor, createAssignmentRoute);                                                           //Creates an assignment
app.delete("/professors/deleteAssignment/:_id", ValidateToken, isProfessor, deleteAssignmentRoute);                                                    //Deletes an assignment, called when the professor clicks on the bin button of an assignment
app.delete("/professors/deleteQuestion/:_id", ValidateToken, isProfessor, CheckIfQuestionExists, CheckIfAddedInAnyAssignment, deleteQuestionRoute);                //Deletes a question, called when the professor clicks on the bin button of a question
app.post("/professors/createQuestion", ValidateToken, isProfessor, createQuestionRoute);                        //Creates a Question
app.get("/professors/viewSubmissions/:_id", ValidateToken, CheckAssignment, getSubmissions);                    //Fetches the submissions of an assignment with the given id(assignment Id), called when the professor/student clicks on the submissions button of an assignment
app.get("/professors/analyzeSubmission/:_id", ValidateToken, isProfessor, analyzeSubmission);                   //Fetches the submissions of an assignment with the given id(assignment Id), called when the professor clicks on the submissions button of an assignment

app.ws('/validateSolutionCode', ValidateWsToken, isProfessorWs, ValidateSolutionCode);             //called when the professor clicks on the validate button of solution code while creating a question
app.ws("/RunRandomTestCaseCode", ValidateWsToken, isProfessorWs, ValidateRandomTestCaseCode);      //called when the professor clicks on the run button of random test case code while creating a question

app.get("/GetFullQuestion/:_id", ValidateToken, isProfessor, FetchFullQuestionDetailsRoute);        //called when the professor clicks on the question.
app.get("/getPublicQuestion/:_id", ValidateToken, isStudent, FetchPublicQuestionDetails);           //called when the student clicks on the question.




//this route is used to serve the react app
//it should be the last route because it is a catch all route, so if no other route is matched then this route is used
//this is done so that the react app can handle the routing, and the server doesn't interfere with it

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", 'build', 'index.html'));
});