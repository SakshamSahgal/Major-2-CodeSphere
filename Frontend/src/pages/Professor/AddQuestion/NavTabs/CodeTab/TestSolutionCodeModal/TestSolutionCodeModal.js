import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

import VerdictBadge from "../../../../../../components/CommonComponents/VerdictBadge"
import CharacterCounter from "../../../../../../components/CommonComponents/CharacterCounter"


function TestSolutionCodeModal({ SolutionCodeToTest }) {
    const [showModal, setShowModal] = useState(false);
    const validationTestCaseRef = useRef(null);
    const expectedOutputRef = useRef(null);

    // To display the ws response message from the server
    const [responseMessage, setResponseMessage] = useState(null);

    const handleCloseModal = () => {
        setShowModal(false);
        setResponseMessage(null);
    }
    const handleShowModal = () => setShowModal(true);

    const handleValidateSolutionCode = async () => {

        // console.log("Validation Test Cases:", validationTestCaseRef.current.value);
        // console.log("Expected Output:", expectedOutputRef.current.value);
        // console.log("Solution Code To Test:", SolutionCodeToTest);

        try {
            const socket = new WebSocket(`${process.env.REACT_APP_SERVER_WS_URL}/validateSolutionCode`);
            console.log("REACT_APP_SERVER_WS_URL", process.env.REACT_APP_SERVER_WS_URL);
            socket.onopen = () => {
                try {
                    console.log('WebSocket connection opened');
                    socket.send(JSON.stringify({
                        type: 'Validation',
                        SolutionCodeToTest: SolutionCodeToTest,
                        validationTestCaseValue: validationTestCaseRef.current.value,
                        expectedOutputValue: expectedOutputRef.current.value
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
            <Button variant="primary" onClick={handleShowModal} className="my-3 w-100 mb-3" >
                Validate Code
                <FontAwesomeIcon icon={faCode} className="ms-2" />
            </Button>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Validate Code
                        <FontAwesomeIcon icon={faCode} className="ms-2" />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="validationTestCase" className="my-3">
                        <Form.Label>Validation Input Test Case</Form.Label>
                        <Form.Control as="textarea" rows={3} maxLength={200} placeholder="Enter validation input test case..." ref={validationTestCaseRef} />
                        <CharacterCounter maxLength={200} textAreaRef={validationTestCaseRef} />
                    </Form.Group>
                    <Form.Group controlId="expectedOutput" className="my-3">
                        <Form.Label>Expected Output</Form.Label>
                        <Form.Control as="textarea" rows={3} maxLength={200} placeholder="Enter expected output..." ref={expectedOutputRef} />
                        <CharacterCounter maxLength={200} textAreaRef={expectedOutputRef} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleValidateSolutionCode} className='w-100'>
                        Test Code
                    </Button>
                    {/* only show this if it is not null */}
                    {
                        responseMessage &&
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="alert alert-primary mt-3 text-center" role="alert">
                                        <p>{responseMessage.message}</p>
                                        <hr />
                                        <p className="mb-0">{<VerdictBadge verdict={responseMessage.verdict} />}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                </Modal.Footer>
            </Modal>
        </>
    );
}

export default TestSolutionCodeModal;
