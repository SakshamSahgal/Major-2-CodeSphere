
# ALL APIs interacting with the Server


| Common APIs |                                                   |                |                                               |
| ----------- | ------------------------------------------------- | -------------- | --------------------------------------------- |
| Sr.No       | Endpoints                                         | Request Method | Middlewares Used                              |
| 1.          | [/login](APIs/login.md)                           | `POST`         | N/A                                           |
| 2.          | [/logout](APIs/logout.md)                         | `DELETE `      | [ValidateToken](Middlewares/ValidateToken.md) |
| 3.          | [/registerCollege](APIs/registerCollege.md)       | `POST`         | N/A                                           |
| 4.          | [/registeredColleges](APIs/registeredColleges.md) | `GET`          | N/A                                           |
| 5.          | [/getProfile](APIs/getProfile.md)                 | `GET`          | [ValidateToken](Middlewares/ValidateToken.md) |



| Student APIs |                                                             |                |                                                                                                                                                   |
| ------------ | ----------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sr.No        | Endpoints                                                   | Request Method | Middlewares Used                                                                                                                                  |
| 1.           | [/students/assignments/pending]()                           | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isStudent](Middlewares/isStudent.md)                                                              |
| 2.           | [/students/assignments/submitted]()                         | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isStudent](Middlewares/isStudent.md)                                                              |
| 3.           | [/students/assignments/missed]()                            | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isStudent](Middlewares/isStudent.md)                                                              |
| 4.           | [/students/getPendingAssignment/:_id]()                     | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isStudent](Middlewares/isStudent.md)                                                              |
| 5.           | [/students/assignments/runCode/:assignmentId/:questionId]() | `ws`           | [ValidateWsToken](), [isStudentWs](), [ValidateInputs](), [CheckQuestionInAssignment](), [findQuestion](), [ValidateTestCases]()                  |
| 6.           | [/students/assignments/evaluateAssignment/:assignmentId]()  | `ws`           | [ValidateWsToken](), [isStudentWs](), [ValidateAssignmentId](), [FindAssignment](), [ValidateQuestionsInAssignment](), [CheckIfAllowedToSubmit]() |
| 7.           | [/students/assignment/unsubmit/:_id]()                      | `PUT`          | [ValidateToken](), [isStudent](),[CheckSubmission]()                                                                                              |
| 8.           | [/getPublicQuestion/:_id]()                                 | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isStudent](Middlewares/isStudent.md)                                                              |
| 9.           | [/GetImprovementAIAssistance]()                             | `PUT`          | [ValidateToken](Middlewares/ValidateToken.md)                                                                                                     |
| 10.          | [/GetAltApproachesAIAssistance]()                           | `PUT`          | [ValidateToken](Middlewares/ValidateToken.md)                                                                                                     |
| 11.          | [/GetErrorAIAssistance]()                                   | `PUT`          | [ValidateToken](Middlewares/ValidateToken.md)                                                                                                     |



| Professor APIs |                                         |                |                                                                                                                                                      |
| -------------- | --------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sr.No          | Endpoints                               | Request Method | Middlewares Used                                                                                                                                     |
| 1.             | [/getBatches]()                         | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md)                                                             |
| 2.             | [/professors/myAssignments]()           | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md)                                                             |
| 3.             | [/professors/getMyQuestions]()          | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md)                                                             |
| 4.             | [/professors/getOtherQuestions]()       | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md)                                                             |
| 5.             | [/professors/getQuestionDetails/:_id]() | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md)                                                             |
| 6.             | [/professors/createAssignment]()        | `POST`         | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md)                                                             |
| 7.             | [/professors/deleteAssignment/:_id]()   | `DELETE `      | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md)                                                             |
| 8.             | [/professors/deleteQuestion/:_id]()     | `DELETE`       | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md), [checkIfQuestionExists](), [CheckIfAddedInAnyAssignment]() |
| 9.             | [/professors/createQuestion]()          | `POST`         | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md)                                                             |
| 10.            | [/professors/updateQuestion]()          | `PUT`          | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md), [checkIfQuestionIsCreatedByThisProfessor]()                |
| 11.            | [/professors/viewSubmissions/:_id]()    | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [CheckAssignment]()                                                                                   |
| 12.            | [/professors/analyzeSubmission/:_id]()  | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md)                                                             |
| 13.            | [/validateSolutionCode]()               | `ws`           | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md)                                                             |
| 14.            | [/RunRandomTestCaseCode]()              | `ws`           | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md)                                                             |
| 15.            | [/GetFullQuestion/:_id]()               | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md)                                                             |
