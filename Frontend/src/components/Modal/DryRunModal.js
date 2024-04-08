import { useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import GroupedResults from '../List/EvaluateAssignmentDisplay';
import LogsAccordion from '../Accordion/LogsAccordion';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';

function DryRunModal({ CodeToRun = "", AssignmentId = "", QuestionId = "" }) {

    const socketRef = useRef(null);
    const [show, setShow] = useState(false);                        //this state stores whether the modal is open or not
    const [logsMessage, setLogsMessage] = useState([]);             //this state stores the logs of the dry run
    const [verdictAndDecision, setverdictAndDecision] = useState([]);     //this state stores the response of the dry run [success, failure, verdict, etc.
    const [isOpen, setIsOpen] = useState(true);                     // State to manage logs accordion open/close
    const [isLoading, setIsLoading] = useState(true);              //this state stores whether to display spinner or not

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
        setverdictAndDecision([]);
        setIsOpen(true);
        setShow(true);
        setIsLoading(true);
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
                        if (response.type) {
                            if (response.type === "logs")
                                setLogsMessage((prev) => [...prev, response]);
                            else
                            setverdictAndDecision((prev) => [...prev, response]);
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
                setIsLoading(false);
            };
        }
        catch (error) {
            toast.error(`Error while Creating a ws Connection, err : ${error.message}`);
        }
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow} className='w-100'>
                <FontAwesomeIcon icon={faCode} style={{ cursor: 'pointer', color: 'white' }} /> Run
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isLoading ? (
                        <Spinner animation="border" role="status" />
                    ) : (
                        'Dry Run'
                    )}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GroupedResults results={verdictAndDecision} />
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