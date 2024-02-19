import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function PendingAssignmentsList() {
    //   use bootstrap cards to display the pending assignments

    const [pendingAssignments, setPendingAssignments] = useState([]);

    useState(() => {
        const fetchPendingAssignments = async () => {
            try {
                const response = await axios.get(`/students/assignments/pending`, { withCredentials: true });
                console.log(response.data);
                if (response.data.success) {
                    toast.success(response.data.message);
                    setPendingAssignments(response.data.Assignments);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(`Error fetching Pending Assignments. Please try again later. err : ${error}`);
            }
        }
        fetchPendingAssignments();
    }, [])

    return (
        <div className="container px-3 my-1">
            <div className="row my-3">
                {pendingAssignments.length === 0 ? (<h6 className="text-light text-center">No Pending Assignments</h6>) : (

                    pendingAssignments.map((assignment, index) => {
                        return (
                            <div key={index} className="card my-3">
                                <div className="card-body">
                                    <h5 className="card-title">{assignment.AssignmentName}</h5>
                                    <p className="card-text">{assignment.Description}</p>
                                    <p className="card-text">Due Date: {assignment.DueDate}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default PendingAssignmentsList;