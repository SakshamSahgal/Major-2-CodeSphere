import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import ProfileModal from '../Modal/profileModal';

function NavbarWithProfile() {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container fluid className="px-3">
                    <Navbar.Brand href="/">CodeSphere</Navbar.Brand>
                    <FontAwesomeIcon icon={faUser} onClick={() => setShowModal(true)} style={{ cursor: 'pointer', color: 'white' }} />
                </Container>
            </Navbar>
            <ProfileModal show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
}

export default NavbarWithProfile;
