import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import fetchAPI from '../../../Scripts/Axios'; // Assuming fetchAPI is a utility function to handle API requests
import { toast } from 'react-toastify';
import { ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import NavbarWithProfileAndSidebar from '../../../components/Navbar/NavbarWithProfileAndSidebar';

function Submissions() {
    const [submissions, setSubmissions] = useState(null);
    const { _id } = useParams();
    const { AssignmentName } = useParams();
    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await fetchAPI(`/professors/viewSubmissions/${_id}`);
                console.log(response.data);
                if (response.data.success) {
                    toast.success(response.data.message);
                    setSubmissions(response.data.submissions);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(`Error while fetching submissions, error: ${error.message}`);
            }
        };

        fetchSubmissions();
    }, [_id]);

    let Display;
    if (submissions === null) Display = <p>Loading...</p>;
    else if (submissions.length === 0) Display = <p>No Submissions Yet</p>;
    else {
        Display = (<ListGroup>

            {submissions.length ? (submissions.map((submission, index) => (
                <ListGroup.Item action key={index} className="d-flex justify-content-between align-items-center mb-2 rounded">
                    {submission.Student.Name}
                    <div className='mx-1'>{submission.ScoreObtained}/{submission.TotalScore}</div>
                    <FontAwesomeIcon icon={faEye} className='mx-1' />
                </ListGroup.Item>
            ))) : (
                <p style={{ color: "white" }} className='text-center'>No Submission Yet</p>
            )}

        </ListGroup>)
    }
    return (
        <>
        <NavbarWithProfileAndSidebar />
        <div style={{ color: "white" }}>
            <div className='container py-3 my-3'>
                <div className='row'>
                    <div className='col text-center'>
                        <h1>{AssignmentName}</h1>
                        <h5> Submissions </h5>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <hr />
                        {Display}
                        <hr />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Submissions;
