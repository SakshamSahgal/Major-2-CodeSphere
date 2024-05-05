import { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faLock } from '@fortawesome/free-solid-svg-icons';
import { putAPI } from '../../Scripts/Axios';
import { toast } from 'react-toastify';
import { Typewriter } from 'react-simple-typewriter';
import ReactMarkdown from 'react-markdown';


function AIAssistanceModal({ CodeToRun = "", ProblemStatement = "", AIAssistance = false }) {

    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(true);
        fetchAIResponse();
    }
    const [AIResponses, setAIResponses] = useState(null);

    const handleClose = () => {
        setShow(false);
        // Reset the AIResponses to null
        setAIResponses(null);
    }


    const fetchAIResponse = async () => {
        try {
            const response = await putAPI(`/getAIAssistance`, { code: CodeToRun, problem: ProblemStatement });
            if (response.data.success) {
                setAIResponses(response.data.response);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            {AIAssistance ? (
                <Button variant="primary" onClick={handleShow} className='w-100'>
                    <FontAwesomeIcon icon={faMicrochip} style={{ cursor: 'pointer', color: 'white' }} className='px-2' />
                    <Typewriter
                        words={['AI Help']}
                        loop={0}
                        cursor
                        cursorStyle='|'
                        typeSpeed={50}
                        delaySpeed={1000}
                    />
                </Button>
            ) : (
                <Button variant="secondary" disabled className='w-100'>
                    <FontAwesomeIcon icon={faLock} style={{ cursor: 'not-allowed' }} className='px-2' />
                    <Typewriter
                        words={['AI Help']}
                        loop={0}
                        cursor
                        cursorStyle='|'
                        typeSpeed={50}
                        delaySpeed={1000}
                    />
                </Button>
            )}

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <Typewriter
                            words={['AI Help']}
                            loop={0}
                            cursor
                            cursorStyle='|'
                            typeSpeed={50}
                            delaySpeed={1000}
                        />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {AIResponses ? (
                        <ReactMarkdown>{AIResponses}</ReactMarkdown>
                    ) : (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AIAssistanceModal;