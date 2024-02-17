import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import ProfileModal from '../Modal/profileModal';
import Offcanvas from 'react-bootstrap/Offcanvas';

function NavbarWithProfileAndSidebar({ TabNames, TabLinks }) {
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container fluid className="px-3">

                    <Navbar.Brand variant="primary" onClick={handleShow}>
                        <FontAwesomeIcon icon={faBars} style={{ cursor: 'pointer', color: 'white' }} />
                    </Navbar.Brand>

                    <Offcanvas show={show} onHide={handleClose} className="bg-dark text-light">
                        <Offcanvas.Header closeButton className="border-bottom border-dark">
                            <Offcanvas.Title className="text-light">CodeSphere</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <ul className="nav nav-pills flex-column mb-auto">
                                {/* iterate over tabnames and tablinks */}
                                {TabNames.map((tab, index) => (
                                    <li key={index} className="nav-item">
                                        {/* make only the first one active */}
                                        <a href={TabLinks[index]} className={`nav-link ${index === 0 ? 'active' : ''}`} aria-current="page">{tab}</a>
                                    </li>
                                ))}
                            </ul>
                        </Offcanvas.Body>
                    </Offcanvas>
                    <FontAwesomeIcon icon={faUser} onClick={() => setShowModal(true)} style={{ cursor: 'pointer', color: 'white' }} />
                </Container>
            </Navbar>
            <ProfileModal show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
}

export default NavbarWithProfileAndSidebar;
