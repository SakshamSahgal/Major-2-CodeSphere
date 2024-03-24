import { useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import LogsAccordion from '../Accordion/LogsAccordion';
import { Spinner } from 'react-bootstrap';
import GroupedResults from '../List/EvaluateAssignmentDisplay';

//_id is the assignment id and UserCodes is an array of objects with the following structure
// {
//     QuestionName: String,
//     UserCode: String,
//     QuestionId: String
// }
function SubmitAssignmentModal({ _id, UserCodes }) {
    const [showModal, setShowModal] = useState(false);              //This state stores whether the modal is open or not
    const [logsMessage, setLogsMessage] = useState([]);             //this state stores the logs of the dry run
    const [CurMessage, setCurMessage] = useState("");               //this state stores the current message of the Evaluation of the assignment
    const [isOpen, setIsOpen] = useState(true);                     // State to manage logs accordion open/close
    const [isLoading, setIsLoading] = useState(true);              //this state stores whether to display spinner or not
    const [verdictAndDecision, setverdictAndDecision] = useState([]);    //this state stores the verdict and decision of the questions of the assignment
    // console.log(verdict);
    const handleShowModal = () => {                                 //this function is called when the modal is opened
        handleEvaluateAssignment();
        setShowModal(true);
        setIsOpen(true);
        setIsLoading(true);
    }
    //this function is called when the modal is closed
    const handleCloseModal = () => {
        if (socketRef.current) {
            console.log('Closing the socket');
            socketRef.current.close();
        }
        setShowModal(false);
        setLogsMessage([]);
        setCurMessage("");
        setverdictAndDecision([]);
    }
    const socketRef = useRef(null);                                 //this ref is used to store the socket connection, so that it can be closed when the modal is closed

    const handleEvaluateAssignment = async () => {

        try {
            console.log(_id)
            const socket = new WebSocket(`${process.env.REACT_APP_BACKEND_WS_LOCALHOST}/students/assignments/evaluateAssignment/${_id}`); //Create a new WebSocket connection
            socketRef.current = socket;

            socket.onopen = () => {
                console.log('WebSocket connection opened');
            };

            // Event listener for incoming messages
            socket.onmessage = (event) => {
                if (event.data === "start") {  //if the server sends "start" message, send the data to the server
                    try {
                        socket.send(JSON.stringify({
                            UserCodes: UserCodes
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
                        if (response.success === false) {
                            socket.close();
                        }
                        if(response.type === "Final"){
                            //redirect to /students/assignments
                            window.location.href = "/students/assignments";
                        }
                        if (response.type === "logs") {
                            setLogsMessage((prev) => [...prev, response]); //Append the logs to the logsMessage state, to be displayed
                            setCurMessage(response); //Set the current message to the message received from the server
                        }
                        if (response.type === "Verdict" || response.type === "Decision") {
                            setverdictAndDecision((prev) => [...prev, response]); //Append the verdict to the verdict state, to be displayed
                        }
                    }
                    catch (error) {
                        toast.error(error.message);
                        socket.close();
                    }
                }
            }

            socket.onclose = () => {
                console.log('WebSocket connection closed');
                setIsLoading(false);
                setIsOpen(false);
            };

        } catch (error) {
            toast.error(error.message);
        }
    }


    return (
        <>
            <Button variant="primary" onClick={handleShowModal}>
                Submit Assignment
            </Button>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Submit Assignment
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{CurMessage.message}
                    </p>
                    {isLoading &&
                        <Spinner animation="border" role="status" />
                    }
                    <GroupedResults results={verdictAndDecision} />
                    <LogsAccordion results={logsMessage} isOpen={isOpen} setIsOpen={setIsOpen} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SubmitAssignmentModal;
