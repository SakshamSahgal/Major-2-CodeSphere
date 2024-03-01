
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';

function RunRandomTestCaseCodeModal({ CodeToRun }) {
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    return (
        <>
            <Button variant="primary" onClick={handleShowModal} className='w-100'>
                Test Code
                <FontAwesomeIcon icon={faCode} className="ms-2" />
            </Button>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title> Test Code
                        <FontAwesomeIcon icon={faCode} className="ms-2" /></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>This is the modal body. You can put any content here.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className='w-100' onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default RunRandomTestCaseCodeModal;