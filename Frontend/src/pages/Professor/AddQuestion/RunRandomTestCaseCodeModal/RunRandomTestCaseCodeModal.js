
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import VerdictBadge from '../../../../components/CommonComponents/VerdictBadge';

function RunRandomTestCaseCodeModal({ CodeToRun }) {
    const [showModal, setShowModal] = useState(false);

    // To display the ws response message from the server
    const [responseMessage, setResponseMessage] = useState(null);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => {
        setShowModal(true);
        console.log("Code to run:", CodeToRun);
        try {
            const socket = new WebSocket(`${process.env.REACT_APP_BACKEND_WS_LOCALHOST}/RunRandomTestCaseCode`);

            socket.onopen = () => {
                try {
                    console.log('WebSocket connection opened');
                    socket.send(JSON.stringify({
                        type: 'RunRandomTestCaseCode',
                        RandomTestCaseCode: CodeToRun
                    }));
                }
                catch (error) {
                    toast.error(error.message);
                    socket.close();
                }
            };

            // Event listener for incoming messages
            socket.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                    console.log(response);
                    setResponseMessage({
                        message: (response.message) ? response.message : '',
                        verdict: (response.verdict) ? response.verdict : ''
                    });
                    if (response.success === false) {
                        socket.close();
                    }
                }
                catch (error) {
                    toast.error(error.message);
                    socket.close();
                }
            };

            // Event listener for when the connection is closed
            socket.onclose = () => {
                console.log('WebSocket connection closed');
            };
        }
        catch (error) {
            toast.error(`Error while Creating a ws Connection, err : ${error.message}`);
        }

    }

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
                    {/* only show this if it is not null */}
                    {
                        responseMessage &&
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="alert alert-primary mt-3 text-center" role="alert">
                                        <p>{responseMessage.message}</p>
                                        <hr />
                                        {/* if verdict is a link then display it in anchor tag that opens in new tab */}
                                        {responseMessage.verdict.includes('http') ?
                                            <a href={responseMessage.verdict}
                                                target="_blank"
                                                rel="noreferrer">{"Link"}
                                            </a> :
                                           <VerdictBadge verdict={responseMessage.verdict} />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
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