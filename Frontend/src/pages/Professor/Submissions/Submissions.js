import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import fetchAPI from '../../../Scripts/Axios'; // Assuming fetchAPI is a utility function to handle API requests
import { toast } from 'react-toastify';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function Submissions() {
    const [submissions, setSubmissions] = useState([]);
    const { _id } = useParams();

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

    return (
        <div style={{ color: "white" }}>
            <div className='container my-3'>
                <div className='row'>
                    <div className='col'>
                        <h1>Submissions</h1>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <ListGroup>
                            <hr />
                            {submissions.map((submission, index) => (
                                <ListGroup.Item action key={index} className="d-flex justify-content-between align-items-center mb-2 rounded">
                                    {submission.Student.Name}
                                    <div className='mx-1'>{submission.ScoreObtained}/{submission.TotalScore}</div>
                                    <FontAwesomeIcon icon={faEye} className='mx-1' />
                                </ListGroup.Item>
                            ))}
                            <hr />
                        </ListGroup>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Submissions;
