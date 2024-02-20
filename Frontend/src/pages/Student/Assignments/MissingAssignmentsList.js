import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { getTimeElapsed, convertIsoToNormalTime } from "../../../Scripts/TimeFunctions";

function MissingAssignmentsList() {
    const [missingAssignments, setMissingAssignments] = useState([]);

    useEffect(() => {
        const fetchMissingAssignments = async () => {
            try {
                const response = await axios.get(`/students/assignments/missed`, { withCredentials: true });
                console.log(response.data);
                if (response.data.success) {
                    toast.success(response.data.message);
                    setMissingAssignments(response.data.Assignments);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(`Error fetching Missed Assignments. Please try again later. err : ${error}`);
            }
        }
        fetchMissingAssignments();
    }, [])

    return (
        <div className="container px-1 my-1">

            {missingAssignments.length === 0 ? (
                <h6 className="text-light text-center">No Missing Assignments</h6>
            ) : (
                missingAssignments.map((assignment, index) => (
                    <div key={index} className="row my-3 w-100">
                        <div className="col">
                            <div className="card">
                                <div className="card-header d-flex align-items-center">
                                    <small className="text-muted">Posted By: {assignment.PostedBy.Name}</small>
                                    <h5 className="text-center mb-0 flex-grow-1">{assignment.AssignmentName}</h5>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <p className="card-text">
                                            <strong>Posted On:</strong>{" "}
                                            {convertIsoToNormalTime(assignment.PostedOn).date}{" "}
                                            {convertIsoToNormalTime(assignment.PostedOn).time}{" "}
                                            <span className="text-muted">[ {getTimeElapsed(assignment.PostedOn)} ] </span>
                                        </p>
                                        <p className="card-text">
                                            <strong>Due Timestamp:</strong>{" "}
                                            {convertIsoToNormalTime(assignment.DueTimestamp).date}{" "}
                                            {convertIsoToNormalTime(assignment.DueTimestamp).time}{" "}
                                            <span className="text-muted">[ {getTimeElapsed(assignment.DueTimestamp)} ]</span>
                                        </p>
                                        <p className="card-text">
                                            <strong>Batches:</strong>{" "}
                                            {assignment.Batches.map((batch, batchIndex) => (
                                                <span key={batchIndex} className="badge bg-secondary mx-1">
                                                    {batch}
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                </div>
                                <div className="card-footer d-flex justify-content-between">
                                    <button className="btn btn-primary btn-sm d-block d-sm-inline-block"> Questions ({assignment.Questions.length}) </button>
                                    <button className="btn btn-primary btn-sm d-block d-sm-inline-block"> Submissions ({assignment.SubmittedBy.length}) </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}

        </div>
    );
}

export default MissingAssignmentsList;