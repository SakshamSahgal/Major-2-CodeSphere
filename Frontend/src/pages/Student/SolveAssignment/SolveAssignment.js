import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import LoadingSpinner from '../../../components/Spinners/Spinners';
import SolveQuestion from './SolveQuestion';
import SubmitAssignmentNavbar from '../../../components/Navbar/SubmitAssignmentNavbar';
import AssignmentDetailsAccordion from '../../../components/Accordion/AssignmentDetailsAccordion';

let DefaultUserCode =

    `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!";
    return 0;
}`;

function SolveAssignment() {

    const { _id } = useParams();
    const [AssignmentDetails, setAssignmentDetails] = useState(null);
    const [UserCodes, setUserCodes] = useState([]);
    const [QuestionNames, setQuestionNames] = useState([]);
    console.log(UserCodes);
    //setSolutionCodes should be an array of object with each object having the following structure
    // {
    //     QuestionName: String,
    //     SolutionCode: String,
    //       QuestionId: String
    // }

    useEffect(() => {
        const FetchAssignment = async () => {
            try {
                console.log("fetching assignment Details")
                const response = await axios.get(`/students/getPendingAssignment/${_id}`, { withCredentials: true })
                if (response.data.success) {
                    toast.success(response.data.message);
                    setAssignmentDetails(response.data.Assignment);
                    //filter and set the question names from response.data.Assignment.Questions
                    const questionNames = response.data.Assignment.Questions.map((question) => {
                        return question.QuestionName;
                    });
                    setQuestionNames(questionNames);
                    //set the solutionCodes array with default solution code for each question and question name and id
                    const defaultSolutionCodes = response.data.Assignment.Questions.map((question) => {
                        return {
                            QuestionName: question.QuestionName,
                            UserCode: DefaultUserCode,
                            QuestionId: question._id
                        };
                    });
                    setUserCodes(defaultSolutionCodes);

                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(`Error fetching Assignment. Please try again later. err : ${error}`);
            }
        }
        FetchAssignment();
    }, []);

    if (AssignmentDetails === null) {
        return <LoadingSpinner />
    }

    return (
        <>
            <SubmitAssignmentNavbar _id={_id} UserCodes={UserCodes} QuestionNames={QuestionNames} />
            <div className="container">
                <div className="row">
                    <div className="col">
                        <AssignmentDetailsAccordion PostedBy={AssignmentDetails?.PostedBy.Name} PostedOn={AssignmentDetails?.PostedOn} DueTimestamp={AssignmentDetails?.DueTimestamp} Batches={AssignmentDetails?.Batches} Year={AssignmentDetails?.Year} NumberOfQuestions={AssignmentDetails?.Questions.length} />
                    </div>
                </div>
                <SolveQuestion Questions={AssignmentDetails?.Questions} AssignmentId={AssignmentDetails?._id} UserCodes={UserCodes} setUserCodes={setUserCodes} />
            </div>
        </>
    );
}

export default SolveAssignment;

