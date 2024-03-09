import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getTimeElapsed, convertIsoToNormalTime } from "../../../Scripts/TimeFunctions";
import AssignmentListSkeleton from "../../../components/Skeletons/AssignmentListSkeleton";

//List Type can be 'Pending', 'Missed' or 'Submitted'
function AssignmentList({ listType }) {
    const [assignments, setAssignments] = useState(null);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.get(`/students/assignments/${listType.toLowerCase()}`, { withCredentials: true });
                console.log(response.data);
                if (response.data.success) {
                    // toast.success(response.data.message);
                    setAssignments(response.data.Assignments);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(`Error fetching ${listType} Assignments. Please try again later. err : ${error}`);
            }
        }
        fetchAssignments();
    }, [listType])

    // Return the skeleton while data is being fetched
    if (assignments === null) {
        return (
            <AssignmentListSkeleton count={1}/>
        );
    }

    return (
        <div className="container px-1 my-1">
            {assignments.length === 0 ? (
                <h6 className="text-light text-center">No {listType} Assignments</h6>
            ) : (
                assignments.map((assignment, index) => (
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
                                    {/* show a solve button if the listType is Pending */}
                                    {listType === "Pending" && (
                                        <a href={`/students/solveAssignment/${assignment._id}`} className="btn btn-success btn-sm d-block d-sm-inline-block">Solve</a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default AssignmentList;
