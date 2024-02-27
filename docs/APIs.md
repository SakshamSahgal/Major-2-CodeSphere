
# ALL APIs interacting with the Server


| Sr.No | Endpoints                                         | Request Method | Middlewares Used                                                                         |
| ----- | ------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------- |
| 1.    | [/login](APIs/login.md)                           | `POST`         | N/A                                                                                      |
| 2.    | [/logout](APIs/logout.md)                         | `DELETE `      | [ValidateToken](Middlewares/ValidateToken.md)                                            |
| 3.    | [/registerCollege](APIs/registerCollege.md)       | `POST`         | N/A                                                                                      |
| 4.    | [/registeredColleges](APIs/registeredColleges.md) | `GET`          | N/A                                                                                      |
| 5.    | [/getProfile](APIs/getProfile.md)                 | `GET`          | [ValidateToken](Middlewares/ValidateToken.md)                                            |
| 6.    | [/students/assignments/pending]()                 | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isStudent](Middlewares/isStudent.md)     |
| 7.    | [/students/assignments/submitted]()               | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isStudent](Middlewares/isStudent.md)     |
| 8.    | [/students/assignments/missed]()                  | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isStudent](Middlewares/isStudent.md)     |
| 9.    | [/getBatches]()                                   | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md) |
| 10.   | [/professors/myAssignments]()                     | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md) |
| 11.   | [/professors/getMyQuestions]()                    | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md) |
| 12.   | [/professors/getOtherQuestions]()                 | `GET`          | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md) |
| 13.   | [/professors/createAssignment]()                  | `POST`         | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md) |
| 14.   | [/professors/deleteAssignment/:_id]()             | `DELETE `      | [ValidateToken](Middlewares/ValidateToken.md), [isProfessor](Middlewares/isProfessor.md) |

