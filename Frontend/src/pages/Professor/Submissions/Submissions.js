import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchAPI } from '../../../Scripts/Axios'; // Assuming fetchAPI is a utility function to handle API requests
import { toast } from 'react-toastify';
import NavbarWithProfileAndSidebar from '../../../components/Navbar/NavbarWithProfileAndSidebar';
import SubmissionsList from '../../../components/List/SubmissionsList';


function Submissions() {
    const { LoginType } = useParams();
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
                            <SubmissionsList submissions={submissions} LoginType={LoginType} />
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Submissions;
