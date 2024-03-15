import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import LoadingSpinner from '../../../components/Spinners/Spinners';
import SolveQuestion from './SolveQuestion';
import SubmitEvaluationNavbar from '../../../components/Navbar/SubmitEvaluationNavbar';
import AssignmentDetailsAccordion from '../../../components/Accordion/AssignmentDetailsAccordion';

function SolveAssignment() {

    const { _id } = useParams();
    const [AssignmentDetails, setAssignmentDetails] = useState(null);

    useEffect(() => {
        const FetchAssignment = async () => {
            try {
                console.log("fetching assignment Details")
                const response = await axios.get(`/students/getPendingAssignment/${_id}`, { withCredentials: true })
                console.log(response.data);
                if (response.data.success) {
                    toast.success(response.data.message);
                    setAssignmentDetails(response.data.Assignment);
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
            <SubmitEvaluationNavbar  />
            <div className="container">

                <div className="row">
                    <div className="col">
                        <AssignmentDetailsAccordion PostedBy={AssignmentDetails?.PostedBy.Name} PostedOn={AssignmentDetails?.PostedOn} DueTimestamp={AssignmentDetails?.DueTimestamp} Batches={AssignmentDetails?.Batches} Year={AssignmentDetails?.Year} NumberOfQuestions={AssignmentDetails?.Questions.length} />
                    </div>
                </div>
                <SolveQuestion Questions={AssignmentDetails?.Questions} AssignmentId={AssignmentDetails?._id} />
            </div>
        </>
    );
}

export default SolveAssignment;

