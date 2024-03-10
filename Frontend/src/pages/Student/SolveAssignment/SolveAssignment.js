import { useParams } from 'react-router-dom';
import NavbarWithProfileAndSidebar from '../../../components/Navbar/NavbarWithProfileAndSidebar';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../../components/Spinners/Spinners';
import axios from 'axios';
import { toast } from 'react-toastify';
import SolveQuestion from './SolveQuestion';
import { Accordion, Card } from 'react-bootstrap';
import { convertIsoToNormalTime, getTimeElapsed } from '../../../Scripts/TimeFunctions';

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
            <NavbarWithProfileAndSidebar LoginType={"Student"} />
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Accordion flush>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header className="text-center my-3" style={{ cursor: 'pointer' }}>
                                    <h4>Assignment Details</h4>
                                </Accordion.Header>

                                <Accordion.Body>
                                    <p className="card-text">
                                        <strong>Posted On:</strong>{" "}
                                        {convertIsoToNormalTime(AssignmentDetails.PostedOn).date}{" "}
                                        {convertIsoToNormalTime(AssignmentDetails.PostedOn).time}{" "}
                                        <span className="text-muted">[ {getTimeElapsed(AssignmentDetails.PostedOn)} ] </span>
                                    </p>
                                    <p className="card-text">
                                        <strong>Due Timestamp:</strong>{" "}
                                        {convertIsoToNormalTime(AssignmentDetails.DueTimestamp).date}{" "}
                                        {convertIsoToNormalTime(AssignmentDetails.DueTimestamp).time}{" "}
                                        <span className="text-muted">[ {getTimeElapsed(AssignmentDetails.DueTimestamp)} ]</span>
                                    </p>
                                    <p className="card-text">
                                        <strong>Batches:</strong>{" "}
                                        {AssignmentDetails.Batches.map((batch, batchIndex) => (
                                            <span key={batchIndex} className="badge bg-secondary mx-1">
                                                {batch}
                                            </span>
                                        ))}
                                    </p>
                                    <p className='card-text'>
                                        <strong>Year:</strong>{" "}
                                        <span className="badge bg-success mx-1">{AssignmentDetails.Year}</span>
                                    </p>
                                    <p className='card-text'>
                                        <strong>Questions :</strong>{" "}
                                        <span className="badge bg-success mx-1">{AssignmentDetails.Questions.length}</span>
                                    </p>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </div>
                <SolveQuestion Questions={AssignmentDetails?.Questions} />
            </div>
        </>
    );
}

export default SolveAssignment;

