import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';
import AIAssistanceTabs from '../Tabs/AIAssistanceTabs';

function AIAssistanceModal() {

    const [show, setShow] = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow} className='w-100'>
                <FontAwesomeIcon icon={faMicrochip} style={{ cursor: 'pointer', color: 'white' }} /> AI Help
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title> AI Help </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AIAssistanceTabs />
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