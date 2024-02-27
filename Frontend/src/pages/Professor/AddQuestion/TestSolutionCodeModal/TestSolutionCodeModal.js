import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';

function TestSolutionCodeModal({ SolutionCodeToTest }) {
    const [showModal, setShowModal] = useState(false);
    const validationTestCasesRef = useRef(null);
    const expectedOutputRef = useRef(null);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const handleValidateSolutionCode = () => {
        const validationTestCasesValue = validationTestCasesRef.current.value;
        const expectedOutputValue = expectedOutputRef.current.value;
        console.log("Validation Test Cases:", validationTestCasesValue);
        console.log("Expected Output:", expectedOutputValue);
        console.log("Solution Code To Test:", SolutionCodeToTest);
        // Perform further validation or actions with these values
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
                        <Form.Control as="textarea" rows={3} placeholder="Enter validation test cases..." ref={validationTestCasesRef} />
                    </Form.Group>
                    <Form.Group controlId="expectedOutput" className="my-3">
                        <Form.Label>Expected Output</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Enter expected output..." ref={expectedOutputRef} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleValidateSolutionCode}>
                        Test Code
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default TestSolutionCodeModal;
