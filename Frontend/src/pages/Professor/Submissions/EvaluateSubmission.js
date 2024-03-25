
import NavbarWithProfileAndSidebar from "../../../components/Navbar/NavbarWithProfileAndSidebar";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import fetchAPI from '../../../Scripts/Axios';
import { toast } from 'react-toastify';
import DisplaySubmission from '../../../components/Tabs/DisplaySubmission';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Card } from "react-bootstrap";

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
    }, [_id]);

    console.log(submissionDetails);

    return (
        <>
            <NavbarWithProfileAndSidebar />
            <div className="container my-3" style={{ color: "white" }}>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <hr />
                        <div className="container">
                            <div className="row">
                                <div className="col d-flex align-items-center">
                                    <FontAwesomeIcon icon={faUserCircle} className="mr-2 px-3" />
                                    <p className="m-0">{submissionDetails?.Student.Name}</p>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <h1>Submission</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <DisplaySubmission submissions={submissionDetails?.Submission} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default EvaluateSubmission;