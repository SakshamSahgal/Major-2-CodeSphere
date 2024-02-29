import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
// import dotenv from 'dotenv';
// dotenv.config();

function TestSolutionCodeModal({ SolutionCodeToTest }) {
    const [showModal, setShowModal] = useState(false);
    const validationTestCaseRef = useRef(null);
    const expectedOutputRef = useRef(null);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const handleValidateSolutionCode = async () => {

        const validationTestCaseValue = validationTestCaseRef.current.value;
        const expectedOutputValue = expectedOutputRef.current.value;
        // console.log("Validation Test Cases:", validationTestCaseValue);
        // console.log("Expected Output:", expectedOutputValue);
        // console.log("Solution Code To Test:", SolutionCodeToTest);

        try {
            const socket = new WebSocket(`${process.env.REACT_APP_BACKEND_WS_LOCALHOST}/validateSolutionCode`);

            socket.onopen = () => {
                try {
                    console.log('WebSocket connection opened');
                    socket.send(JSON.stringify({
                        type: 'Validation',
                        SolutionCodeToTest: SolutionCodeToTest,
                        validationTestCaseValue: validationTestCaseValue,
                        expectedOutputValue: expectedOutputValue
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
                    if (response.success === false) {
                        toast.error(response.message);
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
            <Button variant="primary" onClick={handleShowModal} className="my-3 w-100 mb-3" >
                Validate Code
                <FontAwesomeIcon icon={faCode} className="ms-2" />
            </Button>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Validate Code
                        <FontAwesomeIcon icon={faCode} className="ms-2" />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="validationTestCases" className="my-3">
                        <Form.Label>Validation Test Cases</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Enter validation test cases..." ref={validationTestCaseRef} />
                    </Form.Group>
                    <Form.Group controlId="expectedOutput" className="my-3">
                        <Form.Label>Expected Output</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Enter expected output..." ref={expectedOutputRef} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleValidateSolutionCode} className='w-100'>
                        Test Code
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default TestSolutionCodeModal;
