import { useParams } from 'react-router-dom';
import NavbarWithProfileAndSidebar from '../../../components/Navbar/NavbarWithProfileAndSidebar';
import { useEffect, useState } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';
import SolveQuestion from './SolveQuestion';

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

    return (
        <>
            <NavbarWithProfileAndSidebar LoginType={"Student"} />
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h3 className="text-center my-3" style={{ color: "white" }}>{AssignmentDetails?.AssignmentName}</h3>
                    </div>
                </div>
                <SolveQuestion Questions={AssignmentDetails?.Questions} />
            </div>
        </>
    );
}

export default SolveAssignment;

