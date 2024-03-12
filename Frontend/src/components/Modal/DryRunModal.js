import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import StepsList from '../List/StepsList';

function DryRunModal({ CodeToRun = "", AssignmentId = "", QuestionId = "" }) {
    const [show, setShow] = useState(false);                        //this state stores whether the modal is open or not
    const [ResponseMessage, setResponseMessage] = useState([]);     //this state stores the response message from the server websockets
    const handleClose = () => setShow(false);                       //this function is called when the modal is closed

    const handleShow = () => {
        setResponseMessage([]);
        setShow(true);
        HandleDryRun();
    }
    const HandleDryRun = () => {
        //Send the current solution code to the server for dry run
        try {
            const socket = new WebSocket(`${process.env.REACT_APP_BACKEND_WS_LOCALHOST}/students/assignments/runCode/${AssignmentId}/${QuestionId}`); //Create a new WebSocket connection

            socket.onopen = () => {
                try {
                    console.log('WebSocket connection opened');
                    //send after 1 sec
                    setTimeout(() => {
                        socket.send(JSON.stringify({
                            type: 'DryRunCode',
                            CodeToRun: CodeToRun
                        }));
                    }, 1000);
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
                    if (response.phase) {
                        setResponseMessage((prev) => [...prev, response]);
                    }
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

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Dry Run</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {ResponseMessage.length > 0 ? <StepsList results={ResponseMessage} /> : <p>Running...</p>}
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