import { useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';


function SubmitAssignmentModal({ _id, solutionCodes }) {
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => {
        handleSubmitAssignment();
        setShowModal(true);
    }
    const socketRef = useRef(null);

    const handleSubmitAssignment = async () => {

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
                            solutionCodes: solutionCodes
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
                    }
                    catch (error) {
                        toast.error(error.message);
                        socket.close();
                    }
                }
            }

            socket.onclose = () => {
                console.log('WebSocket connection closed');
            };

        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            <Button variant="primary" onClick={handleShowModal}>
                Submit Evaluation
            </Button>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Submit Evaluation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>This is the modal body. You can put any content here.</p>
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
