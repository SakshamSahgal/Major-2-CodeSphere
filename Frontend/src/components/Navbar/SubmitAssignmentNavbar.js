import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import ProfileModal from '../Modal/profileModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import SubmitAssignmentModal from '../Modal/SubmitAssignmentModal';

function SubmitAssignmentNavbar({ _id, solutionCodes }) {
    const [showModal, setShowModal] = useState(false);
    const [profileData, setProfileData] = useState({});
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    const handlesShowProfileModal = async () => {
        try {
            const response = await axios.get('/getProfile', { withCredentials: true });
            console.log(response.data);
            if (response.data.success === false) {
                toast.error(response.data.message);
                return;
            }
            else {
                setProfileData(response.data.profile);
            }
            setShowModal(true);
        } catch (err) {
            toast.error(`Error fetching Profile: ${err}`);
        }
    }

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container fluid className="px-3">
                    {
                        <Navbar.Brand variant="primary" onClick={handleShow}>
                            <FontAwesomeIcon icon={faCode} style={{ color: 'white' }} />
                        </Navbar.Brand>
                    }
                    <SubmitAssignmentModal _id={_id} solutionCodes={solutionCodes} />
                    <FontAwesomeIcon icon={faUser} onClick={handlesShowProfileModal} style={{ cursor: 'pointer', color: 'white', border: '1px solid white', padding: '5px', borderRadius: '50%' }} />
                </Container>
            </Navbar>
            <ProfileModal show={showModal} onHide={() => setShowModal(false)} profileData={profileData} />
        </>
    );
}

export default SubmitAssignmentNavbar;
