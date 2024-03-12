import { useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import StepsList from '../List/StepsList';
import LogsAccordion from '../Accordion/LogsAccordion';

function DryRunModal({ CodeToRun = "", AssignmentId = "", QuestionId = "" }) {

    const socketRef = useRef(null);
    const [show, setShow] = useState(false);                        //this state stores whether the modal is open or not
    const [logsMessage, setLogsMessage] = useState([]);             //this state stores the logs of the dry run
    const [ResponseMessage, setResponseMessage] = useState([]);     //this state stores the response of the dry run [success, failure, verdict, etc.
    const [isOpen, setIsOpen] = useState(true);                     // State to manage logs accordion open/close

    //this function is called when the modal is closed
    const handleClose = () => {
        if (socketRef.current) {
            console.log('Closing the socket');
            socketRef.current.close();
        }
        setShow(false);
    }
    //this function is called when the modal is opened
    const handleShow = () => {
        setLogsMessage([]);
        setResponseMessage([]);
        setIsOpen(true);
        setShow(true);
        HandleDryRun();
    }
    //this function is called to handle the dry run ws connection
    const HandleDryRun = () => {
        //Send the current solution code to the server for dry run
        try {
            const socket = new WebSocket(`${process.env.REACT_APP_BACKEND_WS_LOCALHOST}/students/assignments/runCode/${AssignmentId}/${QuestionId}`); //Create a new WebSocket connection
            socketRef.current = socket;

            socket.onopen = () => {
                console.log('WebSocket connection opened');
            };

            // Event listener for incoming messages
            socket.onmessage = (event) => {
                if (event.data === "start") {
                    try {
                        socket.send(JSON.stringify({
                            CodeToRun: CodeToRun
                        }));
                    }
                    catch (error) {
                        toast.error(error.message);
                        socket.close();
                    }
                } else {
                    try {
                        const response = JSON.parse(event.data);
                        console.log(response);
                        if (response.phase) {
                            if ((response.phase === "Verdict") || (response.phase === "Decision")) {
                                setResponseMessage((prev) => [...prev, response]);
                            }
                            else
                                setLogsMessage((prev) => [...prev, response]);
                        }
                        if (response.success === false) {
                            socket.close();
                        }
                    }
                    catch (error) {
                        toast.error(error.message);
                        socket.close();
                    }
                }
            };

            // Event listener for when the connection is closed
            socket.onclose = () => {
                console.log('WebSocket connection closed');
                setIsOpen(false);
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
                    <StepsList results={ResponseMessage} />
                    <LogsAccordion results={logsMessage} isOpen={isOpen} setIsOpen={setIsOpen} />
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