import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

function DryRunModal({ CodeToRun = "", AssignmentId = "", QuestionId = "" }) {
    const [show, setShow] = useState(false);
    const [ResponseMessage, setResponseMessage] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        HandleDryRun();
    }
    const HandleDryRun = () => {
        //Send the current solution code to the server for dry run
        console.log(CodeToRun);
        try {
            console.log("Code to run:", CodeToRun);
            console.log("AssignmentId:", AssignmentId);
            console.log("QuestionId:", QuestionId);
            
            const socket = new WebSocket(`${process.env.REACT_APP_BACKEND_WS_LOCALHOST}/students/assignments/runCode/${AssignmentId}/${QuestionId}`); //Create a new WebSocket connection

            socket.onopen = () => {
                try {
                    console.log('WebSocket connection opened');
                    socket.send(JSON.stringify({
                        type: 'DryRunCode',
                        CodeToRun: CodeToRun
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
            <Button variant="primary" onClick={handleShow} className='w-100'> Run </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Dry Run</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* only show this if it is not null */}
                    {
                        ResponseMessage &&
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="alert alert-primary mt-3 text-center" role="alert">
                                        <p>{ResponseMessage.message}</p>
                                        <p>{ResponseMessage.verdict}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
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

export default DryRunModal;