import { useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';


function SubmitEvaluationModal() {
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const socketRef = useRef(null);

    const handleSubmitEvaluation = async () => {
        try {
            const socket = new WebSocket(`${process.env.REACT_APP_BACKEND_WS_LOCALHOST}/students/assignments/evaluateAssignment/:${123}`); //Create a new WebSocket connection
            socketRef.current = socket;

            socket.onopen = () => {
                console.log('WebSocket connection opened');
            };

            // Event listener for incoming messages
            socket.onmessage = (event) => {
                if (event.data === "start") {
                    try {
                        // socket.send(JSON.stringify({
                        //     CodeToRun: CodeToRun
                        // }));
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

export default SubmitEvaluationModal;
