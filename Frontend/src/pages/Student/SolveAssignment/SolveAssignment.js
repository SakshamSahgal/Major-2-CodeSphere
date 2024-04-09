import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchAPI } from '../../../Scripts/Axios';
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
    const [AssignmentDetails, setAssignmentDetails] = useState(null); //AssignmentDetails also contains the public details of each question
    const [UserCodes, setUserCodes] = useState([]);


    //UserCodes should be an array of object with each object having the following structure

    // {
    //     QuestionName: String,
    //     UserCode: String,
    //     QuestionId: String
    // }

    useEffect(() => {
        const FetchAssignment = async () => {
            try {
                console.log("fetching assignment Details")
                const response = await fetchAPI(`/students/getPendingAssignment/${_id}`);
                console.log(response.data);
                if (response.data.success) {
                    toast.success(response.data.message);
                    setAssignmentDetails(response.data.Assignment);

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
            <SubmitAssignmentNavbar _id={_id} UserCodes={UserCodes} />
            <div className="container">
                <div className="row">
                    <div className="col">
                        <AssignmentDetailsAccordion PostedBy={AssignmentDetails?.PostedBy.Name} PostedOn={AssignmentDetails?.PostedOn} DueTimestamp={AssignmentDetails?.DueTimestamp} Batches={AssignmentDetails?.Batches} Year={AssignmentDetails?.Year} NumberOfQuestions={AssignmentDetails?.Questions.length} AIAssistance={AssignmentDetails.AIAssistance}/>
                    </div>
                </div>
                <SolveQuestion Questions={AssignmentDetails?.Questions} AssignmentId={AssignmentDetails?._id} UserCodes={UserCodes} setUserCodes={setUserCodes} AIAssistance={AssignmentDetails.AIAssistance}/>
            </div>
        </>
    );
}

export default SolveAssignment;

