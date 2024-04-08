import { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons';
import AIAssistanceTabs from '../Tabs/AIAssistanceTabs';

function AIAssistanceModal() {

    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow} className='w-100'>
                <FontAwesomeIcon icon={faPerson} style={{ cursor: 'pointer', color: 'white' }} /> AI Help
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title> AI Help </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? <Spinner animation="border" role="status" /> : <AIAssistanceTabs />}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AIAssistanceModal;