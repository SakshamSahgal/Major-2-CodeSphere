
import NavbarWithProfileAndSidebar from "../../../components/Navbar/NavbarWithProfileAndSidebar";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import fetchAPI from '../../../Scripts/Axios';
import { toast } from 'react-toastify';

function EvaluateSubmission() {

    const { _id } = useParams();
    const [submissionDetails, setSubmissionDetails] = useState(null);

    useEffect(() => {
        const fetchSubmissionDetails = async () => {
            try {
                const response = await fetchAPI(`/professors/analyzeSubmission/${_id}`);
                console.log(response.data);
                if (response.data.success) {
                    toast.success(response.data.message);
                    setSubmissionDetails(response.data.submission);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(`Error while fetching submission details, error: ${error.message}`);
            }
        };

        fetchSubmissionDetails();
    } , [_id]);

    console.log(submissionDetails);

    return (
        <>
            <NavbarWithProfileAndSidebar />
        </>
    )
}

export default EvaluateSubmission;