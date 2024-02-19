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
        <div className="container px-3 my-1">
            <div className="row my-3">
                {missingAssignments.length === 0 ? (
                    <h6 className="text-light text-center">No Missing Assignments</h6>
                ) : (
                    missingAssignments.map((assignment, index) => (
                        <div key={index} className="card mb-3">
                            <h5 className="card-header text-center">{assignment.AssignmentName}</h5>
                            <div className="card-body">
                                <div className="assignment-details">
                                    <p className="card-text">
                                        <strong>Posted On:</strong>{" "}
                                        {convertIsoToNormalTime(assignment.PostedOn).date}{" "}
                                        {convertIsoToNormalTime(assignment.PostedOn).time}{" "}
                                        [ {getTimeElapsed(assignment.PostedOn)} ]
                                    </p>
                                    <p className="card-text">
                                        <strong>Due Timestamp:</strong>{" "}
                                        {convertIsoToNormalTime(assignment.DueTimestamp).date}{" "}
                                        {convertIsoToNormalTime(assignment.DueTimestamp).time}{" "}
                                        [ {getTimeElapsed(assignment.DueTimestamp)} ]
                                    </p>
                                    <p className="card-text">
                                        <strong>Batches:</strong>{" "}
                                        {assignment.Batches.join(", ")}
                                    </p>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-between">
                                <small className="text-muted">Posted By: {assignment.PostedBy.Name}</small>
                                <button className="btn btn-primary">View Questions</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MissingAssignmentsList;